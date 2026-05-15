import { GoogleGenAI } from '@google/genai';
import AgentTrace from '../models/AgentTrace';
import ServiceRequest from '../models/ServiceRequest';
import Booking from '../models/Booking';
import { searchProvidersTool, calculatePricingTool, contactProviderMockTool } from './tools';

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

    // STEP 3: Dynamic Pricing
    await logStep('REASON', `I need to calculate the estimated price for provider ${bestProvider.name} based on their base rate of ${bestProvider.baseRatePerHour}.`);
    
    const priceBreakdown = calculatePricingTool(bestProvider.baseRatePerHour, intent.urgency, intent.complexity || 'basic', 5.0);
    
    await logStep('TOOL_RESULT', `Calculated Price: Total Estimated PKR ${priceBreakdown.totalEstimated}`, priceBreakdown);

    // STEP 4: WhatsApp Booking Simulation
    await logStep('ACT', `I am sending a WhatsApp message to ${bestProvider.name} to confirm the job.`);
    
    const contactResult = await contactProviderMockTool(bestProvider._id.toString(), `Job: ${intent.serviceType} at ${intent.addressText}`);
    
    await logStep('TOOL_RESULT', `Provider Response: ${contactResult.message}`);

    // STEP 5: Final Evaluation
    if (contactResult.status === 'accepted') {
      await logStep('EVALUATE', 'Provider accepted the job. Creating final booking record.');
      
      const booking = new Booking({
        serviceRequestId,
        userId,
        providerId: bestProvider._id,
        scheduledTime: new Date(Date.now() + 3600000), // Default 1 hr from now
        priceBreakdown,
        status: 'confirmed'
      });
      await booking.save();

      await logStep('ACT', 'Booking confirmed and saved to database.', { bookingId: booking._id });
      return { status: 'success', booking, intent };

    } else {
      await logStep('EVALUATE', 'Provider declined. (In a production agent, I would enter a loop to retry with the next best provider). Marking as failed for now.');
      return { status: 'failed', reason: 'Provider declined' };
    }

  } catch (error) {
    await logStep('EVALUATE', `Critical Error during workflow: ${(error as Error).message}`);
    return { status: 'error', error: (error as Error).message };
  }
};
