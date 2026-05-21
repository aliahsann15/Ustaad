import { GoogleGenAI } from '@google/genai';
import AgentTrace from '../models/AgentTrace';
import ServiceRequest from '../models/ServiceRequest';
import Booking from '../models/Booking';
import { searchProvidersTool } from './tools';

// Ensure you export GOOGLE_API_KEY or set it in .env, @google/genai automatically picks up GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const runAgenticWorkflow = async (serviceRequestId: string, rawText: string, userId: string) => {
  console.log(`\n[AGENT] Starting workflow for request: ${serviceRequestId}`);
  
  // Initialize trace for transparency
  const trace = new AgentTrace({ serviceRequestId, steps: [] });
  const logStep = async (action: string, description: string, metadata?: any) => {
    trace.steps.push({ timestamp: new Date(), action, description, metadata });
    await trace.save();
    console.log(`[AGENT ${action}] ${description}`);
  };

  try {
    await logStep('OBSERVE', `Received raw natural language request: "${rawText}"`);

    // STEP 1: Intent Extraction
    await logStep('REASON', 'I need to extract the service type, urgency, and constraints from the noisy input.');
    
    const extractionPrompt = `
      You are an AI assistant for a home services app in Pakistan. 
      Extract the intent from the following user request (which may be in Urdu, Roman Urdu, or English).
      Return ONLY a strict JSON object with the following schema:
      {
        "serviceType": "string (the specific type of professional needed, e.g., plumber, tutor, mechanic, beautician, etc.)",
        "urgency": "low" | "medium" | "high",
        "priceSensitivity": "low" | "medium" | "high",
        "addressText": "string",
        "complexity": "basic" | "intermediate" | "expert"
      }
      User Request: "${rawText}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: extractionPrompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const intent = JSON.parse(response.text || '{}');
    await logStep('TOOL_RESULT', `Extracted Intent: ${JSON.stringify(intent)}`, intent);

    await ServiceRequest.findByIdAndUpdate(serviceRequestId, { 
      extractedIntent: intent,
      status: 'matched' 
    });

    // STEP 2: Provider Matching
    await logStep('REASON', `I will now find the best provider for ${intent.serviceType} prioritizing rating and on-time score, considering urgency is ${intent.urgency}.`);
    
    let maxBudget = undefined;
    if (intent.priceSensitivity === 'high') maxBudget = 1000; // arbitrary threshold for demo
    
    // Get Request location to pass to search
    const requestDoc = await ServiceRequest.findById(serviceRequestId);
    let lat = 33.6844; // Default fallback (Islamabad)
    let lng = 73.0479;
    if (requestDoc?.extractedIntent?.location?.coordinates && requestDoc.extractedIntent.location.coordinates.length === 2) {
      lng = requestDoc.extractedIntent.location.coordinates[0];
      lat = requestDoc.extractedIntent.location.coordinates[1];
    }

    const searchResult = await searchProvidersTool(intent.serviceType, intent.urgency, lat, lng, maxBudget);
    
    if (searchResult.error || !searchResult.matchedProviders || searchResult.matchedProviders.length === 0) {
      await logStep('EVALUATE', 'No providers found. Workflow failed.');
      await ServiceRequest.findByIdAndUpdate(serviceRequestId, { status: 'failed' });
      return { status: 'failed', reason: 'No providers available.' };
    }

    const bestProvider = searchResult.matchedProviders[0].provider;
    await logStep('TOOL_RESULT', `Matched Provider: ${bestProvider.name} (Score: ${searchResult.matchedProviders[0].matchScore})`, { providerId: bestProvider._id, name: bestProvider.name });

    // STEP 3: Prepare provider recommendations (top 4)
    await logStep('REASON', `Preparing top provider recommendations for ${intent.serviceType}. Returning best match and three alternatives.`);

    // Limit to top 4 providers
    const topMatches = searchResult.matchedProviders.slice(0, 4);
    const matchedProviders = topMatches.map(mp => ({ provider: mp.provider, matchScore: mp.matchScore }));
    const recommendedProvider = matchedProviders[0]?.provider || null;

    await logStep('TOOL_RESULT', `Recommended provider: ${recommendedProvider?.name || 'none'}`, { recommendedProviderId: recommendedProvider?._id, count: matchedProviders.length });

    // Update service request and return provider recommendations. Do NOT create bookings or expose pricing.
    await ServiceRequest.findByIdAndUpdate(serviceRequestId, { status: 'matched', matchedProviders: matchedProviders.map(m => m.provider._id) });

    return { status: 'success', intent, recommendedProvider, otherProviders: matchedProviders.slice(1).map(m => m.provider), matchedProviders };

  } catch (error) {
    await logStep('EVALUATE', `Critical Error during workflow: ${(error as Error).message}`);
    return { status: 'error', error: (error as Error).message };
  }
};
