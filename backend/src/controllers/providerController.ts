import { Request, Response } from 'express';
import Provider from '../models/Provider';

export const createProvider = async (req: Request, res: Response) => {
  try {
    const provider = new Provider(req.body);
    await provider.save();
    res.status(201).json(provider);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getProvider = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ error: 'Provider not found' });
    res.status(200).json(provider);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getAllProviders = async (req: Request, res: Response) => {
  try {
    const providers = await Provider.find();
    res.status(200).json(providers);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateProvider = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!provider) return res.status(404).json({ error: 'Provider not found' });
    res.status(200).json(provider);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
