from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsPlatformAdmin

from .models import VideoLink
from .serializers import VideoLinkSerializer


class WorkerVideoListView(generics.ListAPIView):
    """
    GET /api/videos/
    Lista los enlaces de videos disponibles para los trabajadores autenticados.
    """

    permission_classes = [IsAuthenticated]
    queryset = VideoLink.objects.all()
    serializer_class = VideoLinkSerializer


class AdminVideoListCreateView(generics.ListCreateAPIView):
    """
    GET /api/admin/videos/ - Lista todos los videos en el panel de administración.
    POST /api/admin/videos/ - Crea un nuevo enlace de video asociado a una sección.
    """

    permission_classes = [IsPlatformAdmin]
    queryset = VideoLink.objects.all()
    serializer_class = VideoLinkSerializer


class AdminVideoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/admin/videos/<id>/ - Obtiene el detalle de un video.
    PATCH/PUT /api/admin/videos/<id>/ - Actualiza el título o el enlace de YouTube.
    DELETE /api/admin/videos/<id>/ - Elimina un registro de video.
    """

    permission_classes = [IsPlatformAdmin]
    queryset = VideoLink.objects.all()
    serializer_class = VideoLinkSerializer
