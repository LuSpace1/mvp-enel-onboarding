from django.db.models import Avg
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsPlatformAdmin

from .models import GameRecord
from .serializers import GameSubmitSerializer


class GameSubmitView(generics.CreateAPIView):
    """
    POST /api/games/submit/
    Recibe el resultado del juego y lo asocia al usuario anónimo autenticado.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = GameSubmitSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdminKPIView(APIView):
    """
    GET /api/admin/kpis/
    Endpoint analítico que devuelve la data agregada de los UUIDs para RRHH:
    1. Índice de Preparación Global (promedio score).
    2. Precisión al Primer Intento (agrupado por game_id).
    3. Mapeo de Fricción / Drop-off (usuarios únicos completados por juego).
    """

    permission_classes = [IsPlatformAdmin]

    def get(self, request):
        # 1. Índice de Preparación Global
        avg_score = GameRecord.objects.aggregate(avg=Avg('score'))['avg']
        global_readiness_index = round(avg_score, 2) if avg_score is not None else 0.0

        # 2. Precisión al Primer Intento por game_id
        first_attempt_accuracy = {}
        for game_id in range(1, 5):
            records = GameRecord.objects.filter(game_id=game_id)
            total = records.count()
            first_try = records.filter(attempts=1).count()
            multiple_tries = total - first_try
            first_attempt_accuracy[f'game_{game_id}'] = {
                'total_records': total,
                'first_try_count': first_try,
                'multiple_tries_count': multiple_tries,
                'first_try_percentage': round((first_try / total) * 100, 2) if total > 0 else 0.0,
            }

        # 3. Mapeo de Fricción (Drop-off)
        friction_map = {}
        for game_id in range(1, 5):
            unique_completed = (
                GameRecord.objects.filter(game_id=game_id, completed=True)
                .values('user')
                .distinct()
                .count()
            )
            friction_map[f'game_{game_id}'] = unique_completed

        return Response({
            'global_readiness_index': global_readiness_index,
            'first_attempt_accuracy': first_attempt_accuracy,
            'friction_map': friction_map,
        }, status=status.HTTP_200_OK)
