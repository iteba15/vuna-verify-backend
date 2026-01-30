from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=255)
    # Location for the pin on the map
    latitude = models.FloatField()
    longitude = models.FloatField()
    
    # The source data (Sentinel-2 TIF)
    # We use FileField so we can upload the actual physics data
    tiff_file = models.FileField(upload_to='projects/tiffs/')
    
    # Cached results from VunaVerifier
    cached_flux = models.FloatField(null=True, blank=True, help_text="Predicted Carbon Flux")
    cached_co2 = models.FloatField(null=True, blank=True, help_text="Annual Tonnes CO2")
    cached_revenue = models.FloatField(null=True, blank=True, help_text="Estimated Revenue USD")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
