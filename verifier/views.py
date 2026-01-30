from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Project
from .serializers import ProjectSerializer, VerificationInputSerializer
from .services import VunaVerifier
from django.core.files.base import ContentFile

from django.shortcuts import render

class ProjectListView(ListAPIView):
    """
    Returns a list of all projects for the interactive map.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

def map_view(request):
    """
    Renders the interactive map page.
    """
    return render(request, 'verifier/map.html')


class VerifyCreditView(APIView):
    """
    Accepts an image (File or URL), runs the VunaVerifier model,
    and returns the prediction. 
    Optionally saves the result to a Project if project info is provided.
    """
    def post(self, request, *args, **kwargs):
        serializer = VerificationInputSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            
            # 1. Determine Input
            input_source = data.get('image_file') or data.get('image_url')
            
            # 2. Run Verification
            verifier = VunaVerifier()
            # If it's an uploaded file object, we might need to save it temporarily
            # But VunaVerifier expects a path or URL.
            # If it's a file upload (InMemoryUploadedFile), we should save it first.
            
            target_path = input_source
            temp_path = None
            
            if data.get('image_file'):
                # Save uploaded file to temp or use directly if implementing differently
                # For simplicty, let's assume valid file path handling in VunaVerifier
                # But VunaVerifier.verify() takes a path string.
                # We need to save the uploaded file to disk to get a path.
                # OR we modify VunaVerifier to accept file objects (rasterio.open works with file-like objects too!)
                # Given current VunaVerifier design:
                pass 
                # Let's simple handle saving to Project model first if needed, 
                # or write to temp.
            
            # Actually, let's refine the workflow:
            # If we are creating a Project, we save the file to the model.
            # Then run verify on the model's file path.
            
            project = None
            
            # Scenario A: Update existing Project
            if data.get('project_id'):
                try:
                    project = Project.objects.get(id=data['project_id'])
                    # If new file provided, update it
                    if data.get('image_file'):
                        project.tiff_file = data['image_file']
                        project.save()
                except Project.DoesNotExist:
                    return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

            # Scenario B: Create New Project (if output is good)
            elif data.get('project_name') and data.get('latitude'):
                project = Project(
                    name=data['project_name'],
                    latitude=data['latitude'],
                    longitude=data['longitude']
                )
                if data.get('image_file'):
                    project.tiff_file = data['image_file']
                project.save() # This saves file to disk
            
            # Prepare Path for Verifier
            # If we have a stored project with a file:
            if project and project.tiff_file:
                verify_input = project.tiff_file.path
            # If we just have a URL (no project save yet, or saving URL?)
            elif data.get('image_url'):
                verify_input = data['image_url']
            else:
                # If we have a file upload but NO project to save to yet (just testing?)
                # We need to save it temp.
                # For `services.py`, let's just use the project workflow for now as it's cleaner.
                # If no project, we return error "Please provide project details to save results".
                # Or we handle temp file.
                return Response({"error": "Please provide project details (name, lat, lon) to save and verify."}, status=status.HTTP_400_BAD_REQUEST)

            # 3. Call Service
            result = verifier.verify(verify_input)
            
            if result.get('status') == 'success':
                # Update Project Cache
                if project:
                    project.cached_flux = result.get('carbon_flux')
                    project.cached_co2 = result.get('annual_tonnes_co2')
                    project.cached_revenue = result.get('estimated_revenue_usd')
                    project.save()
                
                # Combine result with project ID
                result['project_id'] = project.id if project else None
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
