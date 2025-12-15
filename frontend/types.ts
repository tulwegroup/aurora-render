export interface ExplorationCampaign {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  region: {
    name: string;
    bounds: [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]
    center: [number, number]; // [lat, lon]
  };
  targets: string[];
  resources: string[];
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  team: string[];
  description: string;
  phase: string;
  progress: number;
}

export interface IntelReport {
  id: string;
  title: string;
  date: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  content: string;
  source: string;
  confidence: number;
  tags: string[];
}

export interface TaskingRequest {
  id: string;
  title: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  date: string;
  description: string;
  parameters: Record<string, any>;
}

export enum SystemStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DEGRADED = 'DEGRADED',
  MAINTENANCE = 'MAINTENANCE'
}

export interface DataObject {
  id: string;
  name: string;
  type: string;
  size: number;
  created: string;
  modified: string;
  status: string;
  metadata: Record<string, any>;
}

export interface ConnectivityResult {
  status: SystemStatus;
  mode: 'Sovereign' | 'Cloud';
  message?: string;
}

export interface PortfolioSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalBudget: number;
  totalSpent: number;
  roi: number;
  topResources: Array<{ name: string; value: number }>;
}

export interface TargetResult {
  id: string;
  name: string;
  type: string;
  location: [number, number];
  confidence: number;
  value: number;
  status: string;
  description: string;
}

export interface Voxel {
  id: string;
  x: number;
  y: number;
  z: number;
  lithology: string;
  density: number;
  mineralProb: number;
  uncertainty: number;
}

export interface LatentPoint {
  id: string;
  x: number;
  y: number;
  z: number;
  cluster: string;
  realLat: number;
  realLon: number;
  realDepth: number;
  grade: number;
  volume: number;
}

export interface DrillTarget {
  id: string;
  lat: number;
  lon: number;
  depth: number;
  priority: string;
  description: string;
}

export interface SeismicSlice {
  width: number;
  height: number;
  data: number[][];
  uncertainty: number[][];
  horizons: Array<{ depth: number[]; label: string; confidence: number }>;
  faults: any[];
  axis: string;
  index: number;
}

export interface SeismicJob {
  id: string;
  status: string;
  progress: number;
  currentTask: string;
  logs: string[];
  artifacts: Record<string, any>;
}

export type SeismicAxis = 'x' | 'y' | 'z';

export interface SeismicTrap {
  id: string;
  type: string;
  location: [number, number];
  depth: number;
  area: number;
  confidence: number;
}

export interface DiscoveryRecord {
  id: string;
  campaignId: string;
  date: string;
  location: [number, number];
  resource: string;
  quantity: number;
  value: number;
  confidence: number;
}

export type MineralAgentType = 'Au' | 'Ag' | 'Cu' | 'Li' | 'REE' | 'Ni' | 'Co' | 'Zn' | 'Pb';

export type AppView = 'dashboard' | 'map' | 'portfolio' | 'osil' | 'seismic' | 'ushe' | 'pcfc' | 'tmal' | 'qse' | 'twin' | 'ietl' | 'data' | 'config';

export interface HiveMindState {
  isScanning: boolean;
  scanGrid: any[];
  activeAgents: MineralAgentType[];
  logs: string[];
  progress: number;
  hits: number;
  misses: number;
}

export const CAMPAIGN_PHASES = [
  'Planning',
  'Reconnaissance',
  'Targeting',
  'Drilling',
  'Evaluation',
  'Development'
] as const;