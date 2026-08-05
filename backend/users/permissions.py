from rest_framework.permissions import BasePermission


class IsPlatformAdmin(BasePermission):
    """
    Permite el acceso solo a los administradores de la plataforma.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_platform_admin
        )
