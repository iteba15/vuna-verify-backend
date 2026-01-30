import os
import django
import random

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vuna_backend.settings')
django.setup()

from verifier.models import Project

def populate():
    print("Populating dummy projects...")
    
    # Define some key locations in Kenya
    projects = [
        {
            "name": "Mt. Kenya Forest Reserve",
            "lat": -0.1521, "lon": 37.3084,
            "flux": 0.085, # High (Green)
            "co2": 10.2, "revenue": 204.0
        },
        {
            "name": "Aberdare National Park",
            "lat": -0.4201, "lon": 36.6896,
            "flux": 0.065, # Good (Light Green)
            "co2": 7.8, "revenue": 156.0
        },
        {
            "name": "Kakamega Forest",
            "lat": 0.2827, "lon": 34.8540,
            "flux": 0.078, # High (Green)
            "co2": 9.4, "revenue": 188.0
        },
        {
            "name": "Tsavo East (Savanna)",
            "lat": -2.7788, "lon": 38.7729,
            "flux": 0.025, # Low (Orange/Yellow)
            "co2": 3.0, "revenue": 60.0
        },
        {
            "name": "Arabuko Sokoke Forest",
            "lat": -3.3146, "lon": 39.8890,
            "flux": 0.055, # Moderate (Yellow-Green)
            "co2": 6.6, "revenue": 132.0
        },
        {
            "name": "Ngong Hills",
            "lat": -1.3969, "lon": 36.6358,
            "flux": 0.035, # Moderate-Low
            "co2": 4.2, "revenue": 84.0
        }
    ]

    for p in projects:
        # Check if exists to avoid duplicates
        obj, created = Project.objects.get_or_create(
            name=p["name"],
            defaults={
                "latitude": p["lat"],
                "longitude": p["lon"],
                "cached_flux": p["flux"],
                "cached_co2": p["co2"],
                "cached_revenue": p["revenue"]
            }
        )
        if created:
            print(f"Created: {p['name']}")
        else:
            print(f"Updated: {p['name']}")
            obj.latitude = p["lat"]
            obj.longitude = p["lon"]
            obj.cached_flux = p["flux"]
            obj.cached_co2 = p['co2']
            obj.cached_revenue = p['revenue']
            obj.save()

    print("Done!")

if __name__ == '__main__':
    populate()
