from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'latitude', 'longitude', 
            'tiff_file', 'cached_flux', 'cached_co2', 
            'cached_revenue', 'updated_at'
        ]

class VerificationInputSerializer(serializers.Serializer):
    # Optional project ID if we want to update an existing project
    # OR we can pass project details to create one.
    project_id = serializers.IntegerField(required=False, allow_null=True)
    
    # Input source: File OR URL
    image_file = serializers.FileField(required=False)
    image_url = serializers.URLField(required=False)
    
    # Optional metadata if creating a new project on the fly
    project_name = serializers.CharField(required=False, max_length=255)
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)

    def validate(self, data):
        """
        Check that either image_file or image_url is provided.
        """
        if not data.get('image_file') and not data.get('image_url'):
            raise serializers.ValidationError("Either 'image_file' or 'image_url' must be provided.")
        return data
