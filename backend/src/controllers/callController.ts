import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Call from '../models/Call';
import Provider from '../models/Provider';
import ServiceRequest from '../models/ServiceRequest';
import { buildAvailabilityPrompt, gatherDTMF, hangupCall, placeCall } from '../services/telnyxService';

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : undefined);

const getServiceTypeAndLocation = async (serviceRequestId?: string, callOptions?: any) => {
  let serviceType = normalizeText(callOptions?.serviceType);
  let serviceLocation = normalizeText(callOptions?.serviceLocation);

  if (serviceRequestId) {
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    const extracted = serviceRequest?.extractedIntent;
    serviceType = serviceType || normalizeText(extracted?.serviceType);
    serviceLocation = serviceLocation || normalizeText(extracted?.addressText);
  }

  return { serviceType, serviceLocation };
};

export const createCall = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    const providerId = req.body.providerId;
    const serviceRequestId = req.body.serviceRequestId;
    const callOptions = req.body.callOptions || {};

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!providerId) {
      return res.status(400).json({ error: 'providerId is required' });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    if (!provider.phoneNumber) {
      return res.status(400).json({ error: 'Provider phone number is missing' });
    }

    if (!provider.isVerified) {
      return res.status(400).json({ error: 'Provider phone number is not verified' });
    }

    const { serviceType, serviceLocation } = await getServiceTypeAndLocation(serviceRequestId, callOptions);
    const promptText = buildAvailabilityPrompt({ serviceType, serviceLocation });

    const call = new Call({
      userId,
      providerId,
      serviceRequestId: serviceRequestId || undefined,
      fromNumber: process.env.TELNYX_FROM_NUMBER,
      toNumber: provider.phoneNumber,
      serviceType,
      serviceLocation,
      promptText,
      status: 'requested',
      events: [{ event: 'call.requested', timestamp: new Date(), payload: { callOptions, promptText } }],
    });

    await call.save();

    const telnyxResult = await placeCall({
      callId: call._id.toString(),
      to: provider.phoneNumber,
      from: process.env.TELNYX_FROM_NUMBER,
      serviceType,
      serviceLocation,
      serviceRequestId: serviceRequestId || undefined,
    });

    call.telnyxCallId = telnyxResult.telnyxCallId;
    call.callControlId = telnyxResult.callControlId;
    call.status = 'initiated';
    call.events.push({
      event: telnyxResult.mock ? 'call.mock_initiated' : 'call.initiated',
      timestamp: new Date(),
      payload: { telnyxResult, promptText },
    });
    await call.save();

    return res.status(201).json({
      call,
      promptText,
      nextStepMessage: 'Provider call initiated. The agent will ask for their availability time at the service location.',
      mockMode: telnyxResult.mock,
    });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const getCall = async (req: AuthRequest, res: Response) => {
  try {
    const call = await Call.findById(req.params.id)
      .populate('providerId')
      .populate('serviceRequestId');

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (req.user?.uid && call.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.status(200).json(call);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const hangupCallById = async (req: AuthRequest, res: Response) => {
  try {
    const call = await Call.findById(req.params.id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (req.user?.uid && call.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const telnyxResult = await hangupCall({
      callControlId: call.callControlId,
      telnyxCallId: call.telnyxCallId,
    });

    call.status = 'cancelled';
    call.events.push({
      event: 'call.hangup_requested',
      timestamp: new Date(),
      payload: { telnyxResult },
    });
    await call.save();

    return res.status(200).json({ call, telnyxResult });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const promptForAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const call = await Call.findById(req.params.id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const promptText = buildAvailabilityPrompt({
      serviceType: call.serviceType,
      serviceLocation: call.serviceLocation,
    });

    const telnyxResult = await gatherDTMF({
      callControlId: call.callControlId,
      telnyxCallId: call.telnyxCallId,
      digits: 1,
      timeout: 10,
    });

    call.promptText = promptText;
    call.events.push({
      event: 'call.availability_prompt_requested',
      timestamp: new Date(),
      payload: { promptText, telnyxResult },
    });
    await call.save();

    return res.status(200).json({ call, promptText, telnyxResult });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};