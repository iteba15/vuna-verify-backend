import os
import django
import json

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vuna_backend.settings')
django.setup()

from verifier.models import Project

def generate_polygon(lat, lon, size_deg=0.1):
    """
    Creates a simple square polygon around the point for testing boundaries.
    """
    half = size_deg / 2
    return json.dumps({
        "type": "Polygon",
        "coordinates": [[
            [lon - half, lat - half], # Bottom Left
            [lon + half, lat - half], # Bottom Right
            [lon + half, lat + half], # Top Right
            [lon - half, lat + half], # Top Left
            [lon - half, lat - half]  # Close Loop
        ]]
    })

def populate_boundaries():
    print("Adding boundaries to projects...")
    
    projects = Project.objects.all()
    
    for p in projects:
        # Vary size based on real world relative size (approx)
        size = 0.1
        if "Tsavo" in p.name:
            size = 1.0 # Huge
        elif "Mt. Kenya" in p.name:
            size = 0.3 # Large
        elif "Kakamega" in p.name:
            size = 0.15
            
        p.geojson_boundary = generate_polygon(p.latitude, p.longitude, size)
        p.save()
        print(f"Added boundary to {p.name}")

if __name__ == '__main__':
    populate_boundaries()
