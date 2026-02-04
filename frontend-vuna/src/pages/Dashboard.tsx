import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VunaMap } from '@/components/map/VunaMap';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { CarbonFluxChart } from '@/components/dashboard/CarbonFluxChart';
import { VerificationStatusChart } from '@/components/dashboard/VerificationStatusChart';
import { ProjectMetricsChart } from '@/components/dashboard/ProjectMetricsChart';
import { SatelliteDataCard } from '@/components/dashboard/SatelliteDataCard';
import { useDashboardStats, useProjects, useCarbonFluxData } from '@/hooks/useCarbon';
import {
  Leaf,
  Globe,
  Shield,
  TrendingUp,
  Satellite,
  Activity,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: fluxData, isLoading: fluxLoading } = useCarbonFluxData();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Verification Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Real-time carbon monitoring powered by Satellite Data and IoT sensors
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Projects"
              value={stats?.totalProjects || 0}
              subtitle="Across all regions"
              icon={Globe}
              delay={0}
            />
            <StatsCard
              title="Active Monitoring"
              value={stats?.activeProjects || 0}
              subtitle="Under satellite surveillance"
              icon={Satellite}
              delay={0.1}
            />
            <StatsCard
              title="Verified Credits"
              value={`${((stats?.verifiedCredits || 0) / 1000).toFixed(1)}k`}
              subtitle="tCO₂ equivalent"
              icon={Shield}
              delay={0.2}
            />
            <StatsCard
              title="Avg Verification Score"
              value={`${(stats?.avgVerificationScore || 0).toFixed(1)}%`}
              subtitle="Across all tiers"
              icon={TrendingUp}
              delay={0.3}
            />
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-muted/50 border border-border">
              <TabsTrigger value="overview" className="data-[state=active]:bg-background">
                <Activity className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-background">
                <Globe className="w-4 h-4 mr-2" />
                VunaMap
              </TabsTrigger>
              <TabsTrigger value="satellite" className="data-[state=active]:bg-background">
                <Satellite className="w-4 h-4 mr-2" />
                Satellite Data
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Carbon Flux Chart - takes 2 columns */}
                <div className="lg:col-span-2">
                  <CarbonFluxChart
                    data={fluxData}
                    isLoading={fluxLoading}
                  />
                </div>

                {/* Verification Status */}
                <div>
                  <VerificationStatusChart
                    data={stats?.statusDistribution}
                    isLoading={statsLoading}
                  />
                </div>
              </div>

              {/* Project Metrics */}
              <ProjectMetricsChart
                projects={projects}
                isLoading={projectsLoading}
              />

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                  title="Total Area Monitored"
                  value={`${((stats?.totalArea || 0) / 1000).toFixed(1)}k`}
                  subtitle="Hectares under observation"
                  icon={Leaf}
                  delay={0}
                />
                <StatsCard
                  title="Total Carbon Credits"
                  value={`${((stats?.totalCredits || 0) / 1000).toFixed(1)}k`}
                  subtitle="tCO₂ generated"
                  icon={TrendingUp}
                  delay={0.1}
                />
                <StatsCard
                  title="Verified Projects"
                  value={stats?.verifiedProjects || 0}
                  subtitle="Tier 3 certified"
                  icon={Shield}
                  delay={0.2}
                />
              </div>
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <VunaMap className="h-[600px]" />
              </motion.div>
            </TabsContent>

            {/* Satellite Data Tab */}
            <TabsContent value="satellite" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CarbonFluxChart
                  data={fluxData}
                  isLoading={fluxLoading}
                  title="Vegetation Indices"
                  description="NDVI and EVI measurements from Sentinel-2"
                />
                <SatelliteDataCard
                  data={fluxData}
                  isLoading={fluxLoading}
                />
              </div>

              {/* Data Sources Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <h3 className="font-semibold text-foreground">Sentinel-2</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    High-resolution multispectral imagery for vegetation monitoring
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <h3 className="font-semibold text-foreground">OCO-3</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    NASA's carbon observatory measuring atmospheric CO₂ concentrations
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <h3 className="font-semibold text-foreground">Ground Stations</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Eddy covariance towers measuring ecosystem carbon exchange
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <h3 className="font-semibold text-foreground">IoT Sensors</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Distributed network for soil moisture and temperature monitoring
                  </p>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
