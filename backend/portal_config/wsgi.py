"""
Configuración WSGI para el proyecto portal_config.

Expone el objeto WSGI como una variable de módulo llamada ``application``.

Para más información sobre este archivo, consulta:
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portal_config.settings')

application = get_wsgi_application()
