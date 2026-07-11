# Halcyon — Frontend Application

This directory contains the **Vite + React** single page application (SPA) for Halcyon. It features a premium developer-focused interface, dark-mode design aesthetics, interactive real-time canvas waveforms, and animated transitions.

---

## 🎨 Motion Graphics & Visual Aesthetics

The Halcyon frontend is built with high-fidelity visual design principles (inspired by modern developer interfaces and atmospheric dark themes).

### 🌊 HTML5 Canvas Oscilloscope (`Waveform.jsx`)
Instead of static images or heavy video elements, Halcyon uses a custom mathematical waveform rendered directly onto a high-DPI HTML5 Canvas context:
* **Wave Synthesis**: Evaluates multiple overlapping sine waves using different frequencies, amplitude scales, and phase velocities.
* **Physics Interpolation**: Transitions between the `calm` (stable system) and `chaotic` (system anomaly) states using **Linear Interpolation (LERP)**. This makes the wave state shift feel fluid and organic.
* **Jitter Simulation**: The `chaotic` state dynamically overlays high-frequency cosine noise and time-varying offsets to mimic telemetry fluctuations.
* **High-DPI Scaling**: Automatically scales the Canvas drawing context according to the browser's `devicePixelRatio` to prevent blurriness on Retina screens.

### 🌌 Atmospheric Backgrounds
Using `framer-motion`, floating mesh spheres drift slowly in the background behind a heavy backdrop blur. This generates a moving glassmorphic gradient effect that keeps the application feeling alive and organic.

---

## 📂 Structure & Key Components

```
frontend/src/
├── App.jsx              # Main router & Global State controller
├── main.jsx             # React entry mountpoint
├── index.css            # Base Tailwind configurations & global fonts
├── api.js               # Service client mapping endpoints to the FastAPI backend
│
├── context/
│   └── AppContext.jsx   # Language translation (i18n) & UI theme context
│
├── components/
│   ├── Waveform.jsx     # Canvas oscilloscope graphics engine
│   ├── LandingPage.jsx  # Rich hero screen with animated meshes, accordion FAQs
│   ├── Dashboard.jsx    # Real-time incident counts, severity splits, cost dials
│   ├── IncidentDetail.jsx # Visual diagnostic trace with timeline elements
│   ├── AuditView.jsx    # Complete routing decisions history log & metrics
│   ├── BillingView.jsx  # Billing plans and detailed savings indicators
│   ├── MemoryView.jsx   # Vector memory search and retrieval dashboard
│   │
│   ├── layout/
│   │   ├── AppShell.jsx # Sidebar layout with dynamic state-based glow effects
│   │   └── Topbar.jsx   # Diagnostics summary and system status header
│   │
│   └── ui/              # Atom components (Button, Card, Input)
```

---

## 🚀 Getting Started

Ensure you have Node.js 18+ installed on your system.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will serve locally at `http://localhost:5173`.
