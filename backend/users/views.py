from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CustomUser
from .permissions import IsPlatformAdmin
from .serializers import (
    UserCreateSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


class UserProfileView(APIView):
    """GET /api/auth/me/ - Retorna la información del usuario autenticado."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class AdminUserListCreateView(generics.ListCreateAPIView):
    """
    GET /api/admin/users/ - Lista a todos los trabajadores.
    POST /api/admin/users/ - Registra un trabajador y retorna su contraseña autogenerada.
    """

    permission_classes = [IsPlatformAdmin]
    queryset = CustomUser.objects.all().order_by('-id')

    def get_serializer_class(self):
        return UserCreateSerializer if self.request.method == 'POST' else UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, generated_password = serializer.save()

        response_data = UserSerializer(user).data
        response_data['generated_password'] = generated_password
        return Response(response_data, status=status.HTTP_201_CREATED)


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    """
    GET /api/admin/users/<id>/ - Detalle de trabajador.
    PATCH/PUT /api/admin/users/<id>/ - Actualiza información o alterna is_active.
    """

    permission_classes = [IsPlatformAdmin]
    queryset = CustomUser.objects.all()

    def get_serializer_class(self):
        return UserUpdateSerializer if self.request.method in ['PUT', 'PATCH'] else UserSerializer


class AdminUserResetPasswordView(APIView):
    """POST /api/admin/users/<id>/reset-password/ - Regenera contraseña aleatoria."""

    permission_classes = [IsPlatformAdmin]

    def post(self, request, pk):
        user = generics.get_object_or_404(CustomUser, pk=pk)
        new_password = user.reset_password()
        return Response({
            'id': user.id,
            'username': user.username,
            'generated_password': new_password,
            'message': 'Contraseña reiniciada exitosamente.',
        })
