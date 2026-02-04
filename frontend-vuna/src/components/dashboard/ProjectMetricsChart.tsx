import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CarbonProject } from '@/hooks/useCarbon';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectMetricsChartProps {
  projects: CarbonProject[] | undefined;
  isLoading: boolean;
}

export function ProjectMetricsChart({ projects, isLoading }: ProjectMetricsChartProps) {
  const chartData = useMemo(() => {
    if (!projects || projects.length === 0) return [];

    // Group by project type
    const grouped = projects.reduce((acc, project) => {
      const type = project.project_type || 'Other';
      if (!acc[type]) {
        acc[type] = {
          type,
          totalCredits: 0,
          verifiedCredits: 0,
          area: 0,
          count: 0,
        };
      }
      acc[type].totalCredits += Number(project.total_credits || 0);
      acc[type].verifiedCredits += Number(project.verified_credits || 0);
      acc[type].area += Number(project.area_hectares || 0);
      acc[type].count += 1;
      return acc;
    }, {} as Record<string, { type: string; totalCredits: number; verifiedCredits: number; area: number; count: number }>);

    return Object.values(grouped)
      .sort((a, b) => b.totalCredits - a.totalCredits)
      .slice(0, 6);
  }, [projects]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display text-foreground">Project Metrics by Type</CardTitle>
        <CardDescription>Carbon credits and verified amounts by project category</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
              </svg>
              <p className="font-medium">No project data available</p>
              <p className="text-sm">Metrics will appear here once projects are added</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="type" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => value.length > 12 ? value.slice(0, 12) + '...' : value}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} tCO₂`,
                  name === 'totalCredits' ? 'Total Credits' : 'Verified Credits'
                ]}
              />
              <Legend 
                formatter={(value) => (
                  <span style={{ color: 'hsl(var(--foreground))' }}>
                    {value === 'totalCredits' ? 'Total Credits' : 'Verified Credits'}
                  </span>
                )}
              />
              <Bar dataKey="totalCredits" fill="#1B4332" radius={[4, 4, 0, 0]} />
              <Bar dataKey="verifiedCredits" fill="#D4A574" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
