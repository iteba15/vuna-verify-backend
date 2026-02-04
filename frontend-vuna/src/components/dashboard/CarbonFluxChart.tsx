import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CarbonFluxData } from '@/hooks/useCarbon';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

interface CarbonFluxChartProps {
  data: CarbonFluxData[] | undefined;
  isLoading: boolean;
  title?: string;
  description?: string;
}

export function CarbonFluxChart({ 
  data, 
  isLoading,
  title = "Carbon Flux Analysis",
  description = "Satellite-derived carbon sequestration and vegetation indices"
}: CarbonFluxChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Group by date and aggregate
    const grouped = data.reduce((acc, item) => {
      const date = item.measurement_date;
      if (!acc[date]) {
        acc[date] = {
          date,
          ndvi: [],
          carbonSeq: [],
          gpp: [],
        };
      }
      if (item.ndvi) acc[date].ndvi.push(Number(item.ndvi));
      if (item.carbon_sequestration) acc[date].carbonSeq.push(Number(item.carbon_sequestration));
      if (item.gross_primary_productivity) acc[date].gpp.push(Number(item.gross_primary_productivity));
      return acc;
    }, {} as Record<string, { date: string; ndvi: number[]; carbonSeq: number[]; gpp: number[] }>);

    return Object.values(grouped)
      .map(item => ({
        date: item.date,
        displayDate: format(parseISO(item.date), 'MMM dd'),
        ndvi: item.ndvi.length > 0 ? item.ndvi.reduce((a, b) => a + b, 0) / item.ndvi.length : null,
        carbonSequestration: item.carbonSeq.length > 0 ? item.carbonSeq.reduce((a, b) => a + b, 0) / item.carbonSeq.length : null,
        gpp: item.gpp.length > 0 ? item.gpp.reduce((a, b) => a + b, 0) / item.gpp.length : null,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 data points
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
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
        <CardTitle className="font-display text-foreground">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              <p className="font-medium">No flux data available</p>
              <p className="text-sm">Satellite data will appear here once processed</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNdvi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A574" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#D4A574" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorGpp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="displayDate" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="ndvi"
                name="NDVI"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorNdvi)"
              />
              <Area
                type="monotone"
                dataKey="carbonSequestration"
                name="Carbon Seq. (tCO₂/ha)"
                stroke="#D4A574"
                fillOpacity={1}
                fill="url(#colorCarbon)"
              />
              <Area
                type="monotone"
                dataKey="gpp"
                name="GPP (gC/m²/day)"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorGpp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
