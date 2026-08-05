from django.contrib import admin

from .models import GameRecord


@admin.register(GameRecord)
class GameRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'game_id', 'score', 'attempts', 'completed', 'created_at')
    list_filter = ('game_id', 'completed', 'created_at')
    search_fields = ('user__username',)
