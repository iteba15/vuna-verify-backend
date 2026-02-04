import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CarbonFluxData } from '@/hooks/useCarbon';
import { format, parseISO } from 'date-fns';

interface SatelliteDataCardProps {
  data: CarbonFluxData[] | undefined;
  isLoading: boolean;
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  sentinel: { label: 'Sentinel-2', color: 'bg-blue-500' },
  oco3: { label: 'OCO-3', color: 'bg-purple-500' },
  ground_sensor: { label: 'Ground Station', color: 'bg-green-500' },
  iot: { label: 'IoT Sensor', color: 'bg-amber-500' },
};

export function SatelliteDataCard({ data, isLoading }: SatelliteDataCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const recentData = data?.slice(0, 5) || [];

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display text-foreground">Recent Satellite Data</CardTitle>
        <CardDescription>Latest measurements from Sentinel-2 and OCO-3</CardDescription>
      </CardHeader>
      <CardContent>
        {recentData.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="font-medium">No satellite data yet</p>
            <p className="text-sm">Data will appear as satellites collect measurements</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentData.map((item, index) => {
              const source = SOURCE_LABELS[item.data_source] || { label: item.data_source, color: 'bg-gray-500' };
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${source.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {source.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(item.measurement_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {item.ndvi && (
                        <div>
                          <span className="text-muted-foreground">NDVI:</span>{' '}
                          <span className="font-medium">{Number(item.ndvi).toFixed(3)}</span>
                        </div>
                      )}
                      {item.xco2 && (
                        <div>
                          <span className="text-muted-foreground">XCO₂:</span>{' '}
                          <span className="font-medium">{Number(item.xco2).toFixed(2)} ppm</span>
                        </div>
                      )}
                      {item.carbon_sequestration && (
                        <div>
                          <span className="text-muted-foreground">Carbon Seq:</span>{' '}
                          <span className="font-medium">{Number(item.carbon_sequestration).toFixed(2)} tCO₂/ha</span>
                        </div>
                      )}
                      {item.gross_primary_productivity && (
                        <div>
                          <span className="text-muted-foreground">GPP:</span>{' '}
                          <span className="font-medium">{Number(item.gross_primary_productivity).toFixed(2)} gC/m²/day</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
