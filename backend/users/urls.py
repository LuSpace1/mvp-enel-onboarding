from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    AdminUserDetailView,
    AdminUserListCreateView,
    AdminUserResetPasswordView,
    UserProfileView,
)

urlpatterns = [
    # Autenticación y Perfil
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', UserProfileView.as_view(), name='user_profile'),
    # Administración de Usuarios (Protegido Admin)
    path('admin/users/', AdminUserListCreateView.as_view(), name='admin_users_list_create'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
    path(
        'admin/users/<int:pk>/reset-password/',
        AdminUserResetPasswordView.as_view(),
        name='admin_user_reset_password',
    ),
]
