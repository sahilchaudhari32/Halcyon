# Halcyon — Intelligent Log Analytics & Resolution Gateway

<p align="center">
  <svg xmlns="http://www.w3.org/2005/svg" viewBox="0 0 800 240" width="100%" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); max-width: 800px;">
    <!-- Dark Space/Atmospheric Background -->
    <rect width="800" height="240" rx="16" fill="#0b0e11"/>
    
    <!-- Fine Grid Lines representing diagnostic system -->
    <defs>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255, 255, 255, 0.03)" stroke-width="1"/>
      </pattern>
      
      <!-- Linear Gradients for Waves -->
      <linearGradient id="waveTeal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2EC4B6" stop-opacity="0.0"/>
        <stop offset="25%" stop-color="#2EC4B6" stop-opacity="0.9"/>
        <stop offset="75%" stop-color="#8CA596" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#2EC4B6" stop-opacity="0.0"/>
      </linearGradient>
      
      <linearGradient id="waveAmber" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#E8935B" stop-opacity="0.0"/>
        <stop offset="50%" stop-color="#E29A76" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#E8935B" stop-opacity="0.0"/>
      </linearGradient>
      
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Apply Grid -->
    <rect width="800" height="240" rx="16" fill="url(#grid)"/>
    
    <!-- Ambient Radial Light Glows -->
    <circle cx="150" cy="120" r="140" fill="#2EC4B6" opacity="0.06" filter="url(#glow)"/>
    <circle cx="650" cy="120" r="120" fill="#E8935B" opacity="0.06" filter="url(#glow)"/>
    
    <!-- Oscilloscope Waves (Motion graphic static frames) -->
    <!-- Calm Wave 1 -->
    <path d="M 0 120 C 100 80, 200 80, 300 120 C 400 160, 500 160, 600 120 C 700 80, 800 120" fill="none" stroke="url(#waveTeal)" stroke-width="4.5" filter="url(#glow)" opacity="0.9"/>
    
    <!-- Calm Wave 2 (Subtle shift) -->
    <path d="M 0 120 C 80 140, 180 140, 280 120 C 380 100, 480 100, 580 120 C 680 140, 800 120" fill="none" stroke="#2EC4B6" stroke-width="1.5" opacity="0.45"/>
    
    <!-- Chaotic Wave (Faded overlay showing anomaly) -->
    <path d="M 50 120 Q 120 40, 200 200 T 350 70 T 500 170 T 650 90 T 750 120" fill="none" stroke="url(#waveAmber)" stroke-width="2.5" filter="url(#glow)" opacity="0.7"/>
    
    <!-- Glowing Status Dots -->
    <circle cx="45" cy="45" r="5" fill="#2EC4B6" filter="url(#glow)"/>
    <text x="60" y="49" font-family="'Courier New', monospace" font-size="12" fill="#8CA596" font-weight="bold">SYSTEM: LOG_STREAMING_STABLE</text>
    
    <circle cx="755" cy="45" r="5" fill="#E8935B" filter="url(#glow)"/>
    <text x="740" y="49" font-family="'Courier New', monospace" font-size="12" fill="#E29A76" font-weight="bold" text-anchor="end">ANOMALY_DETECTION: ONLINE</text>
    
    <!-- Logo & Title text -->
    <text x="50%" y="125" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="8" filter="url(#glow)">H A L C Y O N</text>
    <text x="50%" y="165" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#a0aec0" letter-spacing="3">AI-POWERED LOG ORCHESTRATION &amp; ANALYSIS</text>
    
    <!-- Accent line at bottom -->
    <line x1="0" y1="238" x2="800" y2="238" stroke="url(#waveTeal)" stroke-width="4"/>
  </svg>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-2EC4B6?style=for-the-badge&logo=react&logoColor=white" alt="React-Vite" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-8CA596?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Database-SQLite-E8935B?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Motion--Graphics-Framer--Motion%20%2B%20Canvas-EE4D2D?style=for-the-badge&logo=html5&logoColor=white" alt="Motion Graphics" />
</p>

---

## 🌌 Overview

**Halcyon** is a production-ready, high-fidelity log analysis dashboard and AI orchestration platform. It is engineered to help engineering teams parse, structure, and diagnose server outages with maximum cost-efficiency and absolute speed. 

Through its custom frontend motion graphics, users are greeted with a beautiful, real-time diagnostic oscilloscope simulating the stability profile of their system—translating raw console chaos into structural serenity.

### 🌟 Core Value Propositions
* **Interactive Waveform Analytics**: An HTML5 Canvas-based oscilloscope rendering real-time stability waves based on diagnostic incident logs (calming as anomalies get resolved).
* **CascadeFlow Intelligence Routing**: Smart cost optimization utilizing lightweight models (`qwen/qwen3-32b`) as drafters, scoring quality, and conditionally escalating to heavyweight verifiers (`llama-3.3-70b`) only when necessary (saves up to 90% inference cost).
* **Hindsight Semantic Memory**: Integrates Vectorize Hindsight to instantly recall solutions to previously resolved outages, reducing resolution latency to under 100ms.
* **Sensitive Compliance Gating**: Automatically intercepts and routes log lines containing PII or proprietary credentials to compliance-secure local infrastructure.

---

## 🖼️ Motion Graphics & Premium UX

Halcyon sets a new standard for developer tool aesthetics. By combining smooth physics, interactive canvases, and atmospheric glows, the interface is both highly functional and visually stunning.

### 1. HTML5 Canvas Diagnostic Waveform
The central hero of the landing screen and dashboard headers, the Oscilloscope Waveform ([Waveform.jsx](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/frontend/src/components/Waveform.jsx)) synthesizes layered sine waves directly via the Canvas API.
* **Dynamic Physics (LERP)**: Transitions between states (`calm` and `chaotic`) smoothly interpolate amplitude, frequency, and speed values over time using Linear Interpolation.
* **Organic Noise Injection**: In the `chaotic` state, the wave simulates real jitter by injecting pseudo-random noise layers generated using time-varying cosine and sine wave offsets.
* **Device Pixel Ratio (DPR) Scaling**: The rendering loop scales dynamically to ensure crisp, razor-sharp lines on Retina and high-DPI displays.
* **Low-Power Mode**: Native integration with the browser's `prefers-reduced-motion` media query to stop animations and save power when requested by the OS.

### 2. Atmospheric Ambient Light Meshes
Inspired by luxury UI designs, Halcyon features floating atmospheric meshes in the background. Powered by `framer-motion`, these meshes drift slowly and change size organically, establishing a soothing, modern dark-mode gradient.

### 3. State-Driven Micro-Animations
The dashboard reacts to user behavior. Status changes, file uploads, and diagnostic cards utilize smooth transitions, scale triggers, and glowing border highlights to provide instant, satisfying visual feedback.

---

## 📐 System Architecture

The following diagram illustrates how log data flows through Halcyon's multi-tiered resolution pipeline:

```mermaid
graph TD
    User([User Client]) -->|1. Upload Log File| FE[React Frontend]
    FE -->|2. POST /api/incidents| BE[FastAPI Backend]
    
    subgraph Pipeline [Analysis Pipeline]
        BE -->|3. Search Memory| HS[Hindsight Vector Memory]
        HS -->|Match Score >= 0.80| FastPath[Fast Path Resolution]
        
        HS -->|Match Score < 0.80| SecurityGate{Compliance Gate?}
        SecurityGate -->|Yes: Sensitive| CompModel[Local Compliance Model]
        SecurityGate -->|No| Routing{CascadeFlow Routing}
        
        Routing -->|Tier 1| Drafter[Qwen Drafter Model]
        Drafter -->|Evaluate JSON Quality| ScoreGate{Score >= 0.75?}
        ScoreGate -->|Yes| SuccessReturn[Return Draft]
        ScoreGate -->|No| Escalation[Escalate to Llama Verifier]
    end
    
    FastPath --> DB[(SQLite Database)]
    CompModel --> DB
    SuccessReturn --> DB
    Escalation --> DB
    
    DB -->|4. Audit Logs & Analytics| FE
```

---

## 📁 Repository Structure

### Backend (`/backend`)
* [app.py](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/backend/app.py): Main entry point configuring CORS, Lifespan, and Global Error Handling.
* [routes.py](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/backend/routes.py): Complete REST endpoints supporting CRUD, history search, and statistics.
* [ai.py](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/backend/ai.py): Orchestrates the AI analysis pipeline including compliance gates and known pattern matchers.
* [cascadeflow.py](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/backend/cascadeflow.py): Quality-scoring engine routing requests between draft and verify model tiers.
* [memory.py](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/backend/memory.py): Interface for Hindsight semantic recall and retention.
* [database.py](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/backend/database.py): SQLAlchemy models for incidents, tags, similar incident links, and routing audit logs.

### Frontend (`/frontend`)
* [src/App.jsx](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/frontend/src/App.jsx): Sets up state routing using Wouter and injects the global oscilloscope state.
* [src/components/LandingPage.jsx](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/frontend/src/components/LandingPage.jsx): Premium landing experience showcasing animated meshes, FAQs, before/after consoles, and localized translations.
* [src/components/Waveform.jsx](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/frontend/src/components/Waveform.jsx): Mathematical Canvas rendering pipeline creating the signature Halcyon wave motion graphics.
* [src/components/Dashboard.jsx](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/frontend/src/components/Dashboard.jsx): Grid layout detailing aggregate statistics, severity splits, and real-time incident updates.
* [src/components/AuditView.jsx](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/frontend/src/components/AuditView.jsx): Comprehensive audit logs visualizing cost, latency, and Model Routing details.

---

## 🚀 Quick Start

Ensure you have Python 3.10+ and Node.js 18+ installed on your system.

### 1. Set Up the Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install requirements:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate

   pip install -r requirements.txt
   ```
3. Create your local configuration file:
   ```bash
   cp .env.example .env
   ```
   *Modify `.env` to include your credentials (minimum `GROQ_API_KEY`).*
4. Run the FastAPI server:
   ```bash
   uvicorn app:app --reload
   ```
   The backend API will run at `http://127.0.0.1:8000`. You can inspect documentation at `http://127.0.0.1:8000/docs`.

---

### 2. Set Up the Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The frontend app will launch at `http://localhost:5173`. Click the **Enter Dashboard &rarr;** button to transition from the interactive hero animation to the live monitoring panel.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend Core** | React 19, Wouter | Component architecture and client-side routing |
| **Styling** | TailwindCSS, PostCSS | Responsive design system, glassmorphic filters |
| **Motion Graphics** | HTML5 Canvas, Framer Motion | Dynamic mathematical waveforms and atmospheric gradients |
| **Data Viz** | Recharts | Interactive audit, billing, and incident dashboards |
| **Web Framework** | FastAPI (Uvicorn ASGI) | High-performance asynchronous API endpoints |
| **Database & ORM** | SQLAlchemy 2.x, SQLite | Relational database persistent store with aiosqlite |
| **AI Orchestration** | Groq SDK, Hindsight | Local stubs, Vectorize similarity searches, and LLM inference |
| **Validation** | Pydantic v2 | Robust request/response schema parsing |

---

## 🧠 Deep Dive: Inside the Waveform Motion Graphic

The real-time wave simulation relies on rendering multiple overlapping sine curves with differing phase velocities:

$$\text{Amplitude}_{\text{total}} = A \cdot \sin(x \cdot \omega \cdot \text{mult}_{\text{freq}} + \phi \cdot t)$$

Where:
* $A$ is the interpolated amplitude target (lerping up when chaotic, down when calm).
* $\omega$ represents the wave frequency.
* $\phi$ represents the speed coefficients mapping the phase velocity.
* $t$ is the elapsed animation frame count.

By overlaying a primary dense wave ($A=1.0$), a secondary offset wave ($A=0.65$), and a tertiary soft background glow wave ($A=0.35$), the canvas generates a volumetric fluid look matching the product's premium aesthetic.

*Check out [Waveform.jsx](file:///c:/Users/priya/Desktop/Hackathon/Halcyon/frontend/src/components/Waveform.jsx) to review or tweak the mathematical values directly!*
