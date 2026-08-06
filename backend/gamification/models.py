from django.db import models

from users.models import CustomUser


class GameRecord(models.Model):
    GAME_CHOICES = [
        (1, "Juego 1"),
        (2, "Juego 2"),
        (3, "Juego 3"),
        (4, "Juego 4"),
        (5, "Juego 5"),
    ]

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="game_records",
        verbose_name="Usuario",
    )
    game_id = models.IntegerField(
        choices=GAME_CHOICES, db_index=True, verbose_name="ID de Juego"
    )
    score = models.FloatField(verbose_name="Puntaje")
    attempts = models.IntegerField(default=1, verbose_name="Intentos")
    completed = models.BooleanField(default=False, verbose_name="Completado")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Registro de Juego"
        verbose_name_plural = "Registros de Juego"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Usuario {self.user.username} - Juego {self.game_id} (Puntaje: {self.score})"
