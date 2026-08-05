from rest_framework import serializers

from .models import GameRecord


class GameSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRecord
        fields = ['game_id', 'score', 'attempts', 'completed']

    def validate_game_id(self, value):
        if value not in [1, 2, 3, 4]:
            raise serializers.ValidationError("El game_id debe ser 1, 2, 3 o 4.")
        return value

    def validate_score(self, value):
        if not (0.0 <= value <= 100.0):
            raise serializers.ValidationError("El score debe estar entre 0 y 100.")
        return value
