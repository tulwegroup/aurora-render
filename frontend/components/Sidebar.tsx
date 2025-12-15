import React from 'react';
import { 
  Home, 
  Map, 
  BarChart3, 
  Layers, 
  Activity, 
  Zap, 
  TrendingUp, 
  Shield, 
  Box, 
  Database, 
  Settings,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  activeTab: AppView;
  setActiveTab: (tab: AppView) => void;
  customLogo: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, customLogo }) => {
  const menuItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: Home },
    { id: 'map' as AppView, label: 'Planetary Map', icon: Map },
    { id: 'portfolio' as AppView, label: 'Portfolio', icon: BarChart3 },
    { 
      id: 'osil' as AppView, 
      label: 'OSIL', 
      icon: Layers,
      description: 'Optical Spectral Inversion Layer'
    },
    { 
      id: 'seismic' as AppView, 
      label: 'Seismic', 
      icon: Activity,
      description: 'Seismic Analysis'
    },
    { 
      id: 'ushe' as AppView, 
      label: 'USHE', 
      icon: Zap,
      description: 'Universal Spectral Hyperspectral Engine'
    },
    { 
      id: 'pcfc' as AppView, 
      label: 'PCFC', 
      icon: TrendingUp,
      description: 'Physics-Constrained Forward Modeling'
    },
    { 
      id: 'tmal' as AppView, 
      label: 'TMAL', 
      icon: Activity,
      description: 'Temporal Motion Analysis Layer'
    },
    { 
      id: 'qse' as AppView, 
      label: 'QSE', 
      icon: Shield,
      description: 'Quantum Simulation Engine'
    },
    { 
      id: 'twin' as AppView, 
      label: 'Digital Twin', 
      icon: Box,
      description: '3D Digital Twin Visualization'
    },
    { 
      id: 'ietl' as AppView, 
      label: 'IETL', 
      icon: Activity,
      description: 'Integrated Exploration Targeting Layer'
    },
    { id: 'data' as AppView, label: 'Data Lake', icon: Database },
    { id: 'config' as AppView, label: 'Config', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-200 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          {customLogo ? (
            <img src={customLogo} alt="Logo" className="w-8 h-8" />
          ) : (
            <div className="w-8 h-8 bg-aurora-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-white">Aurora OSI</h1>
            <p className="text-xs text-slate-400">v3.2.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-aurora-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={18} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs opacity-70 mt-1">{item.description}</div>
                  )}
                </div>
                {isActive && <ChevronRight size={16} />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 text-center">
          Aurora OSI v3 - Render Deployment
        </div>
      </div>
    </div>
  );
};

export default Sidebar;