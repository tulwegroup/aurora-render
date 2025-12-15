import React, { Component, useState, useEffect, Suspense, lazy, type ErrorInfo, type ReactNode } from 'react';
import Sidebar from './components/Sidebar';
import { Bell, Search, User, ShieldCheck, Server, AlertTriangle, RefreshCw, Loader2, ChevronRight } from 'lucide-react';
import { ExplorationCampaign, CAMPAIGN_PHASES, AppView, HiveMindState, MineralAgentType } from './types';
import { ACTIVE_CAMPAIGN } from './constants';
import { AuroraAPI } from './api';
import { APP_CONFIG } from './config';

// Lazy Load Components
const Dashboard = lazy(() => import('./components/Dashboard'));
const OSILView = lazy(() => import('./components/OSILView'));
const PCFCView = lazy(() => import('./components/PCFCView'));
const USHEView = lazy(() => import('./components/USHEView'));
const QSEView = lazy(() => import('./components/QSEView'));
const IETLView = lazy(() => import('./components/IETLView'));
const TMALView = lazy(() => import('./components/TMALView'));
const ConfigView = lazy(() => import('./components/ConfigView'));
const DataLakeView = lazy(() => import('./components/DataLakeView'));
const DigitalTwinView = lazy(() => import('./components/DigitalTwinView'));
const PortfolioView = lazy(() => import('./components/PortfolioView'));
const SeismicView = lazy(() => import('./components/SeismicView'));
const PlanetaryMapView = lazy(() => import('./components/PlanetaryMapView')); 

interface ErrorBoundaryProps { children?: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): ErrorBoundaryState { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("Failure:", error, errorInfo); }
  handleReload = () => { this.setState({ hasError: false, error: null }); window.location.reload(); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
          <AlertTriangle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">System Error</h2>
          <button onClick={this.handleReload} className="bg-aurora-600 text-white px-4 py-2 rounded">Reboot</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ViewLoader = () => (
  <div className="flex flex-col items-center justify-center h-[600px] text-slate-500">
    <Loader2 size={48} className="text-aurora-500 animate-spin mb-4" />
    <p>INITIALIZING MODULE...</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppView>('dashboard');
  const [campaign, setCampaign] = useState<ExplorationCampaign>(ACTIVE_CAMPAIGN);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [hiveMind, setHiveMind] = useState<HiveMindState>({ isScanning: false, scanGrid: [], activeAgents: ['Au'], logs: [], progress: 0, hits: 0, misses: 0 });

  useEffect(() => {
    const boot = async () => {
       await AuroraAPI.init();
       const active = await AuroraAPI.getActiveCampaign();
       setCampaign(active);
       setIsBooting(false);
    };
    boot();
  }, []);

  const handleLaunch = async (c: ExplorationCampaign) => { setCampaign(c); await AuroraAPI.updateCampaign(c); };
  const handleUpdate = async (c: ExplorationCampaign) => { setCampaign(c); await AuroraAPI.updateCampaign(c); };

  const renderContent = () => {
    let ViewComponent: any;
    switch (activeTab) {
      case 'dashboard': ViewComponent = Dashboard; break;
      case 'map': ViewComponent = PlanetaryMapView; break;
      case 'portfolio': ViewComponent = PortfolioView; break;
      case 'osil': ViewComponent = OSILView; break;
      case 'seismic': ViewComponent = SeismicView; break;
      case 'ushe': ViewComponent = USHEView; break;
      case 'pcfc': ViewComponent = PCFCView; break;
      case 'tmal': ViewComponent = TMALView; break;
      case 'qse': ViewComponent = QSEView; break;
      case 'twin': ViewComponent = DigitalTwinView; break;
      case 'ietl': ViewComponent = IETLView; break;
      case 'data': ViewComponent = DataLakeView; break;
      case 'config': ViewComponent = ConfigView; break;
      default: ViewComponent = Dashboard; break;
    }
    
    return (
      <ErrorBoundary>
        <Suspense fallback={<ViewLoader />}>
          <ViewComponent 
            campaign={campaign} 
            onLaunchCampaign={handleLaunch}
            onUpdateCampaign={handleUpdate}
            onNavigate={setActiveTab}
            hiveMindState={hiveMind}
            setHiveMindState={setHiveMind}
            customLogo={customLogo}
            setCustomLogo={setCustomLogo}
          />
        </Suspense>
      </ErrorBoundary>
    );
  };

  if (isBooting) return <div className="h-screen bg-aurora-950 flex items-center justify-center text-white">Booting Aurora OSI v3...</div>;

  return (
    <div className="flex min-h-screen bg-aurora-950 font-sans text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} customLogo={customLogo} />
      <main className="ml-64 flex-1 flex flex-col">
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;