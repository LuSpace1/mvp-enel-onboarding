from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import AnonymousAuthSerializer


class AnonymousAuthView(APIView):
    """
    POST /api/auth/anonymous/
    Recibe el identificador del navegador, crea o recupera al trabajador
    y devuelve los datos de acceso.
    """

    permission_classes = []

    def post(self, request):
        serializer = AnonymousAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data, status=status.HTTP_200_OK)


class AdminAuthView(TokenObtainPairView):
    """
    POST /api/auth/admin/
    Entrada con usuario y contraseña exclusiva para administradores.
    """

    permission_classes = []
