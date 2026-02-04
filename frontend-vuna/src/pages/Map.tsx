import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// API base URL for the Django backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types for project data from API
interface Project {
    id: number;
    name: string;
    latitude?: number;
    longitude?: number;
    cached_flux?: number;
    cached_co2?: number;
    cached_revenue?: number;
    geojson_boundary?: string;
}

// Color grading function for carbon flux intensity
const getColor = (flux: number): string => {
    if (flux > 0.07) return '#10b981'; // High (Green)
    if (flux > 0.04) return '#a3e635'; // Medium (Yellow-Green)
    if (flux > 0.02) return '#facc15'; // Low-Medium (Yellow)
    return '#fb923c'; // Low (Orange)
};

// Legend component
const Legend = () => {
    const map = useMap();

    useEffect(() => {
        const legend = new L.Control({ position: 'bottomright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'legend');
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

// Forest projects layer component
const ProjectsLayer = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const map = useMap();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/projects/`)
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(error => console.error('Error fetching projects:', error));
    }, []);

    useEffect(() => {
        // Clear existing layers before adding new ones
        const layers: L.Layer[] = [];

        projects.forEach(project => {
            const flux = project.cached_flux || 0;
            const color = getColor(flux);

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

                            // Click popup with detailed data
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

const Map = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-[88px] relative">
                <style>{`
                    /* Popup Styles */
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

                    /* Legend Style */
                    .legend {
                        background: white;
                        padding: 12px;
                        border-radius: 8px;
                        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
                        font-family: 'Segoe UI', sans-serif;
                        line-height: 18px;
                        color: #555;
                        min-width: 150px;
                    }

                    .legend-title {
                        margin: 0 0 10px;
                        color: #333;
                        font-size: 14px;
                        font-weight: 600;
                    }

                    .legend-color {
                        width: 14px;
                        height: 14px;
                        display: inline-block;
                        margin-right: 8px;
                        opacity: 0.9;
                        border-radius: 50%;
                        vertical-align: middle;
                    }

                    .legend-row {
                        margin-bottom: 4px;
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                    }
                `}</style>
                <MapContainer
                    center={[-0.50, 37.0]}
                    zoom={6.5}
                    style={{ height: 'calc(100vh - 88px)', width: '100%' }}
                    zoomControl={true}
                >
                    {/* Esri Satellite Tiles */}
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
                    <KenyaBoundary />
                    {/* Forest Projects Overlay */}
                    <ProjectsLayer />
                    {/* Legend */}
                    <Legend />
                </MapContainer>
            </main>
            <Footer />
        </div>
    );
};

export default Map;
