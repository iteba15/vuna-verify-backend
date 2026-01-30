import os
import django
import json
import random

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vuna_backend.settings')
django.setup()

from verifier.models import Project

def import_forests():
    geojson_path = 'Kenya_Gazetted_Forests.geojson'
    
    if not os.path.exists(geojson_path):
        print(f"Error: {geojson_path} not found.")
        return

    print(f"Loading {geojson_path}...")
    with open(geojson_path, 'r') as f:
        data = json.load(f)

    count_updated = 0
    count_created = 0

    print(f"Found {len(data['features'])} forests in GeoJSON.")

    for feature in data['features']:
        props = feature['properties']
        forest_name = props.get('FOREST', 'Unknown Forest')
        geometry = feature['geometry']
        
        # Calculate a rough center point (centroid)
        # This is a simple approximation for the pin
        coords = geometry['coordinates'][0] # Outer ring
        if len(coords) > 0:
            # Flatten if it's MultiPolygon or deeper nesting, but assuming Polygon based on snippet
            # The snippet showed coordinates as [[[x,y], [x,y]...]]
            # Simple average of vertices
            lats = [p[1] for p in coords]
            lons = [p[0] for p in coords]
            center_lat = sum(lats) / len(lats)
            center_lon = sum(lons) / len(lons)
        else:
            center_lat = 0
            center_lon = 0

        # Try to find existing project (Loose matching)
        # e.g. "Mt. Kenya" vs "MOUNT KENYA"
        project = None
        
        # 1. Exact Match (Case insensitive)
        projects = Project.objects.filter(name__iexact=forest_name)
        if projects.exists():
            project = projects.first()
        else:
            # 2. Contains Match 
            # (e.g. GeoJSON 'MOUNT KENYA' matches DB 'Mt. Kenya'?? No, creates duplicates usually)
            # Let's just create new ones mostly, but check broad matches
            pass

        if project:
            print(f"Updating boundary for: {project.name}")
            project.geojson_boundary = json.dumps(geometry)
            # Update center just in case
            project.latitude = center_lat
            project.longitude = center_lon
            project.save()
            count_updated += 1
        else:
            # Create New
            # Assign random dummy data for visualization
            flux = random.uniform(0.01, 0.09) # Green to Orange range
            revenue = flux * 2400 # Rough multiplier
            co2 = flux * 120
            
            print(f"Creating new forest: {forest_name}")
            Project.objects.create(
                name=forest_name.title(), # "MOUNT ELGON" -> "Mount Elgon"
                latitude=center_lat,
                longitude=center_lon,
                cached_flux=round(flux, 4),
                cached_co2=round(co2, 2),
                cached_revenue=round(revenue, 2),
                geojson_boundary=json.dumps(geometry)
            )
            count_created += 1

    print(f"Done! Updated: {count_updated}, Created: {count_created}")

if __name__ == '__main__':
    import_forests()
