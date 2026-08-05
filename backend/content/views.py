from rest_framework import generics

from users.permissions import IsPlatformAdmin

from .models import VideoLink
from .serializers import VideoLinkSerializer


class AdminVideoListCreateView(generics.ListCreateAPIView):
    """
    GET /api/admin/videos/ - Muestra los videos de la plataforma.
    POST /api/admin/videos/ - Agrega un video nuevo.
    """

    permission_classes = [IsPlatformAdmin]
    queryset = VideoLink.objects.all()
    serializer_class = VideoLinkSerializer


class AdminVideoDetailView(generics.RetrieveUpdateAPIView):
    """
    GET /api/admin/videos/<id>/ - Muestra el detalle de un video.
    PATCH/PUT /api/admin/videos/<id>/ - Actualiza el enlace de YouTube.
    """

    permission_classes = [IsPlatformAdmin]
    queryset = VideoLink.objects.all()
    serializer_class = VideoLinkSerializer
