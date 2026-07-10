import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { api } from '../api';
import Card from './ui/Card';
import StatusPill from './ui/StatusPill';
import Waveform from './Waveform';

export default function Dashboard({ setGlobalState }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [samples, setSamples] = useState([]);
  const [showSimModal, setShowSimModal] = useState(false);

  const fetchIncidents = async () => {
    try {
      const data = await api.getHistory();
      setIncidents(data.incidents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSamples = async () => {
    try {
      const data = await api.listSamples();
      setSamples(data.scenarios || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchSamples();
  }, []);

  const handleSimulate = async (scenarioName) => {
    setShowSimModal(false);
    setSimulating(true);
    setGlobalState('chaotic');
    
    try {
      await api.loadSample(scenarioName);
      await fetchIncidents();
      setGlobalState('calm');
    } catch (err) {
      console.error(err);
      setGlobalState('calm');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-end mb-10 border-b border-halcyon-border/50 pb-6">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight text-halcyon-text mb-2">Incident Feed</h1>
          <p className="text-halcyon-text-muted font-medium text-lg">Live view of incoming alerts and resolutions.</p>
        </div>
        <button
          onClick={() => setShowSimModal(true)}
          disabled={simulating}
          className="bg-halcyon-text text-halcyon-surface hover:bg-halcyon-teal px-6 py-2.5 rounded-lg text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-halcyon-text"
        >
          {simulating ? 'Simulating...' : 'Simulate Incident'}
        </button>
      </div>

      {showSimModal && (
        <div className="fixed inset-0 bg-halcyon-text/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border-none shadow-2xl relative overflow-hidden bg-halcyon-surface scale-100 animate-in fade-in zoom-in-95 duration-200">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-halcyon-amber to-red-500" />
             <h3 className="font-display text-2xl font-bold tracking-tight mb-3 text-halcyon-text">Simulate Active Incident</h3>
             <p className="text-sm text-halcyon-text-muted font-medium mb-8 leading-relaxed">Select a sample log scenario to inject into the system. Halcyon will analyze and resolve it in real-time.</p>
             <div className="space-y-3">
               {samples.map(s => (
                 <button 
                   key={s.name}
                   onClick={() => handleSimulate(s.name)}
                   className="w-full text-left p-4 rounded-lg bg-halcyon-surface-raised border border-halcyon-border hover:border-halcyon-amber hover:shadow-sm transition-all font-mono text-sm font-medium text-halcyon-text group"
                 >
                   <span className="group-hover:text-halcyon-amber transition-colors">{s.name}.log</span>
                 </button>
               ))}
               {samples.length === 0 && <p className="text-sm text-halcyon-text-muted bg-halcyon-surface-raised p-4 rounded-lg">No sample scenarios found.</p>}
             </div>
             <div className="mt-8 text-right">
               <button onClick={() => setShowSimModal(false)} className="text-sm font-semibold text-halcyon-text-muted hover:text-halcyon-text transition-colors">Cancel</button>
             </div>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-24 bg-halcyon-surface-raised rounded-xl border border-halcyon-border/50" />
             ))}
          </div>
        ) : incidents.length === 0 ? (
          <Card className="text-center py-24 bg-halcyon-surface-raised/50 border-dashed">
            <p className="text-halcyon-text-muted font-medium text-lg">No incidents recorded yet.</p>
          </Card>
        ) : (
          incidents.map((inc) => (
            <Link key={inc.id} href={`/incident/${inc.id}`}>
              <a className="block group">
                <Card className="group-hover:border-halcyon-teal/40 group-hover:shadow-md flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-8">
                    <Waveform state={inc.is_solved ? 'calm' : 'chaotic'} size="small" />
                    <div>
                      <h3 className="font-semibold text-lg text-halcyon-text mb-1 tracking-tight">{inc.title}</h3>
                      <div className="flex items-center gap-4 text-xs font-mono text-halcyon-text-muted font-medium">
                        <span>ID: INC-{(inc.id).toString().padStart(4, '0')}</span>
                        <span>{new Date(inc.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {inc.is_solved && inc.similar_incidents?.length > 0 ? (
                      <StatusPill status="memory-match" confidence={Math.round((inc.confidence_score || 0) * 100)} />
                    ) : (
                      <StatusPill status="escalated" />
                    )}
                  </div>
                </Card>
              </a>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
