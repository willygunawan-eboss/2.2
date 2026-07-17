import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './pages/DashboardView';
import { HRView } from './pages/HRView';
import { FinanceView } from './pages/FinanceView';
import { SalesView } from './pages/SalesView';
import { InventoryView } from './pages/InventoryView';
import { ProjectsView } from './pages/ProjectsView';
import { SettingsView } from './pages/SettingsView';
import { OrgWorkspaceView } from './pages/OrgWorkspaceView';
import { EmpWorkspaceView } from './pages/EmpWorkspaceView';
import { CRMView } from './pages/CRMView';
import { PurchaseView } from './pages/PurchaseView';
import { AssetView } from './pages/AssetView';
import { FieldServiceView } from './pages/FieldServiceView';
import { HelpdeskView } from './pages/HelpdeskView';
import { InvoicingView } from './pages/InvoicingView';
import { BIView } from './pages/BIView';
import { DMSView } from './pages/DMSView';
import { KBView } from './pages/KBView';
import { LoginView } from './pages/LoginView';
import { SetupCenterView } from './pages/SetupCenterView';
import { SystemReadinessView } from './pages/SystemReadinessView';
import { BootstrapWizard } from './pages/BootstrapWizard';
import { RBACProvider, useRBAC } from './contexts/RBACContext';
import { ModuleId } from './types';

function MainApp() {
  const [appState, setAppState] = useState<'checking_bootstrap' | 'bootstrap_required' | 'checking_auth' | 'unauthenticated' | 'authenticated' | 'error'>('checking_bootstrap');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userRole, setUserRole] = useState<string>("");
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { loading: rbacLoading, hasMenu, refresh: refreshRBAC } = useRBAC();

  useEffect(() => {
    const checkBootstrap = async () => {
      try {
        console.log('[BOOT] Checking bootstrap...');
        const res = await fetch('/api/bootstrap/status');
        if (!res.ok) throw new Error('Bootstrap API error');
        const data = await res.json();
        
        if (data.status === 'bootstrapRequired') {
          console.log('[BOOT] Bootstrap required');
          setAppState('bootstrap_required');
        } else if (data.status === 'bootstrapCompleted') {
          console.log('[BOOT] Bootstrap completed');
          checkAuth();
        } else {
          throw new Error('Invalid bootstrap status');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to connect to server');
        setAppState('error');
      }
    };
    checkBootstrap();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('[AUTH] Loading session...');
      setAppState('checking_auth');
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          console.log('[AUTH] Session loaded');
          console.log('[RBAC] Loading permissions...');
          setUserRole(data.user?.role || "");
          setAppState('authenticated');
        } else {
          setAppState('unauthenticated');
        }
      } else {
        setAppState('unauthenticated');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Auth check failed');
      setAppState('error');
    }
  };

  useEffect(() => {
    if (appState === 'authenticated' && !rbacLoading) {
      console.log('[RBAC] Permissions loaded');
      console.log('[APP] Dashboard Ready');
    }
  }, [appState, rbacLoading]);

  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveModule(customEvent.detail);
      }
    };
    window.addEventListener('navigate', handleNavigation);
    return () => window.removeEventListener('navigate', handleNavigation);
  }, []);

  const handleLogin = () => {
    setAppState('authenticated');
    refreshRBAC();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setAppState('unauthenticated');
  };

  const handleLogoClick = () => {
    setActiveModule('dashboard');
    setRefreshKey(prev => prev + 1);
  };

  const renderContent = () => {
    if (!hasMenu(activeModule)) {
       return (
         <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] text-slate-500 p-8">
           <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
           <p className="text-slate-500 max-w-md text-center">
             You do not have permission to access the {activeModule} module.
           </p>
         </div>
       );
    }
    switch (activeModule) {
      case 'dashboard': return <DashboardView onNavigate={setActiveModule} />;
      case 'setup_center': return <SetupCenterView onNavigate={setActiveModule} />;
      case 'system_health': return <SystemReadinessView />;
      case 'finance': return <FinanceView />;
      case 'sales': return <SalesView />;
      case 'inventory': return <InventoryView />;
      case 'hr': return <HRView />;
      case 'org_workspace': return <OrgWorkspaceView />;
      case 'emp_workspace': return <EmpWorkspaceView />;

      case 'project': return <ProjectsView />;
      case 'settings': return <SettingsView />;
      case 'crm': return <CRMView />;
      case 'purchase': return <PurchaseView />;
      case 'asset': return <AssetView />;
      case 'field_service': return <FieldServiceView />;
      case 'helpdesk': return <HelpdeskView />;
      case 'invoicing': return <InvoicingView />;
      case 'bi': return <BIView />;
      case 'dms': return <DMSView />;
      case 'kb': return <KBView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] text-slate-500 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Module Under Development</h2>
            <p className="text-slate-500 max-w-md text-center">
              The <span className="font-semibold text-blue-600 capitalize">{activeModule}</span> module is currently being built.
            </p>
          </div>
        );
    }
  };

  if (appState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-rose-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">System Startup Error</h2>
          <p className="text-slate-600 mb-6">{errorMessage}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'checking_bootstrap' || appState === 'checking_auth' || (appState === 'authenticated' && rbacLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-500">
          {appState === 'checking_bootstrap' ? 'Checking system readiness...' : 
           appState === 'checking_auth' ? 'Verifying session...' : 
           'Loading permissions...'}
        </p>
      </div>
    );
  }

  if (appState === 'bootstrap_required') {
    return <BootstrapWizard onComplete={() => setAppState('unauthenticated')} />;
  }

  if (appState === 'unauthenticated') {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar activeModule={activeModule} onNavigate={(id) => { setActiveModule(id); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 md:pl-64 flex flex-col h-screen overflow-hidden transition-all duration-300 w-full relative">
        <Header onMenuClick={() => setIsSidebarOpen(true)} onLogout={handleLogout} onLogoClick={handleLogoClick} />
        <main key={refreshKey} className="flex-1 overflow-y-auto custom-scrollbar relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GlobalErrorBoundary>
    <RBACProvider>
      <MainApp />
    </RBACProvider>
    </GlobalErrorBoundary>
  );
}
