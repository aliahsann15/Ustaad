# ustaad — Detailed Design & Implementation Guide

This document provides an in-depth overview of the ustaad project: architecture, data models, API specification, agent behavior, Telnyx call flow, local development, build instructions, and troubleshooting notes.

1. Purpose
--
ustaad is a mobile-first marketplace that connects users with nearby service providers (plumbers, electricians, cleaners, etc.). The system emphasizes discovery, quick scheduling, and an AI-assisted recommendation flow. It supports voice input, transcription, and an automated call agent (Telnyx) for phone-based scheduling.

2. High-level Architecture
--
- Mobile Client (Expo/React Native)
  - Screens: Quote, Matching, Tracking, Auth, Profile
  - Audio capture: `expo-audio` (record/upload)
  - Networking: fetch + mobile/lib/api.ts wrappers
  - Stores: Zustand for auth, booking, active call state

- Backend API (Node.js + Express + TypeScript)
  - REST endpoints for users, providers, bookings, service-requests, calls, and transcription
  - Agent orchestrator uses Google GenAI (Gemini) to extract intent and run provider search tools
  - Telnyx service integrates with the Telnyx Call Control API and webhooks
  - Data storage: MongoDB via Mongoose

3. Core Flows (sequence summaries)
--
3.1 Service Request + Agent Recommendation
- Client POST `/api/service-requests` with user request (text, location, optional media).
- Backend creates a `ServiceRequest` and calls `runAgenticWorkflow()`.
- `runAgenticWorkflow()` uses Gemini to extract intent and calls `searchProvidersTool()` with structured parameters.
- It returns `{ intent, recommendedProvider, otherProviders, matchedProviders }`.
- Backend returns the `serviceRequest` and `agentResult` to client for UI rendering.

3.2 Schedule via Phone (Telnyx Call Agent)
- User taps Schedule on mobile → client calls `POST /api/calls` with `providerId` and `serviceRequestId`.
- Backend creates a `Call` document and invokes `telnyxService.placeCall()`.
- Telnyx places outbound call to provider; when call state changes Telnyx posts to `/api/telnyx/webhook`.
- Webhook handler verifies signature and appends events into the `Call.events` array. On `answered`, backend issues Telnyx `speak` + `gather` to query availability and collect DTMF.
- Client polls `GET /api/calls/:id` to update UI (tracking). Optionally, push/WS can replace polling.

3.3 Voice -> Transcription
- Mobile records audio, uploads it as multipart to `POST /api/transcribe`.
- Backend saves temp file and forwards it to configured STT provider (Google Speech-to-Text when `GOOGLE_SPEECH_TO_TEXT_API_KEY` is present), else returns a mock transcription.

4. API Reference (concise)
--
- POST /api/service-requests
  - Body: { userId, description, latitude, longitude, serviceType }
  - Response: { serviceRequest, agentResult }

- POST /api/calls
  - Auth required (Bearer token)
  - Body: { providerId, serviceRequestId, fromNumber? }
  - Response: { call: CallDocument, promptText }

- GET /api/calls/:id
  - Response: { call: CallDocument }

- POST /api/telnyx/webhook
  - Telnyx posts events; backend verifies signature and updates `Call` events

- POST /api/transcribe
  - Multipart form upload: `file` field containing audio
  - Response: { transcription: string }

5. Data Models (selected fields)
--
- ServiceRequest (Mongoose)
  - user: ObjectId
  - description: string
  - location: { type: 'Point', coordinates: [lng, lat] }
  - matchedProviders: ObjectId[]

- Provider
  - name, phoneNumber (E.164), location, tags, rating

- Call
  - telnyxCallId: string
  - userId: ObjectId
  - providerId: ObjectId
  - serviceRequestId: ObjectId
  - fromNumber: string
  - toNumber: string
  - status: enum ['created','queued','ringing','answered','completed','failed']
  - events: [{ timestamp, eventType, payload }]
  - recordingUrl?: string

6. Telnyx Service Implementation Notes
--
- `telnyxService` responsibilities:
  - Build Telnyx API requests with correct authorization headers (Bearer token)
  - Place outbound calls with `callControl` actions
  - Make `speak` and `gather` actions to implement IVR prompts and DTMF collection
  - Verify webhook payloads using `TELNYX_WEBHOOK_SECRET`
  - Provide mock responses when `TELNYX_API_KEY` is absent for local dev

7. Environment Variables
--
- MONGO_URI
- PORT (default 5000)
- JWT_SECRET
- GEMINI_API_KEY (optional)
- GOOGLE_MAPS_API_KEY (optional)
- GOOGLE_SPEECH_TO_TEXT_API_KEY (optional)
- TELNYX_API_KEY (optional)
- TELNYX_WEBHOOK_SECRET (required for verifying webhooks if using Telnyx)
- TELNYX_FROM_NUMBER (caller id for outbound calls)

8. Local Development & Build
--
8.1 Backend
```bash
cd backend
npm install
npm run dev       # dev w/ nodemon & ts-node
npm run build     # compile to dist/
node dist/index.js
```

8.2 Mobile (Expo)
```bash
cd mobile
npm install
npx expo start
```

8.3 Native prebuild + local APK (Android)
```bash
cd mobile
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

8.4 Recommended: Use EAS for production builds
```bash
npx eas build -p android --profile production
```

9. Testing & Debugging
--
- Run `npx tsc -p tsconfig.json --noEmit` in both `backend` and `mobile` to catch TypeScript issues.
- Use `ngrok` to expose local backend for Telnyx webhook during testing: `ngrok http 5000` and set `TELNYX_WEBHOOK_URL` accordingly.
- If Telnyx webhooks are failing, check request signature verification logs and timestamp skew.
- For audio issues: ensure `expo-audio` is installed and native prebuild/reinstall done when testing on device.

10. Security & Operational Notes
--
- Keep `TELNYX_API_KEY` and `TELNYX_WEBHOOK_SECRET` secret; do not commit `.env`.
- Webhook verification prevents replay/fraud; validate both signature and event timestamp.
- For production, prefer `AAB` or `EAS` builds and proper key signing.

11. Next Improvements
--
- Add push notification or WebSocket support for real-time call status updates.
- Implement provider-side UI to accept/reject automated scheduling requests.
- Extend agent orchestration to collect availability windows and automatically propose booking times.

12. Contact and References
--
- See `backend/` and `mobile/` directories for implementation. Detailed agent prompts and prior transcripts are stored under the workspace transcripts.

---
Generated: May 21, 2026
