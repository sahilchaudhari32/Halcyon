import { Link, useRoute } from "wouter";

export default function Sidebar() {
  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Memory', path: '/memory' },
    { label: 'Audit Log', path: '/audit' }
  ];

  return (
    <aside className="w-64 bg-halcyon-surface border-r border-halcyon-border h-full flex flex-col shadow-sm relative z-20">
      <div className="p-6 border-b border-halcyon-border/50">
        <h1 className="font-display text-2xl font-bold tracking-tight text-halcyon-text">HALCYON</h1>
        <p className="font-mono text-xs text-halcyon-text-muted mt-1 uppercase tracking-wider font-semibold">System Status</p>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map(item => {
          const [isActive] = useRoute(item.path);
          return (
            <Link key={item.label} href={item.path}>
              <a
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-halcyon-surface-raised text-halcyon-text font-semibold shadow-sm' 
                    : 'text-halcyon-text-muted font-medium hover:text-halcyon-text hover:bg-halcyon-surface-raised/50 hover:translate-x-1'
                }`}
              >
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-halcyon-border/50 text-xs font-mono text-halcyon-text-muted font-medium text-center">
        v1.0.0 — Stable
      </div>
    </aside>
  );
}
