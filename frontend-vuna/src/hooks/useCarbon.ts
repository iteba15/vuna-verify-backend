import { useQuery } from '@tanstack/react-query';

export interface CarbonProject {
  id: string;
  name: string;
  description: string | null;
  location_name: string;
  latitude: number;
  longitude: number;
  area_hectares: number;
  project_type: string;
  status: 'pending' | 'active' | 'verified' | 'expired';
  verification_tier: 'tier1' | 'tier2' | 'tier3' | null;
  start_date: string;
  end_date: string | null;
  total_credits: number;
  verified_credits: number;
  created_at: string;
  updated_at: string;
}

export interface CarbonFluxData {
  id: string;
  project_id: string;
  measurement_date: string;
  data_source: string;
  ndvi: number | null;
  evi: number | null;
  carbon_sequestration: number | null;
  net_ecosystem_exchange: number | null;
  gross_primary_productivity: number | null;
  xco2: number | null;
  soil_moisture: number | null;
  temperature: number | null;
  created_at: string;
}

export interface VerificationReport {
  id: string;
  project_id: string;
  verification_tier: 'tier1' | 'tier2' | 'tier3';
  report_date: string;
  satellite_score: number | null;
  iot_score: number | null;
  ground_truth_score: number | null;
  overall_score: number;
  credits_verified: number;
  status: string;
  created_at: string;
}

export interface IoTSensor {
  id: string;
  project_id: string;
  sensor_type: string;
  sensor_id: string;
  latitude: number;
  longitude: number;
  status: string;
  last_reading_at: string | null;
}

// --- MOCK DATA ---
const MOCK_PROJECTS: CarbonProject[] = [
  {
    id: '1',
    name: 'Serengeti Reforestation',
    description: 'Restoring native acacia woodlands in the Serengeti ecosystem.',
    location_name: 'Tanzania',
    latitude: -2.333,
    longitude: 34.833,
    area_hectares: 5000,
    project_type: 'Reforestation',
    status: 'active',
    verification_tier: 'tier2',
    start_date: '2023-01-15',
    end_date: '2033-01-15',
    total_credits: 150000,
    verified_credits: 45000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Kilimanjaro Carbon Sink',
    description: 'Soil carbon sequestration project on the slopes of Kilimanjaro.',
    location_name: 'Kenya',
    latitude: -3.067,
    longitude: 37.356,
    area_hectares: 2500,
    project_type: 'Soil Carbon',
    status: 'verified',
    verification_tier: 'tier3',
    start_date: '2022-06-01',
    end_date: '2032-06-01',
    total_credits: 80000,
    verified_credits: 80000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mau Forest Conservation',
    description: 'Protecting the water tower of Kenya.',
    location_name: 'Kenya',
    latitude: -0.5,
    longitude: 35.75,
    area_hectares: 12000,
    project_type: 'REDD+',
    status: 'pending',
    verification_tier: null,
    start_date: '2024-01-01',
    end_date: null,
    total_credits: 300000,
    verified_credits: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const MOCK_FLUX: CarbonFluxData[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `flux-${i}`,
  project_id: i % 2 === 0 ? '1' : '2',
  measurement_date: new Date(Date.now() - i * 86400000).toISOString(),
  data_source: 'Sentinel-2',
  ndvi: 0.6 + Math.random() * 0.3,
  evi: 0.4 + Math.random() * 0.2,
  carbon_sequestration: 12.5 + Math.random() * 5,
  net_ecosystem_exchange: -2.5 + Math.random(),
  gross_primary_productivity: 8.0 + Math.random() * 2,
  xco2: 415 + Math.random() * 10,
  soil_moisture: 30 + Math.random() * 20,
  temperature: 20 + Math.random() * 10,
  created_at: new Date().toISOString(),
}));

const MOCK_REPORTS: VerificationReport[] = [
  {
    id: 'rep-1',
    project_id: '1',
    verification_tier: 'tier2',
    report_date: new Date(Date.now() - 100000000).toISOString(),
    satellite_score: 85,
    iot_score: 78,
    ground_truth_score: 92,
    overall_score: 85,
    credits_verified: 45000,
    status: 'completed',
    created_at: new Date().toISOString(),
  },
  {
    id: 'rep-2',
    project_id: '2',
    verification_tier: 'tier3',
    report_date: new Date(Date.now() - 50000000).toISOString(),
    satellite_score: 95,
    iot_score: 98,
    ground_truth_score: 97,
    overall_score: 96,
    credits_verified: 80000,
    status: 'completed',
    created_at: new Date().toISOString(),
  }
];

const MOCK_SENSORS: IoTSensor[] = [
  {
    id: 'sens-1',
    project_id: '1',
    sensor_type: 'Soil Moisture',
    sensor_id: 'SM-001',
    latitude: -2.333,
    longitude: 34.833,
    status: 'active',
    last_reading_at: new Date().toISOString(),
  }
];

export function useProjects() {
  return useQuery({
    queryKey: ['carbon-projects'],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_PROJECTS;
    },
  });
}

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ['carbon-project', projectId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (!projectId) return null;
      return MOCK_PROJECTS.find(p => p.id === projectId) || null;
    },
    enabled: !!projectId,
  });
}

export function useCarbonFluxData(projectId?: string) {
  return useQuery({
    queryKey: ['carbon-flux', projectId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      if (projectId) {
        return MOCK_FLUX.filter(f => f.project_id === projectId);
      }
      return MOCK_FLUX;
    },
  });
}

export function useVerificationReports(projectId?: string) {
  return useQuery({
    queryKey: ['verification-reports', projectId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      if (projectId) {
        return MOCK_REPORTS.filter(r => r.project_id === projectId);
      }
      return MOCK_REPORTS;
    },
  });
}

export function useIoTSensors(projectId?: string) {
  return useQuery({
    queryKey: ['iot-sensors', projectId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (projectId) {
        return MOCK_SENSORS.filter(s => s.project_id === projectId);
      }
      return MOCK_SENSORS;
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));

      const projects = MOCK_PROJECTS;
      const reports = MOCK_REPORTS;
      const fluxData = MOCK_FLUX;

      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.status === 'active').length;
      const verifiedProjects = projects.filter(p => p.status === 'verified').length;
      const totalCredits = projects.reduce((sum, p) => sum + Number(p.total_credits || 0), 0);
      const verifiedCredits = projects.reduce((sum, p) => sum + Number(p.verified_credits || 0), 0);
      const totalArea = projects.reduce((sum, p) => sum + Number(p.area_hectares || 0), 0);

      const statusDistribution = {
        pending: projects.filter(p => p.status === 'pending').length,
        active: activeProjects,
        verified: verifiedProjects,
        expired: projects.filter(p => p.status === 'expired').length,
      };

      const avgVerificationScore = reports.length > 0
        ? reports.reduce((sum, r) => sum + Number(r.overall_score || 0), 0) / reports.length
        : 0;

      return {
        totalProjects,
        activeProjects,
        verifiedProjects,
        totalCredits,
        verifiedCredits,
        totalArea,
        statusDistribution,
        avgVerificationScore,
        recentFluxData: fluxData.slice(0, 10),
        recentReports: reports.slice(0, 5),
      };
    },
  });
}
