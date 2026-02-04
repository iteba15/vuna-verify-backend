import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useProjects, CarbonProject } from '@/hooks/useCarbon';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// API base URL for the Django backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types for backend forest data
interface BackendProject {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  cached_flux?: number;
  cached_co2?: number;
  cached_revenue?: number;
  geojson_boundary?: string;
}

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons based on project status
const createCustomIcon = (status: string) => {
  const colors: Record<string, string> = {
    pending: '#f59e0b',
    active: '#22c55e',
    verified: '#D4A574',
    expired: '#ef4444',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${colors[status] || '#22c55e'};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Carbon Flux color grading (from map.html)
const getFluxColor = (flux: number): string => {
  if (flux > 0.07) return '#10b981'; // High (Green)
  if (flux > 0.04) return '#a3e635'; // Medium (Yellow-Green)
  if (flux > 0.02) return '#facc15'; // Low-Medium (Yellow)
  return '#fb923c'; // Low (Orange)
};

// Map bounds controller
function MapController({ projects }: { projects: CarbonProject[] }) {
  const map = useMap();

  useEffect(() => {
    if (projects.length > 0) {
      const bounds = L.latLngBounds(
        projects.map(p => [Number(p.latitude), Number(p.longitude)])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [projects, map]);

  return null;
}

// Kenya boundary loader component
const KenyaBoundary = () => {
  const [boundary, setBoundary] = useState<GeoJSON.GeoJsonObject | null>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/KEN.geo.json')
      .then(res => res.json())
      .then(data => setBoundary(data))
      .catch(error => console.error('Error loading Kenya boundary:', error));
  }, []);

  if (!boundary) return null;

  return (
    <GeoJSON
      data={boundary}
      style={{
        color: "#fff",
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.0
      }}
    />
  );
};

// Backend forest projects layer component
const ForestProjectsLayer = () => {
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const map = useMap();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects/`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching backend projects:', error));
  }, []);

  useEffect(() => {
    const layers: L.Layer[] = [];

    projects.forEach(project => {
      const flux = project.cached_flux || 0;
      const color = getFluxColor(flux);

      if (project.geojson_boundary) {
        try {
          const geojson = JSON.parse(project.geojson_boundary);
          const layer = L.geoJSON(geojson, {
            style: {
              color: color,
              weight: 3,
              opacity: 1,
              fillOpacity: 0.4,
              fillColor: color
            },
            onEachFeature: (_feature, featureLayer) => {
              // Tooltip on hover
              featureLayer.bindTooltip(`<strong>${project.name}</strong>`, {
                permanent: false,
                direction: 'top',
                opacity: 0.9
              });

              // Hover effects
              featureLayer.on({
                mouseover: (e) => {
                  const l = e.target;
                  l.setStyle({
                    weight: 5,
                    color: '#fff',
                    dashArray: '',
                    fillOpacity: 0.7
                  });
                  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    l.bringToFront();
                  }
                },
                mouseout: (e) => {
                  const l = e.target;
                  l.setStyle({
                    weight: 3,
                    color: color,
                    fillOpacity: 0.4
                  });
                }
              });

              // Click popup with detailed carbon data
              const popupContent = `
                <div class="popup-header" style="background:${color}">
                  <h3>${project.name}</h3>
                </div>
                <div class="popup-body">
                  <div class="stat-row">
                    <span class="stat-label">Carbon Flux:</span>
                    <span class="stat-value" style="color:${color}">${project.cached_flux || '0.000'}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">CO2 Seq. / ha:</span>
                    <span class="stat-value">${project.cached_co2 || '0'} tonnes/yr</span>
                  </div>
                  <hr style="border:0; border-top:1px solid #eee; margin: 10px 0;">
                  <div class="stat-row">
                    <span class="stat-label">Est. Revenue / ha:</span>
                    <span class="stat-value revenue-value">$${project.cached_revenue || '0.00'}</span>
                  </div>
                </div>
              `;
              featureLayer.bindPopup(popupContent, { className: 'project-popup', closeButton: false });
            }
          });
          layer.addTo(map);
          layers.push(layer);
        } catch (e) {
          console.error('Error parsing GeoJSON for project:', project.name, e);
        }
      } else if (project.latitude && project.longitude) {
        // Fallback to circle marker if no boundary
        const popupContent = `
          <div class="popup-header" style="background:${color}">
            <h3>${project.name}</h3>
          </div>
          <div class="popup-body">
            <div class="stat-row">
              <span class="stat-label">Carbon Flux:</span>
              <span class="stat-value" style="color:${color}">${project.cached_flux || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">CO2 Sequestration:</span>
              <span class="stat-value">${project.cached_co2 || '0'} tonnes/yr</span>
            </div>
            <hr style="border:0; border-top:1px solid #eee; margin: 10px 0;">
            <div class="stat-row">
              <span class="stat-label">Est. Revenue:</span>
              <span class="stat-value revenue-value">$${project.cached_revenue || '0.00'}</span>
            </div>
          </div>
        `;
        const marker = L.circleMarker([project.latitude, project.longitude], {
          radius: 10,
          fillColor: color,
          color: "#fff",
          weight: 2,
          fillOpacity: 0.8
        });
        marker.bindPopup(popupContent, { className: 'project-popup', closeButton: false });
        marker.addTo(map);
        layers.push(marker);
      }
    });

    return () => {
      layers.forEach(layer => map.removeLayer(layer));
    };
  }, [projects, map]);

  return null;
};

// Carbon Flux Legend component (Leaflet control)
const CarbonFluxLegend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'flux-legend');
      div.innerHTML = `
        <h4 class="legend-title">Carbon Flux Intensity</h4>
        <div class="legend-row"><span class="legend-color" style="background:#10b981"></span> High (>0.07)</div>
        <div class="legend-row"><span class="legend-color" style="background:#a3e635"></span> Good (0.04 - 0.07)</div>
        <div class="legend-row"><span class="legend-color" style="background:#facc15"></span> Moderate (0.02 - 0.04)</div>
        <div class="legend-row"><span class="legend-color" style="background:#fb923c"></span> Low (<0.02)</div>
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

interface VunaMapProps {
  className?: string;
  selectedProjectId?: string;
  onProjectSelect?: (project: CarbonProject) => void;
  showBackendForests?: boolean;
}

export function VunaMap({
  className = '',
  selectedProjectId,
  onProjectSelect,
  showBackendForests = true
}: VunaMapProps) {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className={`relative rounded-xl overflow-hidden ${className}`}>
        <Skeleton className="w-full h-full min-h-[400px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative rounded-xl overflow-hidden bg-muted ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-destructive">Failed to load projects</div>
        </div>
      </div>
    );
  }

  // Default center to Kenya
  const defaultCenter: [number, number] = [-0.50, 37.0];

  return (
    <div className={`relative rounded-xl overflow-hidden border border-border ${className}`}>
      <style>{`
        /* Popup Styles from map.html */
        .project-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .project-popup .leaflet-popup-content {
          margin: 0;
          width: 280px !important;
        }

        .popup-header {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 12px 16px;
          font-family: 'Segoe UI', sans-serif;
        }

        .popup-header h3 {
          margin: 0;
          font-size: 16px;
        }

        .popup-body {
          padding: 16px;
          font-family: 'Segoe UI', sans-serif;
          color: #333;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .stat-label {
          color: #666;
        }

        .stat-value {
          font-weight: 600;
          color: #111;
        }

        .revenue-value {
          color: #10b981;
        }

        /* Flux Legend Style */
        .flux-legend {
          background: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
          font-family: 'Segoe UI', sans-serif;
          line-height: 18px;
          color: #555;
          min-width: 150px;
        }

        .flux-legend .legend-title {
          margin: 0 0 10px;
          color: #333;
          font-size: 14px;
          font-weight: 600;
        }

        .flux-legend .legend-color {
          width: 14px;
          height: 14px;
          display: inline-block;
          margin-right: 8px;
          opacity: 0.9;
          border-radius: 50%;
          vertical-align: middle;
        }

        .flux-legend .legend-row {
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          font-size: 12px;
        }
      `}</style>
      <MapContainer
        center={defaultCenter}
        zoom={6.5}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        className="z-0"
      >
        {/* Esri Satellite Tiles (like map.html) */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
          maxZoom={17}
        />
        {/* Dark Map Labels/Borders */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          attribution="&copy;OpenStreetMap, &copy;CartoDB"
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Kenya Boundary */}
        {showBackendForests && <KenyaBoundary />}

        {/* Backend Forest Projects (GeoJSON polygons with carbon flux data) */}
        {showBackendForests && <ForestProjectsLayer />}

        {/* Carbon Flux Legend */}
        {showBackendForests && <CarbonFluxLegend />}

        {projects && projects.length > 0 && <MapController projects={projects} />}

        {/* Frontend project markers (VunaVerify projects) */}
        {projects?.map((project) => (
          <Marker
            key={project.id}
            position={[Number(project.latitude), Number(project.longitude)]}
            icon={createCustomIcon(project.status)}
            eventHandlers={{
              click: () => onProjectSelect?.(project),
            }}
          >
            <Popup className="vuna-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-display font-semibold text-forest-deep mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {project.location_name}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant={project.status === 'verified' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                  {project.verification_tier && (
                    <Badge variant="outline">
                      {project.verification_tier.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <span className="font-medium">{Number(project.area_hectares).toLocaleString()} ha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="font-medium">{Number(project.total_credits).toLocaleString()} tCO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{project.project_type}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Project Status legend (original VunaMap) */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg z-[1000]">
        <h4 className="text-xs font-semibold mb-2 text-foreground">Project Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow" />
            <span className="text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
            <span className="text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gold-warm border-2 border-white shadow" />
            <span className="text-muted-foreground">Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow" />
            <span className="text-muted-foreground">Expired</span>
          </div>
        </div>
      </div>

      {/* Empty state overlay */}
      {(!projects || projects.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-[1000]">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground text-sm">
              Carbon projects will appear on the map once data is available.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
