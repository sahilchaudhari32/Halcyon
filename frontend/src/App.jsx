import { useState, useEffect } from 'react';
import { Route, Switch } from "wouter";
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import GithubOnboarding from './components/GithubOnboarding';
import AppShell from './components/layout/AppShell';
import Dashboard from './components/Dashboard';
import IncidentDetail from './components/IncidentDetail';
import MemoryView from './components/MemoryView';
import AuditView from './components/AuditView';
import BillingView from './components/BillingView';
import SettingsView from './components/SettingsView';
import { api } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('auth-token'));
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [globalState, setGlobalState] = useState('calm');

  useEffect(() => {
    if (isAuthenticated) {
      setCheckingConnection(true);
      api.getGithubStatus()
        .then(data => {
          setIsGithubConnected(data.connected);
        })
        .catch(err => {
          console.error("Failed to verify GitHub connection:", err);
          setIsGithubConnected(false);
        })
        .finally(() => {
          setCheckingConnection(false);
        });
    } else {
      setCheckingConnection(false);
    }
  }, [isAuthenticated]);

  if (checkingConnection) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono text-xs text-text-muted">
        <div className="animate-spin w-8 h-8 border-2 border-[#2EC4B6] border-t-transparent rounded-full mb-4"></div>
        <span>Syncing Halcyon Telemetry Engine...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showAuthForm) {
      return (
        <div className="relative">
          <button 
            onClick={() => setShowAuthForm(false)} 
            className="absolute top-6 left-6 z-20 font-mono text-[10px] uppercase font-bold tracking-wider px-3.5 py-2 rounded-xl bg-surface border border-border-light text-text-muted hover:text-text-primary transition-all cursor-pointer shadow-sm"
          >
            &larr; Back
          </button>
          <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />
        </div>
      );
    }
    return <LandingPage onEnterApp={() => setShowAuthForm(true)} />;
  }

  if (!isGithubConnected) {
    return (
      <GithubOnboarding 
        onConnectionSuccess={() => setIsGithubConnected(true)} 
      />
    );
  }

  return (
    <AppShell systemState={globalState}>
      <Switch>
        <Route path="/">
          <Dashboard setGlobalState={setGlobalState} />
        </Route>
        <Route path="/incident/:id">
          {(params) => <IncidentDetail id={params.id} />}
        </Route>
        <Route path="/memory">
          <MemoryView />
        </Route>
        <Route path="/audit">
          <AuditView />
        </Route>
        <Route path="/billing">
          <BillingView />
        </Route>
        <Route path="/settings">
          <SettingsView />
        </Route>
        <Route>
          <div className="text-center py-20 text-halcyon-text-muted">404 - Not Found</div>
        </Route>
      </Switch>
    </AppShell>
  );
}

export default App;
