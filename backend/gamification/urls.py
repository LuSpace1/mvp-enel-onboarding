from django.urls import path

from .views import AdminKPIView, GameSubmitView

urlpatterns = [
    path('games/submit/', GameSubmitView.as_view(), name='game_submit'),
    path('admin/kpis/', AdminKPIView.as_view(), name='admin_kpis'),
]
