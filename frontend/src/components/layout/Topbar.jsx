import Waveform from '../Waveform';

export default function Topbar({ systemState }) {
  const isChaotic = systemState === 'chaotic';
  
  return (
    <header className="h-16 border-b border-halcyon-border/50 bg-halcyon-surface/80  flex items-center justify-between px-8 sticky top-0 z-10 shadow-none transition-colors duration-500">
      <div className="flex items-center gap-4">
        <div className={`text-xs font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-sm border transition-colors duration-500 ${
          isChaotic 
            ? 'bg-halcyon-amber/10 text-halcyon-amber border-halcyon-amber/20 shadow-halcyon-glow-amber' 
            : 'bg-halcyon-teal/10 text-halcyon-teal border-halcyon-teal/20 shadow-halcyon-glow-teal'
        }`}>
          {isChaotic ? 'Active Incident' : 'System Calm'}
        </div>
      </div>
      
      <div className="h-8 w-48 opacity-80 mix-blend-multiply">
        <Waveform state={systemState} size="small" />
      </div>
    </header>
  );
}
