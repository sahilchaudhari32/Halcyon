import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Cpu, 
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Server,
  Zap
} from 'lucide-react';
import { api } from '../api';
import Card from './ui/Card';

const COLORS = {
  memory: '#8CA596',     // Sage Green (Afterlife accent-warm)
  escalated: '#E29A76',  // Apricot (Afterlife primary)
  neutral: '#A6B4C4'     // Dusty Blue (Afterlife secondary)
};

export default function AuditView() {
  const [stats, setStats] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState('cost'); // 'cost' | 'latency'
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statData, decisionData] = await Promise.all([
          api.getStats(),
          api.getDecisions('?page_size=100')
        ]);
        setStats(statData);
        // Store chronological decisions for charts
        setDecisions(decisionData.decisions?.reverse() || []); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    return decisions.map((d) => ({
      name: `INC-${d.incident_id}`,
      cost: d.cost,
      latency: d.latency_ms,
      tier: d.model_tier === 'fast-path' ? 'Fast' : 'Escalated'
    }));
  }, [decisions]);

  const pieData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Memory Match', value: stats.ai_decisions?.memory_hits || 0, color: COLORS.memory },
      { name: 'Escalated (Novel)', value: stats.ai_decisions?.escalations || 0, color: COLORS.escalated },
      { name: 'Direct/Other', value: (stats.ai_decisions?.total_decisions || 0) - ((stats.ai_decisions?.memory_hits || 0) + (stats.ai_decisions?.escalations || 0)), color: COLORS.neutral }
    ].filter(d => d.value > 0);
  }, [stats]);

  // Derived Telemetry Savings Metrics
  const memoryHitsCount = stats?.ai_decisions?.memory_hits || 0;
  
  // 18 mins MTTR bypassed per memory hit (saved from on-call escalation)
  const downtimeBypassedMins = memoryHitsCount * 18;
  const downtimeSavedText = downtimeBypassedMins >= 60 
    ? `${(downtimeBypassedMins / 60).toFixed(1)} hrs`
    : `${downtimeBypassedMins} mins`;

  // Standard LLM escalation costs ~$0.045 per verification cycle, whereas fast path is near zero
  const estimatedSavingsDollars = memoryHitsCount * 0.045;

  const toggleRow = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-surface rounded-3xl max-w-5xl mx-auto mt-8 border border-border-light shadow-antigravity"></div>;
  }

  // Reverse decisions for chronological table list (newest first)
  const tableDecisions = [...decisions].reverse();

  return (
    <div className="max-w-5xl mx-auto py-2 sm:py-4">
      {/* Page Header */}
      <div className="mb-8 border-b border-border-light pb-6">
        <h1 className="text-3xl sm:text-4xl font-serif text-text-primary tracking-wide mb-2 flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary animate-pulse" />
          <span>Audit & Cost Trail</span>
        </h1>
        <p className="text-text-muted font-light text-sm">
          Live telemetry verifying how local institutional memory optimizes incident MTTR and AI inference expenses.
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Cumulative cost */}
        <Card className="flex flex-col p-5 relative overflow-hidden" animateHover={true}>
          <div className="absolute top-0 left-0 w-full h-[3px] bg-red-400/50" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">API Cost Incurred</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-3xl font-serif text-text-primary font-bold tracking-tight mb-1.5">
            ${stats?.ai_decisions?.total_cost?.toFixed(5) || '0.00000'}
          </h2>
          <span className="text-[10px] font-mono text-text-muted uppercase">Cumulative Groq Fees</span>
        </Card>

        {/* Cost saved */}
        <Card className="flex flex-col p-5 relative overflow-hidden" animateHover={true}>
          <div className="absolute top-0 left-0 w-full h-[3px] bg-accent-warm" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Estimated Savings</span>
            <TrendingUp className="w-4 h-4 text-accent-warm animate-bounce" />
          </div>
          <h2 className="text-3xl font-serif text-accent-warm font-bold tracking-tight mb-1.5">
            +${estimatedSavingsDollars.toFixed(3)}
          </h2>
          <span className="text-[10px] font-mono text-text-muted uppercase">Bypassed LLM Calls</span>
        </Card>

        {/* Downtime Bypassed */}
        <Card className="flex flex-col p-5 relative overflow-hidden" animateHover={true}>
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#2EC4B6]" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">MTTR Saved</span>
            <Clock className="w-4 h-4 text-[#2EC4B6]" />
          </div>
          <h2 className="text-3xl font-serif text-text-primary font-bold tracking-tight mb-1.5">
            {downtimeSavedText}
          </h2>
          <span className="text-[10px] font-mono text-text-muted uppercase">On-Call Time Bypassed</span>
        </Card>

        {/* Hit Rate */}
        <Card className="flex flex-col p-5 relative overflow-hidden" animateHover={true}>
          <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Memory Hit Rate</span>
            <Cpu className="w-4 h-4 text-secondary" />
          </div>
          <h2 className="text-3xl font-serif text-text-primary font-bold tracking-tight mb-1.5">
            {stats?.ai_decisions?.memory_hit_rate || '0.0'}%
          </h2>
          <span className="text-[10px] font-mono text-text-muted uppercase">Fast Path Resolution</span>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Trend Area Chart */}
        <Card className="lg:col-span-2 flex flex-col p-6" animateHover={false}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h3 className="font-serif text-2xl text-text-primary tracking-wide">
              {chartMetric === 'cost' ? 'Inference Cost Trend' : 'Resolution Latency Trend'}
            </h3>
            {/* Chart Tab Toggles */}
            <div className="flex bg-background border border-border-light p-1.5 rounded-xl font-mono text-[10px] font-bold">
              <button 
                onClick={() => setChartMetric('cost')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${chartMetric === 'cost' ? 'bg-accent-warm/15 text-accent-warm border border-accent-warm/25 shadow-sm' : 'text-text-muted border border-transparent'}`}
              >
                COST ($)
              </button>
              <button 
                onClick={() => setChartMetric('latency')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${chartMetric === 'latency' ? 'bg-accent-warm/15 text-accent-warm border border-accent-warm/25 shadow-sm' : 'text-text-muted border border-transparent'}`}
              >
                LATENCY (MS)
              </button>
            </div>
          </div>
          
          <div className="flex-1 min-h-[280px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartMetric === 'cost' ? COLORS.memory : COLORS.neutral} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={chartMetric === 'cost' ? COLORS.memory : COLORS.neutral} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickMargin={12} />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => chartMetric === 'cost' ? `$${val.toFixed(4)}` : `${val.toFixed(0)}ms`} 
                    tickMargin={12} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-light)', color: 'var(--text-primary)', fontFamily: 'monospace', borderRadius: '16px', boxShadow: 'var(--shadow-val-antigravity)' }}
                    itemStyle={{ color: chartMetric === 'cost' ? COLORS.memory : COLORS.neutral, fontWeight: 'bold' }}
                    formatter={(value) => chartMetric === 'cost' ? [`$${value.toFixed(5)}`, 'Cost'] : [`${value.toFixed(0)} ms`, 'Latency']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={chartMetric === 'cost' ? 'cost' : 'latency'} 
                    stroke={chartMetric === 'cost' ? COLORS.memory : COLORS.neutral} 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorCost)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text-muted font-medium">No telemetry data recorded yet.</div>
            )}
          </div>
        </Card>

        {/* Resolution Path Pie Chart */}
        <Card className="flex flex-col p-6 animateHover" animateHover={true}>
          <h3 className="font-serif text-2xl text-text-primary tracking-wide mb-4">Routing Share</h3>
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-light)', fontFamily: 'monospace', borderRadius: '16px', boxShadow: 'var(--shadow-val-antigravity)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-text-muted font-medium">No share metrics</div>
            )}
          </div>
          <div className="space-y-3 mt-6 bg-background/50 p-4 rounded-2xl border border-border-light">
            {pieData.map(d => (
              <div key={d.name} className="flex justify-between items-center text-sm font-mono font-medium">
                <span className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: d.color }}></div> 
                  {d.name}
                </span>
                <span className="text-text-primary font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Interactive Expandable Table */}
      <Card className="overflow-hidden p-0 shadow-antigravity" animateHover={false}>
        <div className="p-6 border-b border-border-light bg-background/20 flex justify-between items-center">
          <div>
            <h3 className="font-serif text-2xl text-text-primary tracking-wide">Decision Audit Trail</h3>
            <p className="text-xs text-text-muted mt-1 font-mono uppercase">Telemetry logs mapped per incident cycle</p>
          </div>
          <Server className="w-5 h-5 text-text-muted" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border-light text-xs uppercase tracking-widest text-text-muted font-mono font-bold">
                <th className="p-5 font-bold">Timestamp</th>
                <th className="p-5 font-bold">Incident ID</th>
                <th className="p-5 font-bold">Model Used</th>
                <th className="p-5 font-bold">Tier</th>
                <th className="p-5 font-bold">Cost</th>
                <th className="p-5 font-bold">Latency</th>
                <th className="p-5 w-12"></th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono font-medium">
              {tableDecisions.map((log) => {
                const isExpanded = expandedId === log.id;
                return (
                  <>
                    {/* Main Row */}
                    <tr 
                      key={log.id} 
                      onClick={() => toggleRow(log.id)}
                      className={`border-b border-border-light/50 hover:bg-background/30 transition-colors group cursor-pointer ${isExpanded ? 'bg-background/40' : ''}`}
                    >
                      <td className="p-5 text-text-muted group-hover:text-text-primary transition-colors">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-5 text-text-primary font-bold">
                        INC-{log.incident_id?.toString().padStart(4, '0') || '----'}
                      </td>
                      <td className="p-5 text-text-muted text-xs truncate max-w-[150px]">{log.model_used}</td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border ${log.model_tier === 'fast-path' ? 'bg-accent-warm/10 text-accent-warm border-accent-warm/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                          {log.model_tier}
                        </span>
                      </td>
                      <td className="p-5 text-text-primary">${log.cost.toFixed(5)}</td>
                      <td className="p-5 text-text-primary">{log.latency_ms.toFixed(0)}ms</td>
                      <td className="p-5 text-center text-text-muted group-hover:text-text-primary">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </td>
                    </tr>
                    
                    {/* Expanded Drawer Row */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <tr key={`${log.id}-expanded`} className="bg-background/10">
                          <td colSpan={7} className="p-0">
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="p-6 border-b border-border-light/40 space-y-6 bg-surface/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  
                                  {/* Left Panel: Diagnostic suggestions */}
                                  <div className="space-y-4">
                                    <div>
                                      <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block mb-2 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-accent-warm" />
                                        <span>AI Suggested Fix</span>
                                      </span>
                                      <div className="text-sm font-sans text-text-primary bg-background border border-border-light/60 p-4 rounded-xl leading-relaxed max-h-48 overflow-y-auto font-light shadow-inner whitespace-pre-line">
                                        {log.resolution_suggested || 'No suggestion recorded.'}
                                      </div>
                                    </div>
                                    
                                    {log.escalated && (
                                      <div className="bg-primary/5 border border-primary/15 p-4 rounded-xl">
                                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold block mb-1.5 flex items-center gap-1">
                                          <ShieldAlert className="w-3.5 h-3.5 text-primary" />
                                          <span>Escalation Telemetry</span>
                                        </span>
                                        <p className="text-xs font-mono text-text-primary leading-relaxed font-semibold">
                                          {log.escalation_reason || 'Novel trace pattern. Fast path bypassed for reasoning LLM verifier.'}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Right Panel: Hindsight memory hits & executions */}
                                  <div className="space-y-4 font-mono text-xs">
                                    <div>
                                      <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block mb-2">Memory Match Analytics</span>
                                      <div className="bg-background border border-border-light p-4 rounded-xl space-y-3 shadow-inner">
                                        <div className="flex justify-between items-center">
                                          <span className="text-text-muted">Memory Consulted:</span>
                                          <span className={log.memory_consulted ? 'text-accent-warm font-bold' : 'text-text-muted'}>
                                            {log.memory_consulted ? 'YES' : 'NO'}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-text-muted">Memory Hit (Cache):</span>
                                          <span className={log.memory_hit ? 'text-accent-warm font-bold' : 'text-text-muted'}>
                                            {log.memory_hit ? 'HIT (98% latency bypass)' : 'MISS'}
                                          </span>
                                        </div>
                                        {log.memory_hit && (
                                          <>
                                            <div className="flex justify-between items-center">
                                              <span className="text-text-muted">Vector Confidence:</span>
                                              <span className="text-accent-warm font-bold">{(log.memory_match_score * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="border-t border-border-light/40 pt-2.5 mt-2">
                                              <span className="text-text-muted block mb-1.5 uppercase text-[9px] tracking-wider">Matched Past Incident Trace:</span>
                                              <div className="text-[10px] text-text-primary bg-surface/80 border border-border-light/60 p-2.5 rounded-lg max-h-24 overflow-y-auto leading-relaxed scrollbar-thin">
                                                {log.memory_match_content}
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block mb-2">Internal Route Properties</span>
                                      <div className="bg-background border border-border-light p-4 rounded-xl space-y-2 shadow-inner">
                                        <div className="flex justify-between">
                                          <span className="text-text-muted">Routing Tier:</span>
                                          <span className="text-text-primary font-bold uppercase">{log.model_tier}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-text-muted">Targeted Severity:</span>
                                          <span className={`font-bold ${log.severity === 'CRITICAL' || log.severity === 'HIGH' ? 'text-primary' : 'text-accent-warm'}`}>
                                            {log.severity || 'N/A'}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-text-muted">Confidence Index:</span>
                                          <span className="text-text-primary font-bold">{log.confidence_score ? `${(log.confidence_score * 100).toFixed(0)}%` : 'N/A'}</span>
                                        </div>
                                      </div>
                                    </div>

                                  </div>

                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </>
                );
              })}
              {tableDecisions.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-text-muted font-sans text-lg">No audit records logged.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
