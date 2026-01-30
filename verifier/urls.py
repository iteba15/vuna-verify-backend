from django.urls import path
from .views import VerifyCreditView, ProjectListView

urlpatterns = [
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('verify/', VerifyCreditView.as_view(), name='verify-credit'),
]
