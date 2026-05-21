import { Response } from 'express';
import Call from '../models/Call';
import { AuthRequest } from '../middleware/auth';
import { gatherDTMF, playTts, resolveTelnyxEventIdentifiers, verifyWebhookSignature } from '../services/telnyxService';

type RawBodyRequest = AuthRequest & { rawBody?: string };

const extractHeaders = (req: RawBodyRequest) => ({
  'x-telnyx-signature-ed25519': req.headers['x-telnyx-signature-ed25519'] as string | undefined,
  'x-telnyx-timestamp': req.headers['x-telnyx-timestamp'] as string | undefined,
});

export const telnyxWebhook = async (req: RawBodyRequest, res: Response) => {
  try {
    const rawBody = req.rawBody || JSON.stringify(req.body || {});
    const verification = verifyWebhookSignature(rawBody, extractHeaders(req));

    if (!verification.verified) {
      return res.status(401).json({ error: `Webhook verification failed: ${verification.reason}` });
    }

    const { event, telnyxCallId, callControlId, rawPayload } = resolveTelnyxEventIdentifiers(req.body);
    const orConditions: Array<{ telnyxCallId?: string } | { callControlId?: string }> = [];
    if (telnyxCallId) {
      orConditions.push({ telnyxCallId });
    }
    if (callControlId) {
      orConditions.push({ callControlId });
    }

    if (orConditions.length === 0) {
      return res.status(200).json({ ok: true, ignored: true, reason: 'no call identifiers present' });
    }

    const call = await Call.findOne({ $or: orConditions });

    if (!call) {
      return res.status(200).json({ ok: true, ignored: true, event });
    }

    call.events.push({
      event,
      timestamp: new Date(),
      payload: rawPayload,
    });

    const normalizedEvent = event.toLowerCase();

    if (normalizedEvent.includes('ring')) {
      call.status = 'ringing';
    } else if (normalizedEvent.includes('answer')) {
      call.status = 'answered';
      call.answeredAt = call.answeredAt || new Date();

      const promptText = call.promptText || `Hello, this is Ustaad. We have a service request for ${call.serviceType || 'the requested service'} at ${call.serviceLocation || 'the service location'}. What time can you provide the service?`;
      const speakResult = await playTts({
        callControlId: call.callControlId,
        telnyxCallId: call.telnyxCallId,
        text: promptText,
      });
      const gatherResult = await gatherDTMF({
        callControlId: call.callControlId,
        telnyxCallId: call.telnyxCallId,
        digits: 1,
        timeout: 10,
      });

      call.events.push({
        event: 'call.availability_prompt_sent',
        timestamp: new Date(),
        payload: { promptText, speakResult, gatherResult },
      });
    } else if (normalizedEvent.includes('complete') || normalizedEvent.includes('hangup')) {
      call.status = 'completed';
      call.completedAt = new Date();
    } else if (normalizedEvent.includes('fail') || normalizedEvent.includes('error')) {
      call.status = 'failed';
      call.failureReason = typeof rawPayload?.error === 'string'
        ? rawPayload.error
        : typeof rawPayload?.message === 'string'
          ? rawPayload.message
          : call.failureReason;
    }

    const dtmfDigit = typeof rawPayload?.dtmf === 'string'
      ? rawPayload.dtmf
      : typeof rawPayload?.digit === 'string'
        ? rawPayload.digit
        : undefined;

    if (dtmfDigit) {
      call.dtmfInputs.push({ digit: dtmfDigit, timestamp: new Date() });
    }

    if (typeof rawPayload?.recording_url === 'string') {
      call.recordingUrl = rawPayload.recording_url;
    }

    await call.save();

    return res.status(200).json({ ok: true, event, callId: call._id, status: call.status });
  } catch (error) {
    console.error('Telnyx webhook error:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
};