import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ children, systemState }) {
  return (
    <div className="flex h-screen bg-halcyon-bg overflow-hidden text-halcyon-text font-body">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar systemState={systemState} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
