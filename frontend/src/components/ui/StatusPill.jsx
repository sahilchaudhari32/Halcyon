export default function StatusPill({ status, confidence }) {
  const isMatch = status === 'memory-match';
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium tracking-wide transition-colors ${
      isMatch 
        ? 'bg-halcyon-teal/10 border-halcyon-teal/20 text-halcyon-teal shadow-[0_0_10px_-2px_rgba(13,148,136,0.2)]' 
        : 'bg-halcyon-amber/10 border-halcyon-amber/20 text-halcyon-amber shadow-[0_0_10px_-2px_rgba(234,88,12,0.2)]'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isMatch ? 'bg-halcyon-teal' : 'bg-halcyon-amber'}`} />
      {isMatch ? `MEMORY MATCH ${confidence ? `— ${confidence}%` : ''}` : 'ESCALATED — NOVEL'}
    </div>
  );
}
