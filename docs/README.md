# ustaad — Project Documentation

## Overview

ustaad is a mobile-first marketplace connecting users who need home services with nearby providers. The system combines a TypeScript/Node backend, an Expo React Native mobile app, and an AI orchestration layer that recommends providers. A Telnyx-powered call agent enables phone-based scheduling; voice recording and transcription enable voice-based input flows.

## High-level Architecture

- Backend: Node.js + Express + TypeScript + MongoDB (Mongoose). Hosts REST APIs, agent orchestration, Telnyx integration, and transcription endpoints.
- Mobile: Expo-managed React Native app (TypeScript). UI screens, audio capture, and calls-to-backend for scheduling and tracking.
- Agents: An AI orchestrator (Gemini / @google/genai) extracts intent and selects providers (top 4 + recommended). Pricing is intentionally removed from the agent output.
- Telephony: Telnyx used to place calls, run IVR (speak/gather), and receive webhook events which are persisted to the `Call` model.

## Backend: Key Components

- `src/app.ts` — Express app, middleware, route mounting.
- `src/index.ts` — Server bootstrap.
- `src/agent/` — `orchestrator.ts` (runAgenticWorkflow), `tools.ts` (provider search helper).
- `src/controllers/` — controllers for auth, user, provider, booking, serviceRequest, call, telnyx webhook, and transcription.
- `src/services/telnyxService.ts` — Telnyx wrapper (place call, speak/gather/hangup, signature verification), with a mock fallback when no API key is configured.
- `src/models/` — Mongoose models including `User`, `Provider`, `ServiceRequest`, `Booking`, and `Call` (persist call lifecycle and events).

## Mobile: Key Components

- `mobile/app/` — Screens including `quote.tsx`, `matching.tsx`, `tracking.tsx`, and auth screens.
- `mobile/components/` — Reusable UI components (Button, Card, Header, etc.).
- `mobile/hooks/useVoice.ts` — Audio recording using `expo-audio` and upload to `/api/transcribe`.
- `mobile/store/` — Zustand stores for auth, booking, provider lists, and active call state.
- `mobile/lib/api.ts` — Lightweight API helpers: `createProviderCall()`, `getCall()`, `transcribe()` wrappers.

## Agents and AI

- The orchestrator uses Google GenAI (Gemini) to parse user freeform text (e.g., problem description), extract structured intent, and call a provider search tool.
- The orchestrator returns: `intent`, `recommendedProvider`, `otherProviders` (top-4), and `matchedProviders` (IDs). No pricing data is returned.
- Agent traces are persisted for auditing (`AgentTrace` model).

## Telephony (Telnyx) Integration

- Flow: Mobile Schedule action → POST `/api/calls` → backend creates `Call` record and asks Telnyx to place a call → Telnyx posts events to `/api/telnyx/webhook` → backend verifies signature and appends call events to the `Call` document.
- On answer, webhook handler triggers Telnyx `speak` + `gather` actions to ask provider availability and collect DTMF inputs.
- Environment variables control Telnyx usage; when missing, the service falls back to mock behavior for local testing.

## Voice Transcription

- Mobile records audio and uploads multipart/form-data to `/api/transcribe`.
- Backend forwards audio to a configured speech-to-text provider (Google STT when keys are present) or returns a mock transcription for local testing.

## Important API Endpoints (representative)

- POST `/api/service-requests` — create a service request and run the agent orchestrator.
- POST `/api/calls` — create and place a Telnyx call (requires auth).
- GET `/api/calls/:id` — fetch call status and events.
- POST `/api/telnyx/webhook` — Telnyx webhook receiver (signature verification).
- POST `/api/transcribe` — upload audio for transcription.

## Data Models (not exhaustive)

- `User` — auth, profile, phone (E.164 normalization applied), avatar.
- `Provider` — profile, phoneNumber, location, tags, ratings.
- `ServiceRequest` — user, location, requested service, matchedProviders.
- `Booking` — scheduled service with provider (optional).
- `Call` — telnyxCallId, userId, providerId, serviceRequestId, status, events[], recordingUrl.

## Environment Variables

- `MONGO_URI` — MongoDB connection string.
- `PORT` — backend port (default 5000).
- `GEMINI_API_KEY` — optional for AI orchestration (Gemini).
- `GOOGLE_MAPS_API_KEY` — optional for provider search / geolocation.
- `GOOGLE_SPEECH_TO_TEXT_API_KEY` — optional for transcription.
- `TELNYX_API_KEY` — optional for real Telnyx calls.
- `TELNYX_WEBHOOK_SECRET` — verify Telnyx webhook signatures.
- `TELNYX_FROM_NUMBER` — caller number used when placing calls.

## Local Development & Build Notes

- Backend: `cd backend && npm install && npm run dev` (nodemon/ts-node) or `npm run build` then `node dist/index.js` for production.
- Mobile (Expo dev): `cd mobile && npm install && npx expo start`.
- Prebuild native Android (when native packages/plugins are used):

```bash
cd mobile
npx expo prebuild --platform android
```

- Build release APK (after prebuild / for local Gradle build):

```bash
cd mobile/android
./gradlew assembleRelease
```

- Recommended alternative for production mobile builds: `npx eas build -p android` (handles credentials and signing).

## Testing & Validation

- TypeScript checks: `npx tsc -p tsconfig.json --noEmit` in both `backend` and `mobile` directories.
- Backend lint/build: `cd backend && npm run build`.
- For Telnyx E2E tests, set Telnyx env vars and use a public webhook (ngrok/EAS) for webhook delivery during testing.

## Known Limitations & Next Steps

- Native modules (image-picker, audio) require a prebuild/native rebuild and app reinstall for production behavior.
- Real Telnyx calls require production secrets; currently a mock fallback exists for local dev.
- Consider adding WebSocket or push notifications for realtime call updates instead of client polling.

## Contact / Sources

Refer to the codebase under the `backend/` and `mobile/` folders for detailed implementation. For generated agent prompts and conversation transcripts, see the workspace transcripts and docs.

---
Generated: May 21, 2026
