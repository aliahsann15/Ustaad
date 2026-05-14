import { Request, Response } from 'express';
import ServiceRequest from '../models/ServiceRequest';

export const createServiceRequest = async (req: Request, res: Response) => {
  try {
    const serviceRequest = new ServiceRequest(req.body);
    await serviceRequest.save();
    res.status(201).json(serviceRequest);
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
