from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.crypto import get_random_string


class CustomUser(AbstractUser):
    WORKER_TYPE_CHOICES = [
        ('Interno', 'Interno'),
        ('Externo/Contratista', 'Externo/Contratista'),
    ]

    username = models.CharField(
        max_length=150,
        unique=True,
        db_index=True,
        help_text="RUT o identificador único del usuario.",
    )
    first_name = models.CharField(max_length=150, verbose_name="Nombres")
    last_name = models.CharField(max_length=150, verbose_name="Apellido paterno")
    second_last_name = models.CharField(
        max_length=150, blank=True, default="", verbose_name="Apellido materno"
    )
    is_platform_admin = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Define si el usuario tiene acceso al dashboard para gestionar cuentas y contenido.",
    )
    worker_type = models.CharField(
        max_length=50,
        choices=WORKER_TYPE_CHOICES,
        default='Interno',
        db_index=True,
        verbose_name="Relación laboral",
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Habilita/deshabilita el acceso al portal.",
    )

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ['-id']

    def __str__(self):
        return f"{self.username} - {self.first_name} {self.last_name}"

    @staticmethod
    def generate_random_password(length=8):
        """Genera una contraseña aleatoria de 8 caracteres alfanuméricos."""
        return get_random_string(
            length=length,
            allowed_chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        )

    def reset_password(self):
        """Regenera y guarda una nueva contraseña para el usuario."""
        new_password = self.generate_random_password()
        self.set_password(new_password)
        self.save(update_fields=['password'])
        return new_password
