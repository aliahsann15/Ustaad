# Fixit Backend - AI Service Orchestrator

This is the backend for the **Fixit** platform, an AI-powered service orchestration system designed to automate the end-to-end service lifecycle for the informal economy (plumbers, electricians, tutors, etc.).

## 🚀 Features

- **Agentic Workflow**: Powered by the **Google Gemini API** (`@google/genai`), the system autonomously handles natural language requests (in English, Urdu, or Roman Urdu).
- **Dynamic Intent Extraction**: The AI dynamically parses unstructured user requests to extract required service types, urgency, budget, and location.
- **Smart Provider Matching**:
  - Integrates with the **Google Maps Places API** to find real-time professionals within an expanding radius (from 5km up to 30km).
  - Falls back to a geospatial `$near` query in the local database if no matches are found on Maps.
- **Agent Reasoning Traces**: Every step of the agent's thought process (OBSERVE, REASON, TOOL_CALL, ACT) is logged into the `AgentTrace` collection for complete transparency.
- **Security**: Secured with Firebase Authentication (JWT verification), Helmet for HTTP headers, and Express Rate Limiter.
- **Robust Data Modeling**: MongoDB schemas for Users, Providers, ServiceRequests, Bookings, and Traces.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **AI Integration**: Google Gemini (`@google/genai`)
- **External APIs**: Google Maps Platform

## 📦 Project Structure

```text
src/
├── agent/                # Core AI orchestration logic
│   ├── orchestrator.ts   # The main Antigravity Agent loop
│   └── tools.ts          # Deterministic tools (e.g., Maps search) called by the Agent
├── controllers/          # Express route controllers
├── middleware/           # Security middlewares (Auth, Rate Limiter)
├── models/               # Mongoose schemas (User, Provider, Booking, etc.)
├── routes/               # API route definitions
├── scripts/              # Helper scripts (e.g., seeding mock data)
├── app.ts                # Express application setup
└── index.ts              # Server entry point
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas)
- Firebase Admin SDK setup (for auth)

### 2. Installation

Navigate to the `backend` directory and install the dependencies:
```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the `backend` root (you can copy from `.env.example`) and fill in the required keys:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fixit

# AI Orchestrator
GEMINI_API_KEY=your_gemini_api_key_here

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

### 4. Running the Server

**Development Mode** (auto-reloads on changes):
```bash
npm run dev
```

**Production Build**:
```bash
# Compile TypeScript to JavaScript in the /dist folder
npm run build

# Run the compiled code
npm run start
```

### 5. Seeding Mock Data
To test the matching algorithm locally, you can populate your database with mock service providers:
```bash
npm run seed
```

## 🔒 Security
- **Firebase Auth**: Protected routes require a valid `Bearer <Token>` in the `Authorization` header.
- **Rate Limiting**: Limits endpoints to prevent brute-force attacks.
- **Helmet**: Secures Express apps by setting various HTTP headers.
