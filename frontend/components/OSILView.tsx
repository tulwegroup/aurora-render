import React from 'react';
import { ExplorationCampaign } from '../types';

interface ViewComponentProps {
  campaign: ExplorationCampaign;
  onLaunchCampaign: (campaign: ExplorationCampaign) => void;
  onUpdateCampaign: (campaign: ExplorationCampaign) => void;
  onNavigate: (view: any) => void;
  hiveMindState: any;
  setHiveMindState: (state: any) => void;
  customLogo: string | null;
  setCustomLogo: (logo: string | null) => void;
}

const OSILView: React.FC<ViewComponentProps> = ({ campaign, onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">OSIL - Optical Spectral Inversion Layer</h1>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <p className="text-slate-400">OSIL component under development...</p>
      </div>
    </div>
  );
};

export default OSILView;