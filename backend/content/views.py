from rest_framework import generics

from users.permissions import IsPlatformAdmin

from .models import VideoLink
from .serializers import VideoLinkSerializer


class AdminVideoListCreateView(generics.ListCreateAPIView):
    """
    GET /api/admin/videos/ - Lista los enlaces de videos para administración.
    POST /api/admin/videos/ - Crea un nuevo registro de enlace de video.
    """

    permission_classes = [IsPlatformAdmin]
    queryset = VideoLink.objects.all()
    serializer_class = VideoLinkSerializer


class AdminVideoDetailView(generics.RetrieveUpdateAPIView):
    """
    GET /api/admin/videos/<id>/ - Obtiene el detalle de un video.
    PATCH/PUT /api/admin/videos/<id>/ - Actualiza un enlace de YouTube.
    """

    permission_classes = [IsPlatformAdmin]
    queryset = VideoLink.objects.all()
    serializer_class = VideoLinkSerializer
