import { useState, useEffect } from 'react';
import { api } from '../api';
import Card from './ui/Card';

export default function MemoryView() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const data = await api.getHistory('?is_solved=true');
        setMemories(data.incidents || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-64 bg-halcyon-surface-raised rounded-xl max-w-4xl mx-auto mt-8"></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-12 border-b border-halcyon-border/50 pb-6">
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-halcyon-text mb-2">Institutional Memory</h1>
        <p className="text-halcyon-text-muted font-medium text-lg">A map of past incident resolutions actively used by the agent.</p>
      </div>

      {memories.length === 0 ? (
        <Card className="text-center py-24 bg-halcyon-surface-raised/50 border-dashed">
          <p className="text-halcyon-text-muted font-medium text-lg">No memories stored yet.</p>
        </Card>
      ) : (
        <div className="relative border-l-2 border-halcyon-border/60 ml-6 pl-10 space-y-12 pb-12">
          {memories.map((mem) => (
            <div key={mem.id} className="relative group">
              {/* Node connecting dot */}
              <div className="absolute -left-[49px] top-6 w-5 h-5 bg-halcyon-surface border-[4px] border-halcyon-teal rounded-full shadow-sm group-hover:scale-110 transition-transform" />
              
              <Card className="border-halcyon-teal/20 hover:border-halcyon-teal/50 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight mb-1 text-halcyon-text">{mem.title}</h3>
                    <p className="text-xs font-mono text-halcyon-text-muted font-semibold">
                      ID: INC-{mem.id.toString().padStart(4, '0')} • Stored {new Date(mem.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-halcyon-teal/10 border border-halcyon-teal/20 text-halcyon-teal px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                    Stored Memory
                  </span>
                </div>
                
                <div className="bg-halcyon-surface-raised/80 p-5 rounded-lg border border-halcyon-border/50 font-mono text-sm text-halcyon-text mb-6 leading-relaxed shadow-sm">
                  {mem.solution || mem.fix_suggestion}
                </div>
                
                {/* Linked Future Incidents */}
                {mem.similar_incidents && mem.similar_incidents.length > 0 && (
                  <div className="border-t border-halcyon-border/50 pt-5 mt-5">
                    <p className="text-xs uppercase tracking-widest text-halcyon-text-muted font-mono font-bold mb-3">Used to solve:</p>
                    <div className="flex gap-3 flex-wrap">
                      {mem.similar_incidents.map((sim, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-halcyon-surface border border-halcyon-border rounded-md text-xs font-mono font-semibold text-halcyon-text shadow-sm hover:border-halcyon-teal/40 transition-colors cursor-default">
                          INC-{sim.similar_to_id.toString().padStart(4, '0')} <span className="text-halcyon-teal ml-1">({Math.round(sim.similarity_score * 100)}%)</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
