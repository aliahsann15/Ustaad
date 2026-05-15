import { Request, Response } from 'express';
import ServiceRequest from '../models/ServiceRequest';
import { runAgenticWorkflow } from '../agent/orchestrator';

export const createServiceRequest = async (req: Request, res: Response) => {
  try {
    // 1. Create Initial Request
    const serviceRequest = new ServiceRequest({
      userId: req.body.userId,
      rawText: req.body.rawText,
      status: 'pending'
    });
    await serviceRequest.save();

    // 2. Trigger the Antigravity Agent Orchestrator
    const agentResult = await runAgenticWorkflow(
      serviceRequest._id.toString(), 
      req.body.rawText,
      req.body.userId
    );

    res.status(201).json({ serviceRequest, agentResult });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getServiceRequest = async (req: Request, res: Response) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id).populate('userId');
    if (!serviceRequest) return res.status(404).json({ error: 'Service Request not found' });
    res.status(200).json(serviceRequest);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateServiceRequest = async (req: Request, res: Response) => {
  try {
    const serviceRequest = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!serviceRequest) return res.status(404).json({ error: 'Service Request not found' });
    res.status(200).json(serviceRequest);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
