from rest_framework.permissions import BasePermission


class IsPlatformAdmin(BasePermission):
    """
    Permiso personalizado que permite acceso únicamente a usuarios
    autenticados que tengan la marca is_platform_admin=True.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_platform_admin
        )
