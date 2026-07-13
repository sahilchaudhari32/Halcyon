import { useEffect, useRef, useState } from 'react';

const DEFAULT_AMBER = '#E8935B'; // kingfisher-amber
const DEFAULT_TEAL = '#2EC4B6';  // kingfisher-teal

// Helper to parse hex color to RGB
function parseHex(hex) {
  if (!hex || !hex.startsWith('#')) return { r: 46, g: 196, b: 182 };
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Helper to interpolate between two hex colors
function interpolateColor(color1, color2, factor) {
  const c1 = parseHex(color1);
  const c2 = parseHex(color2);
  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Waveform({ state = 'calm', size = 'small', color }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const currentRef = useRef(null);
  const particlesRef = useRef([]);
  
  // Size mapping
  const staticWidth = size === 'large' ? 800 : size === 'medium' ? 160 : 80;
  const height = size === 'large' ? 180 : size === 'medium' ? 56 : 28;
  
  const [width, setWidth] = useState(staticWidth);

  // Resize listener for large full-bleed waveforms
  useEffect(() => {
    if (size !== 'large') return;
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  // Initialize particles once width is determined
  useEffect(() => {
    const count = size === 'large' ? 45 : size === 'medium' ? 18 : 8;
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * width,
        yOffset: (Math.random() - 0.5) * (height * 0.4),
        vx: 0.4 + Math.random() * 0.8,
        size: 1 + Math.random() * 2.2,
        alpha: 0.15 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02
      });
    }
    particlesRef.current = newParticles;
  }, [width, height, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    
    // High-DPI canvas scaling for razor-sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    let animationFrameId;
    let time = 0;
    
    // Configuration based on size and state
    const baseAmpChaos = size === 'large' ? 45 : size === 'medium' ? 20 : 6;
    const baseAmpCalm = size === 'large' ? 12 : size === 'medium' ? 6 : 2;
    const noiseFactorChaos = size === 'large' ? 14 : size === 'medium' ? 7 : 3;
    const freqChaos = size === 'large' ? 0.012 : size === 'medium' ? 0.035 : 0.10;
    const freqCalm = size === 'large' ? 0.006 : size === 'medium' ? 0.018 : 0.05;
    
    const getTargets = (s) => {
      const isChaotic = s === 'chaotic';
      const targetColor = color || (isChaotic ? DEFAULT_AMBER : DEFAULT_TEAL);
      return {
        amp: isChaotic ? baseAmpChaos : baseAmpCalm,
        freq: isChaotic ? freqChaos : freqCalm,
        speed: isChaotic ? 0.07 : 0.02,
        noise: isChaotic ? noiseFactorChaos : 0,
        colorHex: targetColor,
        glow: isChaotic ? 12 : 4,
        particleSpeedMult: isChaotic ? 3.5 : 1.0,
      };
    };

    if (!currentRef.current) {
      currentRef.current = getTargets(state);
      currentRef.current.colorRGB = getTargets(state).colorHex;
    }
    const current = currentRef.current;
    
    const render = () => {
      const target = getTargets(state);
      
      // Lerp transition settings for silky smooth responses
      const lerpFactor = 0.04;
      current.amp += (target.amp - current.amp) * lerpFactor;
      current.freq += (target.freq - current.freq) * lerpFactor;
      current.speed += (target.speed - current.speed) * lerpFactor;
      current.noise += (target.noise - current.noise) * lerpFactor;
      current.glow += (target.glow - current.glow) * lerpFactor;
      current.particleSpeedMult += (target.particleSpeedMult - current.particleSpeedMult) * lerpFactor;
      
      // Smooth color morphing
      current.colorRGB = interpolateColor(current.colorRGB, target.colorHex, lerpFactor);

      if (!prefersReducedMotion) {
        time += current.speed;
      }
      
      ctx.clearRect(0, 0, width, height);
      const midY = height / 2;
      
      // --- BACKGROUND GRID / GLOW ---
      if (size === 'large') {
        ctx.save();
        ctx.strokeStyle = 'rgba(140, 165, 150, 0.04)';
        ctx.lineWidth = 0.5;
        const gridSpacing = 20;
        // Verticals
        for (let x = 0; x < width; x += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        // Horizontals
        for (let y = 0; y < height; y += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // --- MATHEMATICAL MULTI-HARMONIC WAVES ---
      const waveConfigs = size === 'large' ? [
        { ampMult: 1.0, freqMult: 1.0, phaseSpeed: 1.0, opacity: 0.9, width: 2.5, drawFill: true },
        { ampMult: 0.6, freqMult: 1.6, phaseSpeed: -0.8, opacity: 0.45, width: 1.5, drawFill: false },
        { ampMult: 0.25, freqMult: 3.2, phaseSpeed: 1.8, opacity: 0.2, width: 0.8, drawFill: false }
      ] : size === 'medium' ? [
        { ampMult: 1.0, freqMult: 1.0, phaseSpeed: 1.0, opacity: 0.9, width: 2.0, drawFill: true },
        { ampMult: 0.5, freqMult: 1.8, phaseSpeed: -0.7, opacity: 0.4, width: 1.0, drawFill: false }
      ] : [
        { ampMult: 1.0, freqMult: 1.0, phaseSpeed: 1.0, opacity: 0.9, width: 1.5, drawFill: true }
      ];

      // Store main wave points for particles and nodes to align with
      const mainWaveY = new Array(Math.ceil(width) + 1);

      waveConfigs.forEach((config) => {
        ctx.save();
        
        // Apply neon glow using shadow properties
        ctx.shadowBlur = current.glow;
        ctx.shadowColor = current.colorRGB;
        ctx.strokeStyle = current.colorRGB;
        ctx.globalAlpha = config.opacity;
        ctx.lineWidth = config.width;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        
        for (let x = 0; x <= width; x += 1) {
          const phase = time * config.phaseSpeed;
          // Primary low frequency + harmonic components
          let displacement = Math.sin(x * current.freq * config.freqMult + phase) * current.amp * config.ampMult;
          
          // Add organic harmonic secondary variations (Fourier-style)
          displacement += Math.cos(x * current.freq * 2.2 * config.freqMult - phase * 1.3) * (current.amp * 0.15 * config.ampMult);
          
          // Chaotic state turbulence/noise
          if (current.noise > 0.5 && !prefersReducedMotion) {
            const noise = Math.sin(x * 0.38 + time * 3.2) * current.noise * config.ampMult * 0.65;
            const microJitter = Math.cos(x * 0.95 - time * 6.5) * (current.noise * 0.22) * config.ampMult * 0.65;
            displacement += noise + microJitter;
          }
          
          const y = midY + displacement;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          
          // Cache the primary wave's coordinates
          if (config.drawFill) {
            mainWaveY[Math.floor(x)] = y;
          }
        }
        ctx.stroke();
        
        // Glassmorphic translucent fill under primary wave
        if (config.drawFill && (size === 'medium' || size === 'large')) {
          ctx.shadowBlur = 0; // disable shadow for fill performance
          const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
          
          // Get transparent RGB representation
          const baseColor = current.colorRGB.replace('rgb', 'rgba').replace(')', '');
          fillGrad.addColorStop(0, `${baseColor}, 0.15)`);
          fillGrad.addColorStop(0.5, `${baseColor}, 0.04)`);
          fillGrad.addColorStop(1, `${baseColor}, 0.0)`);
          
          ctx.fillStyle = fillGrad;
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.globalAlpha = 0.4;
          ctx.fill();
        }
        
        ctx.restore();
      });

      // --- DYNAMIC PARTICLE SYSTEM (Neural Data Packets) ---
      if (!prefersReducedMotion && (size === 'large' || size === 'medium')) {
        ctx.save();
        particlesRef.current.forEach((p) => {
          // Move particle along the wave horizontally
          p.x += p.vx * current.particleSpeedMult;
          p.phase += p.pulseSpeed;
          
          // Wrap around edges
          if (p.x > width) {
            p.x = 0;
            p.yOffset = (Math.random() - 0.5) * (height * 0.4);
          }
          
          // Fetch corresponding wave Y coordinate
          const currentX = Math.floor(p.x);
          const baseWaveY = mainWaveY[currentX] !== undefined ? mainWaveY[currentX] : midY;
          
          // Particle floats relative to wave position
          const finalY = baseWaveY + p.yOffset + Math.sin(p.phase) * (state === 'chaotic' ? 6 : 2);
          
          // Pulsing opacity and scale
          const currentAlpha = p.alpha * (0.6 + Math.sin(p.phase * 2) * 0.4);
          const currentSize = p.size * (0.85 + Math.cos(p.phase) * 0.15) * (state === 'chaotic' ? 1.4 : 1.0);
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, finalY, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = current.colorRGB;
          ctx.globalAlpha = currentAlpha;
          ctx.shadowBlur = state === 'chaotic' ? 5 : 2;
          ctx.shadowColor = current.colorRGB;
          ctx.fill();
        });
        ctx.restore();
      }

      // --- INTERACTIVE PULSING NODES ---
      if (size === 'large') {
        ctx.save();
        const nodeCount = state === 'chaotic' ? 5 : 3;
        for (let i = 1; i <= nodeCount; i++) {
          const xPercent = i / (nodeCount + 1);
          const nodeX = Math.floor(width * xPercent);
          const nodeY = mainWaveY[nodeX] !== undefined ? mainWaveY[nodeX] : midY;
          
          // Micro-pulse animation based on sine
          const pulse = Math.sin(time * 2.5 + i) * 3 + (state === 'chaotic' ? 4 : 2);
          
          // Outer halo glow
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, pulse + 6, 0, Math.PI * 2);
          ctx.fillStyle = current.colorRGB;
          ctx.globalAlpha = state === 'chaotic' ? 0.12 : 0.05;
          ctx.fill();
          
          // Inner core node
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, state === 'chaotic' ? 4.5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = current.colorRGB;
          ctx.shadowBlur = 8;
          ctx.shadowColor = current.colorRGB;
          ctx.globalAlpha = 0.95;
          ctx.fill();
        }
        ctx.restore();
      }

      const dist = Math.abs(current.amp - target.amp) + Math.abs(current.noise - target.noise);
      if (prefersReducedMotion && dist < 0.1) {
        return;
      }
      
      if (!prefersReducedMotion || dist >= 0.1) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    
    render();
    
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [state, size, width, height, color]);
  
  return (
    <div 
      ref={containerRef}
      style={{ width: size === 'large' ? '100%' : width, height, overflow: 'hidden' }} 
      className="flex items-center justify-center relative w-full"
    >
      {/* Soft background glow (Afterlife style) */}
      {size === 'large' && (
        <div 
          className="absolute inset-0 w-full h-full blur-[70px] opacity-10 rounded-full transition-colors duration-500 pointer-events-none"
          style={{ backgroundColor: state === 'chaotic' ? DEFAULT_AMBER : DEFAULT_TEAL }}
        />
      )}
      <canvas 
        ref={canvasRef} 
        style={{ width: `${width}px`, height: `${height}px`, display: 'block', zIndex: 1 }} 
      />
    </div>
  );
}
