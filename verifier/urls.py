from django.urls import path
from .views import VerifyCreditView, ProjectListView, map_view

urlpatterns = [
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('verify/', VerifyCreditView.as_view(), name='verify-credit'),
    path('map/', map_view, name='interactive-map'),
]
