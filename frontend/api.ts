import { ExplorationCampaign, IntelReport, TaskingRequest, SystemStatus, DataObject, ConnectivityResult, PortfolioSummary, TargetResult, Voxel, LatentPoint, DrillTarget, SeismicSlice, SeismicJob, SeismicAxis, SeismicTrap, DiscoveryRecord, MineralAgentType } from './types';
import { ACTIVE_CAMPAIGN, INTEL_REPORTS, TASKING_REQUESTS, GLOBAL_MINERAL_PROVINCES } from './constants';
import { APP_CONFIG } from './config';

// Mock DB for sovereign mode
const SovereignDB = {
    init: async () => {},
    saveDiscovery: async (discovery: DiscoveryRecord) => {},
    getAllDiscoveries: async (): Promise<DiscoveryRecord[]> => { return []; }
};

const PhysicsEngine = {
    getGeologicContext: (lat: number, lon: number) => {
        for (const province of GLOBAL_MINERAL_PROVINCES) {
            const [minLat, minLon, maxLat, maxLon] = province.bounds;
            if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
                return { name: province.name, type: province.type.join(', ') };
            }
        }
        return { name: 'Undefined Basin', type: 'Unknown' };
    }
};

const STORAGE_KEYS = {
  ACTIVE_ID: 'aurora_active_campaign_id',
  REGISTRY: 'aurora_campaign_registry',
  REPORTS: 'aurora_intel_reports',
  TASKS: 'aurora_tasking_requests',
  CONFIG: 'aurora_system_config',
  GEE_STATUS: 'aurora_gee_active_persistent'
};

export interface JobPayload {
  region: { type: 'point'; coordinates: [number, number]; radius: number; };
  resource_types: string[];
  resolution: 'low' | 'medium' | 'high';
  mode: 'smart' | 'premium';
}

export interface JobStatus {
  job_id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  current_task: string;
}

class GeoRNG {
    seed: number;
    constructor(lat: number, lon: number, salt: string = '') {
        const str = `${lat.toFixed(4)}${lon.toFixed(4)}${salt}`;
        let h = 0x811c9dc5;
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 0x01000193);
        }
        this.seed = h >>> 0;
    }
    next() {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }
    range(min: number, max: number) {
        return min + (this.next() * (max - min));
    }
}

export class AuroraAPI {
  private static mode: 'Sovereign' | 'Cloud' = 'Sovereign';
  private static apiUrl = APP_CONFIG.API.CLOUD;
  private static fallbackMode = true;
  
  static async init(): Promise<boolean> {
    await SovereignDB.init();
    
    // Check if API URL is set by Vite env
    if (!this.apiUrl) {
        console.warn("AuroraAPI: No Backend URL Configured (VITE_API_URL missing). Falling back to Sovereign mode.");
        this.fallbackMode = true;
        this.mode = 'Sovereign';
        return false;
    }
    
    console.log(`AuroraAPI: Connecting to ${this.apiUrl}`);

    try {
        const res = await fetch(`${this.apiUrl}/system/health`);
        if (res.ok) {
            this.fallbackMode = false;
            this.mode = 'Cloud';
            return true;
        }
    } catch(e) {
        console.warn("Backend connection failed", e);
    }
    
    this.fallbackMode = true;
    this.mode = 'Sovereign';
    return false;
  }

  static getActiveEndpoint() { return this.apiUrl; }
  static isCloudConnected() { return !this.fallbackMode; }
  static isGeePersistent() { return localStorage.getItem(STORAGE_KEYS.GEE_STATUS) === 'true'; }
  static setGeePersistence(active: boolean) { localStorage.setItem(STORAGE_KEYS.GEE_STATUS, String(active)); }

  static async checkConnectivity(): Promise<ConnectivityResult> {
      if (this.fallbackMode) return { status: SystemStatus.OFFLINE, mode: 'Sovereign', message: 'No connection' };
      return { status: SystemStatus.ONLINE, mode: 'Cloud' };
  }

  static async getActiveCampaign(): Promise<ExplorationCampaign> {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
      if (stored) {
          const registry = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRY) || '[]');
          const campaign = registry.find((c: any) => c.id === stored);
          if (campaign) return campaign;
      }
      return ACTIVE_CAMPAIGN;
  }

  static async getAllCampaigns(): Promise<ExplorationCampaign[]> {
      const registry = localStorage.getItem(STORAGE_KEYS.REGISTRY);
      return registry ? JSON.parse(registry) : [ACTIVE_CAMPAIGN];
  }

  static async updateCampaign(campaign: ExplorationCampaign): Promise<void> {
      let registry = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRY) || '[]');
      const idx = registry.findIndex((c: any) => c.id === campaign.id);
      if (idx >= 0) registry[idx] = campaign;
      else registry.push(campaign);
      localStorage.setItem(STORAGE_KEYS.REGISTRY, JSON.stringify(registry));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, campaign.id);
  }

  static async importCampaign(file: File): Promise<boolean> {
      try {
          const text = await file.text();
          const json = JSON.parse(text);
          await this.updateCampaign(json);
          return true;
      } catch (e) { return false; }
  }

  private static async apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (this.fallbackMode || !this.apiUrl) {
        // Fallback Mocks
        if (endpoint.includes('schedule')) return { schedule: [] };
        if (endpoint.includes('voxels')) return { voxels: [] };
        if (endpoint.includes('status')) return { gee_initialized: this.isGeePersistent() };
        return {};
    }
    try {
        const url = `${this.apiUrl}${endpoint}`;
        const res = await fetch(url, options);
        if (res.ok) return await res.json();
    } catch (e) { console.warn("Fetch error", e); }
    return {};
  }

  // Proxied methods
  static async getSystemStatus() { return this.apiFetch('/system/status'); }
  static async getSatelliteSchedule(lat: number, lon: number) { return this.apiFetch(`/gee/schedule?lat=${lat}&lon=${lon}`); }
  static async getDigitalTwinVoxels(lat: number, lon: number) { return this.apiFetch(`/twin/voxels?lat=${lat}&lon=${lon}`); }
  static async getTemporalAnalysis(lat: number, lon: number) { return this.apiFetch(`/tmal/analysis?lat=${lat}&lon=${lon}`); }
  
  static async submitScanJob(payload: JobPayload) { return { job_id: "mock-job" }; }
  static async getJobStatus(jobId: string) { return { job_id: jobId, status: "COMPLETED", progress: 100, current_task: "Done" }; }
  static async getJobResults(jobId: string) { return { results: [], drillTargets: [] }; }

  static async uploadServiceAccount(f: File) { return { status: 'success' }; }
  static async uploadServiceAccountText(t: string) { return { status: 'success' }; }

  // Local utility methods
  static getGeologicContext(lat: number, lon: number) { return PhysicsEngine.getGeologicContext(lat, lon); }
  static async geocode(query: string) { return null; }
  static generateLatentPoints(type: string, lat: number, lon: number, radiusKm: number = 10) {
      // Basic generation
      const rng = new GeoRNG(lat, lon, type);
      const points: LatentPoint[] = [];
      for(let i=0; i<50; i++) {
          points.push({
              id: `pt-${i}`,
              x: rng.next()*100, y: rng.next()*100, z: rng.next()*100,
              cluster: rng.next() > 0.7 ? 'Mineral' : 'Void',
              realLat: lat + (rng.next()-0.5), realLon: lon + (rng.next()-0.5),
              realDepth: 1000, grade: 5, volume: 50
          });
      }
      return points;
  }
  static async runAgentScan(type: MineralAgentType, lat: number, lon: number, regionName?: string) { return null; }
  static async generateAndSaveReport(campaign: ExplorationCampaign) { return INTEL_REPORTS[0]; }
  static async getReports() { return INTEL_REPORTS; }
  static async getTasks() { return TASKING_REQUESTS; }
  static async submitTask(t: TaskingRequest) {}
  static async getGlobalDiscoveries() { return []; }
  static async getPortfolioOverview() { return null; }
  static async getDataLakeFiles() { return []; }
  static async getDataLakeStats() { return null; }
  static async processFile(id: string, op: string) { return {} as DataObject; }
  static generateFileContent(n: string, t: any) { return ""; }
  static async startSeismicJob(id: string) { return { id: `JOB-1`, status: 'Ingesting', progress: 0, currentTask: 'Init', logs: [], artifacts: {} } as SeismicJob; }
  static async getStructuralTraps(lat: number, lon: number) { return []; }
  static async getSeismicSlice(lat: number, lon: number, index: number, axis: SeismicAxis) { 
      return { width: 10, height: 10, data: [], uncertainty: [], horizons: [], faults: [], axis, index }; 
  }
  static async getPhysicsTomography(lat: number, lon: number) { return {}; }
  static async runPhysicsInversion(lat: number, lon: number, depth: number) { return {}; }
  static async runQuantumOptimization(region: string, qubits: number, algo: string) { return {}; }
  static async seedDemoData() { return { status: 'success' }; }
}