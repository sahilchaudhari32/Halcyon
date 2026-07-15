import React from 'react';

export default function StatusPill({ status, confidence }) {
  const isMatch = status === 'memory-match';
  
  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-sm border text-xs font-mono font-medium tracking-wide transition-colors ${
      isMatch 
        ? 'bg-surface border-text-muted text-text-primary' 
        : 'bg-background border-border-light text-text-muted'
    }`}>
      {isMatch ? `KNOWN ISSUE ${confidence ? `— ${confidence}%` : ''}` : 'NOVEL INCIDENT'}
    </div>
  );
}
