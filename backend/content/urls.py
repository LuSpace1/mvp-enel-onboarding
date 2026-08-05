from django.urls import path

from .views import (
    AdminVideoDetailView,
    AdminVideoListCreateView,
    WorkerVideoListView,
)

urlpatterns = [
    # Contenido General (Trabajadores Autenticados)
    path('videos/', WorkerVideoListView.as_view(), name='worker_videos_list'),
    # Administración de Contenido (Protegido Admin)
    path('admin/videos/', AdminVideoListCreateView.as_view(), name='admin_videos_list_create'),
    path('admin/videos/<int:pk>/', AdminVideoDetailView.as_view(), name='admin_video_detail'),
]
