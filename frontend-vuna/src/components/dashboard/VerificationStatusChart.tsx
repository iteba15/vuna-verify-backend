import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatusDistribution {
  pending: number;
  active: number;
  verified: number;
  expired: number;
}

interface VerificationStatusChartProps {
  data: StatusDistribution | undefined;
  isLoading: boolean;
}

const COLORS = {
  pending: '#f59e0b',
  active: '#22c55e',
  verified: '#D4A574',
  expired: '#ef4444',
};

const STATUS_LABELS = {
  pending: 'Pending Verification',
  active: 'Active Monitoring',
  verified: 'Fully Verified',
  expired: 'Expired',
};

export function VerificationStatusChart({ data, isLoading }: VerificationStatusChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({
        name: STATUS_LABELS[key as keyof typeof STATUS_LABELS],
        value,
        color: COLORS[key as keyof typeof COLORS],
      }));
  }, [data]);

  const total = useMemo(() => {
    if (!data) return 0;
    return Object.values(data).reduce((sum, val) => sum + val, 0);
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display text-foreground">Verification Status</CardTitle>
        <CardDescription>Distribution of project verification stages</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
              </svg>
              <p className="font-medium">No projects yet</p>
              <p className="text-sm">Project status will appear here</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number) => [`${value} projects`, '']}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
