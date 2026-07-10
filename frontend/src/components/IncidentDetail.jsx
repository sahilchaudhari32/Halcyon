import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { api } from '../api';
import Card from './ui/Card';
import StatusPill from './ui/StatusPill';

export default function IncidentDetail({ id }) {
  const [incident, setIncident] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incData, auditData] = await Promise.all([
          api.getIncident(id),
          api.getIncidentAudit(id)
        ]);
        setIncident(incData);
        setAuditLogs(auditData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="animate-pulse h-64 bg-halcyon-surface-raised rounded-xl max-w-5xl mx-auto mt-8"></div>;
  }
  
  if (!incident) {
    return <div className="text-halcyon-text-muted text-center py-20 font-medium">Incident not found.</div>;
  }

  const primaryAudit = auditLogs[0] || {};
  const isMemoryMatch = primaryAudit.memory_hit || (incident.similar_incidents?.length > 0);
  const confidence = Math.round((incident.confidence_score || 0) * 100);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8 border-b border-halcyon-border/50 pb-6">
        <Link href="/">
          <a className="text-halcyon-text-muted hover:text-halcyon-text text-sm font-semibold mb-6 inline-flex items-center transition-colors">
            &larr; <span className="ml-1">Back to Feed</span>
          </a>
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-display font-extrabold tracking-tight text-halcyon-text mb-2">{incident.title}</h1>
            <div className="flex items-center gap-4 text-sm font-mono text-halcyon-text-muted font-medium">
              <span>ID: INC-{id.toString().padStart(4, '0')}</span>
              <span>{new Date(incident.created_at).toLocaleString()}</span>
            </div>
          </div>
          <StatusPill status={isMemoryMatch ? 'memory-match' : 'escalated'} confidence={confidence} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
        {/* Raw Log Output (Dark Terminal for contrast) */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 shadow-xl flex flex-col h-full relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 text-halcyon-text-muted/50 border-b border-[#1e293b] pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm" />
            <span className="font-mono text-xs ml-2 font-medium text-slate-400">{incident.log_filename || 'raw-input.log'}</span>
          </div>
          <pre className="font-mono text-sm leading-loose text-red-400 overflow-x-auto whitespace-pre-wrap flex-1">
            {incident.log_content}
          </pre>
        </div>

        {/* Agent Reasoning */}
        <Card className="flex flex-col shadow-lg border-halcyon-border/80">
          <h3 className="font-display text-2xl font-bold tracking-tight border-b border-halcyon-border/50 pb-4 mb-6">Agent Reasoning</h3>
          
          <div className="space-y-8 flex-1">
            {/* Path Taken */}
            <div>
              <p className="text-xs uppercase tracking-widest text-halcyon-text-muted font-mono font-bold mb-3">Path Taken</p>
              <div className="bg-halcyon-surface-raised border border-halcyon-border rounded-lg p-4 flex justify-between items-center shadow-sm">
                <span className="font-semibold text-sm text-halcyon-text">
                  {primaryAudit.model_tier === 'fast-path' ? 'Hindsight Memory (Fast Path)' : 'Cascadeflow (Escalated)'}
                </span>
                <span className="font-mono text-xs text-halcyon-text-muted bg-halcyon-surface px-2 py-1 rounded shadow-sm border border-halcyon-border/50">{primaryAudit.model_used}</span>
              </div>
            </div>

            {/* Diagnostics */}
            <div className="grid grid-cols-2 gap-6 bg-halcyon-surface-raised/50 p-4 rounded-lg border border-halcyon-border/30">
              <div>
                <p className="text-xs uppercase tracking-widest text-halcyon-text-muted font-mono font-bold mb-2">Root Cause</p>
                <p className="text-sm text-halcyon-text font-medium">{incident.root_cause || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-halcyon-text-muted font-mono font-bold mb-2">Severity</p>
                <p className={`text-sm font-bold ${incident.severity === 'CRITICAL' || incident.severity === 'HIGH' ? 'text-halcyon-amber' : 'text-halcyon-teal'}`}>
                  {incident.severity}
                </p>
              </div>
            </div>

            {/* Suggested Resolution */}
            <div>
              <p className="text-xs uppercase tracking-widest text-halcyon-text-muted font-mono font-bold mb-3">Suggested Resolution</p>
              <div className="bg-halcyon-teal/5 border border-halcyon-teal/20 p-5 rounded-lg text-halcyon-text font-mono text-sm leading-relaxed shadow-sm">
                {incident.solution || incident.fix_suggestion || 'No resolution provided.'}
              </div>
            </div>
            
            {/* Memory Link */}
            {isMemoryMatch && incident.similar_incidents?.length > 0 && (
              <div className="text-sm text-halcyon-teal bg-halcyon-teal/10 p-4 rounded-lg border border-halcyon-teal/20 font-medium flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                Matched past incident <strong className="ml-1">INC-{incident.similar_incidents[0].similar_to_id.toString().padStart(4, '0')}</strong>.
              </div>
            )}
          </div>
          
          {/* Metrics Footer */}
          <div className="pt-6 mt-8 border-t border-halcyon-border/50 grid grid-cols-2 text-xs font-mono text-halcyon-text-muted font-semibold">
             <div>COST: <span className="text-halcyon-text bg-halcyon-surface-raised px-2 py-1 rounded ml-1">${primaryAudit.cost?.toFixed(5) || '0.00000'}</span></div>
             <div className="text-right">LATENCY: <span className="text-halcyon-text bg-halcyon-surface-raised px-2 py-1 rounded ml-1">{primaryAudit.latency_ms?.toFixed(0) || '0'}ms</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
