# Phase 3: Mobile App UI & State - Design Plan

This document outlines the detailed UI/UX strategy for the **Ustaad** mobile application. It covers color psychology, structural wireframes, and the step-by-step plan for implementing the React Native frontend.

## 1. Color Psychology & The 60-30-10 Rule

For an informal economy service app, the primary emotions we need to evoke are **Trust**, **Reliability**, and **Speed/Action**.

We will strictly follow the **60-30-10** design rule:

- **60% Dominant (Background & Canvas): Clean & Modern**
  - **Color**: **Off-White / Ghost White (`#F8FAFC`)**
  - **Reason**: Provides a clean, breathable canvas that doesn't overwhelm the user. It makes the app feel modern, premium, and easy to read.

- **30% Secondary (Structure & Typography): Trust & Stability**
  - **Color**: **Deep Slate Navy (`#0F172A` & `#1E293B`)**
  - **Reason**: Used for text, cards, bottom tabs, and headers. Deep navy blue subconsciously communicates security, professionalism, and reliability (crucial when inviting strangers to your home).

- **10% Accent (CTAs & Highlights): Energy & Action**
  - **Color**: **Vibrant Amber/Electric Orange (`#F59E0B`)**
  - **Reason**: Orange/Amber is the universal color for construction, fixing, and urgency. It draws the eye instantly. We will use this *only* for the primary call-to-action buttons (like "Book Now", the floating Microphone button, and the Agent's magic glow).

## 2. Screen Wireframes & Flows

### Screen 1: The Splash Screen (Animated)
- **Concept**: A minimalist screen with a deep slate background (`#0F172A`). 
- **Animation**: A sleek wrench or tool icon that smoothly transforms into a glowing AI spark/star, symbolizing "Traditional fixing meets AI". We will build this using `react-native-reanimated`.
- **Transition**: Fades seamlessly into the Auth/Home screen.

### Screen 2: Authentication (Phone OTP)
- **Header**: "Welcome to Ustaad"
- **Body**: 
  - Clean, borderless input field for Phone Number (`+92`).
  - Next step: 6-digit OTP input with auto-focus.
- **Accent**: The "Verify" button pulses in the 10% Accent Amber color when 6 digits are entered.

### Screen 3: Home / AI Intent Screen
- **Hero Section**: A large, inviting, and dynamic area. 
  - Text: "What do you need fixed today?"
  - Input: A modern text input bar that expands.
  - Floating Action Button (FAB): A prominent glowing Amber microphone button for voice-to-text.
- **Bottom Section**: "Recent Activity" or "Suggested Services" cards in subtle 30% Slate styling.

### Screen 4: Agent Matching (The Magic Radar)
- **Visuals**: When a request is submitted, the screen dims. A radar animation begins.
- **Agent Trace Terminal**: A sleek, bottom-sheet terminal that types out the AI's thoughts in real-time:
  - *"Observing request: 'AC is leaking in G-13'..."*
  - *"Extracting intent: AC Repair, High Urgency..."*
  - *"Scanning Google Maps within 5km..."*
  - *"Negotiating estimated price..."*
- **Purpose**: Show the user the AI's reasoning, building immense trust.

### Screen 5: Provider Quote & Confirmation
- **Card UI**: Displays the matched provider.
  - Provider Name & Verified Badge.
  - Distance (e.g., "3.2 km away").
  - **Price Breakdown**: Base fee + Distance fee + Urgency adjustment.
- **CTAs**: Large Amber "Confirm Booking" vs. Subtle "Find Someone Else".

### Screen 6: Live Tracking & Active Booking
- **Map View**: `react-native-maps` showing the provider's location and route.
- **Status Bar**: A dynamic pill showing the state (e.g., "Provider En-Route").
- **Actions**: WhatsApp / Call buttons in the 30% Secondary color.

---

## 3. Implementation Strategy

### Step 1: Foundation Setup
- Configure `react-navigation` (Native Stack) for smooth screen transitions.
- Set up **Zustand** stores (`useAuthStore`, `useBookingStore`, `useAgentStore`).
- Create a global `theme.ts` file holding our 60-30-10 color hex codes and typography rules.

### Step 2: Reusable Components
Using strictly internal `StyleSheet`, we will build:
- `Typography` (Headers, Body)
- `Button` (Primary Accent, Secondary)
- `Card` (Soft shadows, rounded corners)
- `AgentTerminal` (For displaying AI traces)

### Step 3: Screen Assembly
Build the screens in order of the user journey (Splash -> Auth -> Home -> Match -> Track).

---

## User Review Required

1. **Color Palette Approval**: Do you approve of the **Off-White (60%)**, **Deep Slate Navy (30%)**, and **Vibrant Amber (10%)** palette?
2. **Animation Tools**: I plan to use `react-native-reanimated` for the splash screen to give it that "wow" modern factor. Does that sound good?

If you approve of this design blueprint, I will begin writing the React Native code for Phase 3!
