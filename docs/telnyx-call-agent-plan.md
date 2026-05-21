# Telnyx Call Agent — Implementation Plan

Status: Draft

## Goal

Implement a Telnyx-based call agent in the backend that will place an outbound voice call to a provider chosen by the user from the recommendation results. The call agent will:

- Initiate an outbound call to the provider's verified phone number when the user taps `Schedule` on the Quote screen.
- Provide a configurable voice prompt that includes the service type, the needed location, and asks the provider what time they can provide the service.
- Optionally collect DTMF input after the provider states availability, for example to confirm acceptance or request a callback.
- Relay call status and events back to the mobile client (via webhook updates persisted to the DB and optionally pushed to the client via WebSocket / push notifications).
- Securely store and manage Telnyx credentials and provide retries and observability.

## High-Level Architecture

- Mobile client: user selects a provider from recommendations on the Quote screen and taps `Schedule`.
- Backend API: receives `POST /api/calls` with userId, providerId, serviceRequestId (optional), and `callOptions` that include the service location, service type, and schedule context.
- Call Orchestrator (new controller/service): validates provider phone, prepares call metadata, persists a `Call` record, and instructs Telnyx to place the call via its REST API.
- Telnyx: handles PSTN call, connects to provider phone, and optionally runs a webhook-specified call control (TwiML-like) or plays a TTS prompt.
- Webhooks: Telnyx posts events (call initiated, ringing, answered, completed, failed) to our configured webhook endpoint `/api/telnyx/webhook`.
- Backend: webhook handler verifies signature, updates call record, triggers follow-up actions (notify user, create booking request, record consent via DTMF), and logs trace.

## Components to Add / Modify

- Backend models
  - `Call` model (new) to store call lifecycle, telnyxCallId, userId, providerId, serviceRequestId, status, events, timestamps, recordingUrl (optional), dtmfInputs.

- Backend controllers/services
  - `callController.createCall` — API: create + initiate Telnyx outbound call.
  - `telnyxService` — encapsulates Telnyx REST calls (placeCall, hangupCall, getCall, fetchRecording) and signature verification.
  - `webhookController.telnyxWebhook` — accepts Telnyx webhooks, validates signature, updates `Call` model, and triggers notifications.

- Routes
  - `POST /api/calls` — requires auth; body: `{ providerId, serviceRequestId?, callOptions? }`.
  - `POST /api/telnyx/webhook` — public endpoint Telnyx will call (must verify signature).

- Config
  - Add `TELNYX_API_KEY` (secret) and `TELNYX_WEBHOOK_SECRET` to `.env` (or use secret manager).
  - Add `TELNYX_FROM_NUMBER` (the outbound number or Connection ID to use).

- Observability
  - Instrument telnyxService with logs/traces for API calls and webhook events.
  - Persist raw Telnyx events to `CallTrace` subdocument for debugging.

## Telnyx Setup Steps (Admin)

1. Create Telnyx account (if not already).
2. Provision an outbound capable phone number (or use a Connection / Messaging Profile as needed).
3. Obtain API key with appropriate scope and copy into server secrets as `TELNYX_API_KEY`.
4. Configure a webhook URL in the Telnyx console pointing to `https://<your-host>/api/telnyx/webhook` and copy the webhook secret to `TELNYX_WEBHOOK_SECRET` OR use Telnyx's signature verification headers.
5. Set the outbound number to the purchased number or set up the Call Control profile if using a SIP/connection.

## Data Model — Mongoose (example)

Call schema (new file `backend/src/models/Call.ts`):

```ts
import mongoose from 'mongoose';

const CallEventSchema = new mongoose.Schema({
  event: String,
  timestamp: { type: Date, default: Date.now },
  payload: mongoose.Schema.Types.Mixed,
});

const CallSchema = new mongoose.Schema({
  telnyxCallId: { type: String, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
  fromNumber: String,
  toNumber: String,
  status: { type: String, enum: ['requested','initiated','ringing','answered','completed','failed','cancelled'], default: 'requested' },
  dtmfInputs: [{ digit: String, timestamp: Date }],
  events: [CallEventSchema],
  recordingUrl: String,
}, { timestamps: true });

export default mongoose.model('Call', CallSchema);
```

## API: `POST /api/calls`

Request:

```json
{
  "providerId": "<provider id>",
  "serviceRequestId": "<optional>",
  "callOptions": {
    "userMessage": "Optional override message to play",
    "collectDTMF": true,
    "serviceLocation": "123 Main St",
    "serviceType": "Plumbing"
  }
}
```

Behavior:

1. Authenticate user (`requireAuth`).
2. Validate provider exists and `phoneNumber` is present and verified.
3. Create a `Call` record in DB with status `requested`.
4. Prepare call control payload (TTS content or Telnyx Call Control instructions). Include metadata: serviceRequestId, callId.
5. Call Telnyx REST API to place a call. Save returned `telnyxCallId` and update status to `initiated`.
6. When the provider answers, play a prompt like: "Hello, this is Ustaad. We have a service request for <service type> at <location>. What time can you provide the service?"
7. Return call record to client (id and status). Client displays call progress via polling or realtime updates.

Example call initiation (pseudo):

```ts
// telnyxService.placeCall
const resp = await fetch('https://api.telnyx.com/v2/calls', {
  method: 'POST',
  headers: { Authorization: `Bearer ${TELNYX_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    connection_id: TELNYX_CONNECTION_ID,
    to: providerPhone,
    from: TELNYX_FROM_NUMBER,
    // optionally supply call_control_id or call_control instructions
    // or set `webhook_event_url` if required
  })
});
```

Telnyx supports two patterns: basic outbound call creation and Call Control where you provide an NCCO-like script via webhook. For simplicity, start with basic outbound and instruct Telnyx to request our webhook for call control so we can play TTS.

## Webhook Handling

- Telnyx will POST call events to `/api/telnyx/webhook` (e.g., `call.initiated`, `call.ringing`, `call.answered`, `call.completed`, `call.dtmf.received`).
- Validate the request signature using `TELNYX_WEBHOOK_SECRET` (Telnyx signs payloads — verify per Telnyx docs).
- For each event:
  - Locate `Call` by `telnyxCallId` (or use mapping by our generated `callId` if included in the `call_control` webhook fields).
  - Append event to `call.events` and update `call.status` accordingly.
  - If `call.answered`, play a TTS prompt that explains the service request and asks what time the provider can arrive at the location.
  - If the provider responds with DTMF or speech input, store the availability response and mark the call ready for the next workflow step.
  - If `dtmf` received and `collectDTMF` enabled: store DTMF and consider that provider accepted/confirmed.
  - If `completed` with `recording_url` — persist recording URL for audit.

## Example Telnyx Call Control (play TTS + gather digits)

When the call is answered, instruct Telnyx to play TTS and optionally collect DTMF:

```json
{
  "instructions": [
    { "action": "play", "text": "Hello, this is Ustaad. We have a service request for plumbing at 123 Main St. What time can you provide the service?" },
    { "action": "gather", "num_digits": 1, "timeout": 10 }
  ]
}
```

Telnyx APIs and proxied call control payloads vary — consult Telnyx Call Control docs and adapt the JSON shape accordingly.

## Security

- Keep `TELNYX_API_KEY` and `TELNYX_WEBHOOK_SECRET` in environment variables or a secrets manager.
- Validate provider phone numbers to avoid toll fraud and ensure numbers are E.164 formatted.
- Rate-limit the `POST /api/calls` endpoint and require the user to have recently created the request (guard against mass-calling).

## Error Handling & Retries

- If Telnyx call creation fails, update `Call.status = 'failed'` and record error.
- Implement a retry policy for transient Telnyx errors (HTTP 429/5xx) with exponential backoff.
- When webhook deliverability fails (Telnyx can't reach our webhook), Telnyx typically retries — log these and provide monitoring.

## Notifications to Mobile Client

- Option A: Polling — client polls `GET /api/calls/:id` to get the latest status and events.
- Option B: Real-time — implement a simple WebSocket / Socket.io channel to push status updates when webhooks arrive.
- Option C: Push notifications for critical events (call answered/failed) using existing push infra.

## Audit and Recording

- Optionally enable call recording in Telnyx and persist `recordingUrl` in the Call document when available.
- Consider retention policy (e.g., 30 days) for recordings and store references only (not the blobs) unless compliance requires.

## Logging & Monitoring

- Log all Telnyx API requests/responses (obfuscate secrets).
- Export metrics: calls placed, answered ratio, avg duration, errors, webhook latencies.

## Tests

- Unit tests for `telnyxService` using mocked fetch client.
- Integration tests that stub Telnyx REST and simulate webhooks to validate call lifecycle transitions.

## Migration / Rollout Plan

1. Add Call model + migration script (if needed) to create indexes.
2. Implement `telnyxService` and local mock provider for dev.
3. Add `POST /api/calls` controller + route and run internal tests.
4. Implement webhook handler, wire Telnyx console to dev or staging webhook endpoint.
5. End-to-end tests with test Telnyx number.
6. Rollout to production: add secrets, monitor, and enable retries.

## Implementation Checklist (detailed tasks)

1. Add `backend/src/models/Call.ts` (schema + indexes).
2. Add `backend/src/services/telnyxService.ts`:
   - `placeCall(callId, from, to, metadata)`
   - `playTts(callId, text)`
   - `gatherDTMF(callId, options)`
   - `hangupCall(callId)`
   - `verifyWebhookSignature(req)`
3. Add `backend/src/controllers/callController.ts` with `createCall`, `getCall`, `hangupCall` endpoints.
4. Add `backend/src/routes/callRoutes.ts` and mount at `/api/calls`.
5. Add webhook route `backend/src/routes/transcribeRoutes.ts` already exists — add new `telnyxRoutes.ts` with webhook handler and mount.
6. Add environment variables and docs for Telnyx configuration.
7. Add tests and CI steps.
8. Instrument logging and optional WebSocket push to clients.

## Example code snippets

1) Place call (simplified):

```ts
// callController.createCall
const call = new Call({ userId, providerId, serviceRequestId, toNumber: provider.phoneNumber, fromNumber: TELNYX_FROM_NUMBER });
await call.save();

const telnyxResp = await telnyxService.placeCall(call._id.toString(), TELNYX_FROM_NUMBER, provider.phoneNumber, { serviceRequestId: call.serviceRequestId });
call.telnyxCallId = telnyxResp.data.id;
call.status = 'initiated';
await call.save();

res.json(call);
```

2) Webhook verification (simplified):

```ts
// telnyxService.verifyWebhookSignature
// Telnyx docs: use X-Telnyx-Signature-Ed25519 and X-Telnyx-Timestamp headers
// perform ed25519 verify with TELNYX_WEBHOOK_SECRET public key or provided method
```

## Notes and Considerations

- Telnyx's exact API shapes and webhook signatures change; please consult Telnyx docs for the account region.
- For initial MVP, implement a simple TTS prompt on answer and collect a single DTMF digit for accept/decline. Expand later with multi-step voice menus.
- Ensure legal/consent requirements for call recording and notifications.

---

If you want, I can now:

- Generate the `Call` model and `telnyxService` scaffolding code.
- Implement `POST /api/calls` controller and Telnyx webhook handler.
- Add unit tests and local mock of Telnyx for development.

Tell me which step to start with and whether you have a Telnyx account/credentials available to add to the environment.
