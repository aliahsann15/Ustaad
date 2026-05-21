import { Request, Response } from 'express';
import ServiceRequest from '../models/ServiceRequest';
import Booking from '../models/Booking';
import { runAgenticWorkflow } from '../agent/orchestrator';
import { AuthRequest } from '../middleware/auth';

export const createServiceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.uid || req.body.userId;
    const rawText = req.body.rawText || req.body.requestText || req.body.queryText || req.body.text;

    if (!userId) {
      return res.status(400).json({ error: 'User id is required' });
    }

    if (!rawText) {
      return res.status(400).json({ error: 'Request text is required' });
    }

    // 1. Create Initial Request
    const serviceRequest = new ServiceRequest({
      userId,
      rawText,
      status: 'pending'
    });
    await serviceRequest.save();

    // 2. Trigger the Antigravity Agent Orchestrator
    const agentResult = await runAgenticWorkflow(
      serviceRequest._id.toString(), 
      rawText,
      userId
    );

    let booking = null;
    if (agentResult && (agentResult as any).booking) {
      booking = await Booking.findById((agentResult as any).booking._id).populate('providerId');
    }

    // Prefer agent-provided matches (recommendedProvider / matchedProviders). Do NOT return any pricing information.
    res.status(201).json({
      serviceRequest,
      agentResult,
      booking: booking || null,
      recommendedProvider: agentResult.recommendedProvider || null,
      otherProviders: agentResult.otherProviders || [],
      matchedProviders: agentResult.matchedProviders || [],
      intent: agentResult.intent || serviceRequest.extractedIntent || null,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getServiceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id).populate('userId');
    if (!serviceRequest) return res.status(404).json({ error: 'Service Request not found' });
    res.status(200).json(serviceRequest);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateServiceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const serviceRequest = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!serviceRequest) return res.status(404).json({ error: 'Service Request not found' });
    res.status(200).json(serviceRequest);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
