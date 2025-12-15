import { ExplorationCampaign, IntelReport, TaskingRequest } from './types';

export const ACTIVE_CAMPAIGN: ExplorationCampaign = {
  id: 'campaign-001',
  name: 'Atacama Lithium Survey',
  status: 'active',
  region: {
    name: 'Atacama Desert, Chile',
    bounds: [-24.0, -69.0, -23.0, -68.0],
    center: [-23.5, -68.5]
  },
  targets: ['Salar de Atacama', 'Salar de Maricunga'],
  resources: ['Lithium', 'Potassium', 'Boron'],
  startDate: '2024-01-15',
  budget: 2500000,
  spent: 1250000,
  team: ['Dr. Sarah Chen', 'Dr. Miguel Rodriguez', 'Dr. Yuki Tanaka'],
  description: 'Comprehensive lithium brine survey in the Atacama Desert region',
  phase: 'Targeting',
  progress: 65
};

export const INTEL_REPORTS: IntelReport[] = [
  {
    id: 'intel-001',
    title: 'Satellite Imagery Analysis - Salar de Atacama',
    date: '2024-01-20',
    type: 'Imagery',
    priority: 'high',
    content: 'Analysis of recent satellite imagery shows promising surface indicators in the northeastern sector of the salar.',
    source: 'Sentinel-2',
    confidence: 0.85,
    tags: ['satellite', 'surface', 'indicators']
  },
  {
    id: 'intel-002',
    title: 'Geophysical Survey Results',
    date: '2024-01-18',
    type: 'Geophysics',
    priority: 'medium',
    content: 'Magnetotelluric survey indicates conductive zones at depths of 200-400m, consistent with brine layers.',
    source: 'Field Team',
    confidence: 0.78,
    tags: ['geophysics', 'brine', 'depth']
  }
];

export const TASKING_REQUESTS: TaskingRequest[] = [
  {
    id: 'task-001',
    title: 'High-resolution SAR acquisition',
    type: 'Satellite',
    status: 'approved',
    priority: 'high',
    requestedBy: 'Dr. Sarah Chen',
    date: '2024-01-22',
    description: 'Request high-resolution SAR data for deformation monitoring',
    parameters: {
      resolution: '1m',
      polarization: 'HH+HV',
      incidence: '23°'
    }
  },
  {
    id: 'task-002',
    title: 'Ground truth verification',
    type: 'Field',
    status: 'pending',
    priority: 'medium',
    requestedBy: 'Dr. Miguel Rodriguez',
    date: '2024-01-21',
    description: 'Field verification of geophysical anomalies',
    parameters: {
      duration: '5 days',
      teamSize: 4,
      equipment: ['EM31', 'Gravity meter']
    }
  }
];

export const GLOBAL_MINERAL_PROVINCES = [
  {
    name: 'Atacama Desert',
    type: ['Lithium', 'Potassium', 'Boron'],
    bounds: [-24.0, -69.0, -23.0, -68.0]
  },
  {
    name: 'Greenbushes',
    type: ['Lithium', 'Tantalum'],
    bounds: [-33.0, 116.0, -32.5, 116.5]
  },
  {
    name: 'Salar de Uyuni',
    type: ['Lithium', 'Potassium', 'Magnesium'],
    bounds: [-20.5, -67.5, -19.5, -66.5]
  }
];