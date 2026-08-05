from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'username',
        'first_name',
        'last_name',
        'second_last_name',
        'worker_type',
        'is_platform_admin',
        'is_active',
    )
    list_filter = ('is_platform_admin', 'worker_type', 'is_active')
    search_fields = ('username', 'first_name', 'last_name')
    fieldsets = UserAdmin.fieldsets + (
        (
            'Información Adicional',
            {
                'fields': (
                    'second_last_name',
                    'worker_type',
                    'is_platform_admin',
                )
            },
        ),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            'Información Adicional',
            {
                'fields': (
                    'first_name',
                    'last_name',
                    'second_last_name',
                    'worker_type',
                    'is_platform_admin',
                )
            },
        ),
    )
