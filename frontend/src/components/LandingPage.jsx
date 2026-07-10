import { useState, useEffect } from 'react';
import Waveform from './Waveform';
import { ArrowRight, Activity, Zap, Database } from 'lucide-react';

export default function LandingPage({ onEnterApp }) {
  const [heroState, setHeroState] = useState('chaotic');
  const [headline, setHeadline] = useState('Incident memory,');

  useEffect(() => {
    // 2-second payoff moment
    const timer = setTimeout(() => {
      setHeroState('calm');
      setHeadline('Incident memory, calmed.');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-halcyon-bg text-halcyon-text font-body selection:bg-halcyon-teal/20 overflow-hidden relative">
      
      {/* Background soft ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-halcyon-teal/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 lg:px-12 relative z-10 border-b border-halcyon-border/50 bg-halcyon-surface/50 backdrop-blur-md">
        <div className="font-display font-bold text-2xl tracking-tight">HALCYON</div>
        <button 
          onClick={onEnterApp}
          className="font-mono text-sm font-semibold tracking-wide bg-halcyon-text text-halcyon-surface px-6 py-2.5 rounded-lg hover:bg-halcyon-teal transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          ENTER DASHBOARD
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 h-24">
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-halcyon-text to-halcyon-text-muted">
            {headline}
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-halcyon-text-muted max-w-2xl font-medium mb-16 leading-relaxed">
          The storm is familiar. Resolve infrastructure incidents instantly using an active institutional memory of past fixes.
        </p>

        {/* Hero Waveform */}
        <div className="w-full max-w-4xl h-48 md:h-64 flex items-center justify-center mb-24 opacity-90 drop-shadow-2xl">
          <Waveform state={heroState} size="large" />
        </div>

        {/* Before / After Section */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-32 px-4">
          {/* Chaos */}
          <div className="bg-[#05080f] border border-red-900/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-halcyon-amber to-red-500 opacity-50" />
            <h3 className="font-mono text-halcyon-amber text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
              <Activity size={14} /> The Storm
            </h3>
            <pre className="font-mono text-sm text-red-400/80 whitespace-pre-wrap leading-loose">
              <span className="text-red-500 font-bold">[CRITICAL]</span> OOMKilled in pod api-deployment-7f9cc
              <br/>Memory cgroup out of memory
              <br/>...
              <br/><span className="text-red-300">Total downtime: Escalated to on-call.</span>
            </pre>
          </div>

          {/* Calm */}
          <div className="bg-halcyon-surface border border-halcyon-teal/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden group hover:-translate-y-1 hover:shadow-halcyon-glow-teal transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-halcyon-teal to-blue-500 opacity-80" />
            <h3 className="font-mono text-halcyon-teal text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
              <Zap size={14} /> The Calm
            </h3>
            <div className="font-mono text-sm text-halcyon-text whitespace-pre-wrap leading-loose space-y-4">
              <div className="bg-halcyon-surface-raised p-3 rounded-md border border-halcyon-border/50">
                <span className="text-halcyon-teal font-bold">[RESOLVED]</span> Memory Match Found: INC-0042
              </div>
              <p className="text-halcyon-text-muted font-medium">Applied fix: Increased memory limit to 2Gi.</p>
              <div className="text-halcyon-teal font-bold mt-4">Total downtime: 2.1s (Cost: $0.0001)</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Stats Strip */}
      <footer className="border-t border-halcyon-border/50 bg-halcyon-surface py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-halcyon-border/50">
          <div>
            <div className="text-3xl font-display font-bold text-halcyon-text mb-1">98%</div>
            <div className="text-xs font-mono text-halcyon-text-muted uppercase tracking-wider font-semibold">Faster Resolution</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-halcyon-text mb-1">100x</div>
            <div className="text-xs font-mono text-halcyon-text-muted uppercase tracking-wider font-semibold">Cheaper Inference</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-halcyon-text mb-1">Zero</div>
            <div className="text-xs font-mono text-halcyon-text-muted uppercase tracking-wider font-semibold">Compliance Risks</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-halcyon-teal mb-1">Infinite</div>
            <div className="text-xs font-mono text-halcyon-text-muted uppercase tracking-wider font-semibold">Institutional Memory</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
