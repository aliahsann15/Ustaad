import crypto from 'crypto';

type TelnyxCallCreationResult = {
  callId: string;
  telnyxCallId?: string;
  callControlId?: string;
  mock: boolean;
  rawResponse?: unknown;
};

type CallActionResult = {
  success: boolean;
  mock: boolean;
  rawResponse?: unknown;
};

type CallActionPayload = {
  callControlId?: string;
  telnyxCallId?: string;
  text?: string;
  digits?: number;
  timeout?: number;
};

const TELNYX_API_BASE_URL = 'https://api.telnyx.com/v2';

const isPlainObject = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));

const getConfig = () => ({
  apiKey: process.env.TELNYX_API_KEY,
  connectionId: process.env.TELNYX_CONNECTION_ID,
  fromNumber: process.env.TELNYX_FROM_NUMBER,
  webhookSecret: process.env.TELNYX_WEBHOOK_SECRET,
  webhookUrl: process.env.TELNYX_WEBHOOK_URL,
  allowMock: process.env.TELNYX_ALLOW_MOCK === 'true',
  actionBaseUrl: process.env.TELNYX_CALL_ACTION_BASE_URL || `${TELNYX_API_BASE_URL}/calls`,
});

const buildAuthorizationHeaders = () => {
  const { apiKey } = getConfig();
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  return headers;
};

const recordCallAction = async (action: string, payload: CallActionPayload): Promise<CallActionResult> => {
  const { apiKey, allowMock, actionBaseUrl } = getConfig();

  if (!apiKey || allowMock) {
    console.log(`[TELNYX MOCK] ${action}`, payload);
    return { success: true, mock: true, rawResponse: { action, payload } };
  }

  const callControlId = payload.callControlId || payload.telnyxCallId;
  if (!callControlId) {
    return { success: false, mock: false, rawResponse: { error: 'Missing call control identifier' } };
  }

  const response = await fetch(`${actionBaseUrl}/${callControlId}/actions/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthorizationHeaders(),
    },
    body: JSON.stringify(
      action === 'speak'
        ? { payload: payload.text }
        : action === 'gather'
          ? { digits: payload.digits ?? 1, timeout_secs: payload.timeout ?? 10 }
          : {},
    ),
  });

  const json = await response.json().catch(() => null);
  return {
    success: response.ok,
    mock: false,
    rawResponse: json,
  };
};

export const buildAvailabilityPrompt = (input: { serviceType?: string; serviceLocation?: string }) => {
  const serviceType = input.serviceType?.trim() || 'the requested service';
  const serviceLocation = input.serviceLocation?.trim() || 'the service location';
  return `Hello, this is Ustaad. We have a service request for ${serviceType} at ${serviceLocation}. What time can you provide the service?`;
};

export const placeCall = async (input: {
  callId: string;
  to: string;
  from?: string;
  serviceType?: string;
  serviceLocation?: string;
  serviceRequestId?: string;
}) : Promise<TelnyxCallCreationResult> => {
  const { apiKey, connectionId, fromNumber, webhookUrl, allowMock } = getConfig();
  const prompt = buildAvailabilityPrompt({ serviceType: input.serviceType, serviceLocation: input.serviceLocation });

  if (!apiKey || !connectionId || !fromNumber || allowMock) {
    console.log('[TELNYX MOCK] placing call', { ...input, prompt });
    return {
      callId: input.callId,
      telnyxCallId: `mock-telnyx-${input.callId}`,
      callControlId: `mock-control-${input.callId}`,
      mock: true,
      rawResponse: { prompt },
    };
  }

  const response = await fetch(`${TELNYX_API_BASE_URL}/calls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthorizationHeaders(),
    },
    body: JSON.stringify({
      connection_id: connectionId,
      to: input.to,
      from: input.from || fromNumber,
      webhook_url: webhookUrl,
      client_state: Buffer.from(JSON.stringify({ callId: input.callId, serviceRequestId: input.serviceRequestId || null })).toString('base64'),
    }),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMessage = isPlainObject(json) && typeof json.error === 'string'
      ? json.error
      : `Telnyx call creation failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = isPlainObject(json) && isPlainObject(json.data) ? json.data : {};
  return {
    callId: input.callId,
    telnyxCallId: typeof data.id === 'string' ? data.id : undefined,
    callControlId: typeof data.call_control_id === 'string' ? data.call_control_id : undefined,
    mock: false,
    rawResponse: json,
  };
};

export const playTts = async (input: CallActionPayload & { text: string }) => {
  return recordCallAction('speak', input);
};

export const gatherDTMF = async (input: CallActionPayload & { digits?: number; timeout?: number }) => {
  return recordCallAction('gather', input);
};

export const hangupCall = async (input: CallActionPayload) => {
  return recordCallAction('hangup', input);
};

const decodeWebhookSecret = (secret: string) => {
  if (secret.includes('BEGIN PUBLIC KEY')) {
    return crypto.createPublicKey(secret);
  }

  try {
    return crypto.createPublicKey({
      key: Buffer.from(secret, 'base64'),
      format: 'der',
      type: 'spki',
    });
  } catch {
    return crypto.createPublicKey({
      key: Buffer.from(secret, 'utf8'),
      format: 'pem',
      type: 'spki',
    });
  }
};

export const verifyWebhookSignature = (rawBody: string, headers: Record<string, string | undefined>) => {
  const { webhookSecret } = getConfig();
  if (!webhookSecret) {
    return { verified: true, reason: 'webhook secret not configured; skipping signature verification' };
  }

  const signature = headers['x-telnyx-signature-ed25519'];
  const timestamp = headers['x-telnyx-timestamp'];

  if (!signature || !timestamp) {
    return { verified: false, reason: 'missing signature headers' };
  }

  const message = `${timestamp}.${rawBody}`;
  const candidates = [
    () => crypto.verify(null, Buffer.from(message), decodeWebhookSecret(webhookSecret), Buffer.from(signature, 'base64')),
    () => crypto.verify(null, Buffer.from(message), decodeWebhookSecret(webhookSecret), Buffer.from(signature, 'hex')),
  ];

  for (const candidate of candidates) {
    try {
      if (candidate()) {
        return { verified: true, reason: 'signature verified' };
      }
    } catch {
      // try next decoding strategy
    }
  }

  return { verified: false, reason: 'signature verification failed' };
};

export const resolveTelnyxEventIdentifiers = (payload: unknown) => {
  if (!isPlainObject(payload)) {
    return { event: 'unknown', telnyxCallId: undefined, callControlId: undefined, rawPayload: {} };
  }

  const data = isPlainObject(payload.data) ? payload.data : payload;
  const event = typeof payload.event === 'string'
    ? payload.event
    : typeof data.event === 'string'
      ? data.event
      : 'unknown';
  const telnyxCallId = [data.id, data.call_session_id, data.call_leg_id, data.call_control_id, payload.id, payload.call_control_id]
    .find((value) => typeof value === 'string');
  const callControlId = [data.call_control_id, payload.call_control_id, data.call_session_id]
    .find((value) => typeof value === 'string');

  return {
    event,
    telnyxCallId: telnyxCallId as string | undefined,
    callControlId: callControlId as string | undefined,
    rawPayload: payload as Record<string, unknown>,
  };
};

export const telnyxService = {
  placeCall,
  playTts,
  gatherDTMF,
  hangupCall,
  verifyWebhookSignature,
  buildAvailabilityPrompt,
  resolveTelnyxEventIdentifiers,
};

export default telnyxService;