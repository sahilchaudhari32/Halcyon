import { useEffect, useRef } from 'react';

const DEFAULT_AMBER = '#EA580C';
const DEFAULT_TEAL = '#0D9488';

export default function Waveform({ state = 'calm', size = 'small', color }) {
  const canvasRef = useRef(null);
  
  // Size mapping
  const width = size === 'large' ? 800 : 60;
  const height = size === 'large' ? 120 : 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    
    // High-DPI canvas scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    let animationFrameId;
    let time = 0;
    
    // Configuration based on size
    const baseAmpChaos = size === 'large' ? 30 : 6;
    const baseAmpCalm = size === 'large' ? 10 : 2;
    const noiseFactorChaos = size === 'large' ? 15 : 3;
    const freqChaos = size === 'large' ? 0.02 : 0.15;
    const freqCalm = size === 'large' ? 0.01 : 0.08;
    
    // State targets
    const getTargets = (s) => {
      const isChaotic = s === 'chaotic';
      return {
        amp: isChaotic ? baseAmpChaos : baseAmpCalm,
        freq: isChaotic ? freqChaos : freqCalm,
        speed: isChaotic ? 0.15 : 0.03,
        noise: isChaotic ? noiseFactorChaos : 0,
      };
    };

    let current = getTargets(state);
    
    const render = () => {
      const target = getTargets(state);
      
      // Lerp towards targets (0.03 lerp factor gives a smooth ~1.5-2s ease-out at 60fps)
      const lerp = 0.03;
      current.amp += (target.amp - current.amp) * lerp;
      current.freq += (target.freq - current.freq) * lerp;
      current.speed += (target.speed - current.speed) * lerp;
      current.noise += (target.noise - current.noise) * lerp;

      if (!prefersReducedMotion) {
        time += current.speed;
      }
      
      // Determine stroke color
      let strokeColor = color;
      if (!strokeColor) {
        // If state is calm but we are still transitioning down, we might want to fade color.
        // For simplicity and crispness, snap the color immediately or based on state prop.
        strokeColor = state === 'chaotic' ? DEFAULT_AMBER : DEFAULT_TEAL;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = size === 'large' ? 2.5 : 1.5;
      ctx.lineJoin = 'round';
      
      const midY = height / 2;
      
      for (let x = 0; x <= width; x += 1) {
        // Base sine wave
        let y = midY + Math.sin(x * current.freq + time) * current.amp;
        
        // Add pseudo-random noise layers for chaotic state
        if (current.noise > 0.5 && !prefersReducedMotion) {
            const noise1 = Math.sin(x * 0.5 + time * 2) * current.noise;
            const noise2 = Math.cos(x * 0.2 - time * 3) * (current.noise * 0.5);
            y += noise1 + noise2;
        }
        // Fallback static jaggedness for reduced motion
        if (current.noise > 0.5 && prefersReducedMotion) {
             const staticNoise = Math.sin(x * 0.5) * current.noise + Math.cos(x * 0.2) * (current.noise * 0.5);
             y += staticNoise;
        }
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.stroke();
      
      // Check if we reached the target closely enough to stop rendering if calm & reduced motion
      const dist = Math.abs(current.amp - target.amp) + Math.abs(current.noise - target.noise);
      if (prefersReducedMotion && dist < 0.1) {
        return; // Stop animation loop if reduced motion and we arrived at target
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
    <div style={{ width, height, overflow: 'hidden' }} className="flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        style={{ width: `${width}px`, height: `${height}px`, display: 'block' }} 
      />
    </div>
  );
}
