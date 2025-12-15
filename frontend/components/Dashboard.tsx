import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { ExplorationCampaign, IntelReport, TaskingRequest } from '../types';

interface DashboardProps {
  campaign: ExplorationCampaign;
  onLaunchCampaign: (campaign: ExplorationCampaign) => void;
  onUpdateCampaign: (campaign: ExplorationCampaign) => void;
  onNavigate: (view: any) => void;
  hiveMindState: any;
  setHiveMindState: (state: any) => void;
  customLogo: string | null;
  setCustomLogo: (logo: string | null) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  campaign, 
  onLaunchCampaign, 
  onUpdateCampaign, 
  onNavigate,
  hiveMindState,
  setHiveMindState,
  customLogo,
  setCustomLogo
}) => {
  const [systemStatus, setSystemStatus] = useState({
    gee: false,
    quantum: false,
    satellite: true,
    processing: true
  });

  useEffect(() => {
    // Simulate system status updates
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        gee: Math.random() > 0.3,
        quantum: Math.random() > 0.7
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'Campaign Progress',
      value: `${campaign.progress}%`,
      icon: TrendingUp,
      color: 'text-green-400',
      change: '+12%'
    },
    {
      title: 'Budget Used',
      value: `$${(campaign.spent / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'text-blue-400',
      change: `${((campaign.spent / campaign.budget) * 100).toFixed(0)}%`
    },
    {
      title: 'Active Targets',
      value: campaign.targets.length.toString(),
      icon: Target,
      color: 'text-purple-400',
      change: '+2'
    },
    {
      title: 'Team Members',
      value: campaign.team.length.toString(),
      icon: Users,
      color: 'text-yellow-400',
      change: 'Stable'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      title: 'Satellite Data Delay',
      message: 'Next Sentinel-1 pass delayed by 2 hours',
      time: '2 hours ago'
    },
    {
      type: 'info',
      title: 'Processing Complete',
      message: 'Geophysical analysis for sector 4 finished',
      time: '4 hours ago'
    },
    {
      type: 'success',
      title: 'Target Validated',
      message: 'Drill target DT-01 confirmed high priority',
      time: '6 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mission Control</h1>
          <p className="text-slate-400 mt-1">Aurora OSI v3 - {campaign.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${systemStatus.gee ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-slate-400">GEE</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${systemStatus.quantum ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className="text-sm text-slate-400">Quantum</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${systemStatus.satellite ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-slate-400">Satellite</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
                </div>
                <Icon className={`${stat.color}`} size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Overview */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Campaign Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                campaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                campaign.status === 'planning' ? 'bg-blue-500/20 text-blue-400' :
                campaign.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Phase</span>
              <span className="text-white">{campaign.phase}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Region</span>
              <span className="text-white">{campaign.region.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Resources</span>
              <div className="flex space-x-2">
                {campaign.resources.map((resource, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-sm text-slate-300">
                    {resource}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Progress</span>
                <span className="text-white">{campaign.progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-aurora-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">System Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/50">
                {alert.type === 'warning' && <AlertTriangle className="text-yellow-400" size={16} />}
                {alert.type === 'info' && <Clock className="text-blue-400" size={16} />}
                {alert.type === 'success' && <CheckCircle className="text-green-400" size={16} />}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{alert.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate('map')}
            className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <MapPin className="text-aurora-400" size={20} />
            <span className="text-white">View Map</span>
          </button>
          <button 
            onClick={() => onNavigate('osil')}
            className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Activity className="text-blue-400" size={20} />
            <span className="text-white">OSIL Analysis</span>
          </button>
          <button 
            onClick={() => onNavigate('seismic')}
            className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <TrendingUp className="text-purple-400" size={20} />
            <span className="text-white">Seismic Data</span>
          </button>
          <button 
            onClick={() => onNavigate('data')}
            className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Calendar className="text-green-400" size={20} />
            <span className="text-white">Data Lake</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;