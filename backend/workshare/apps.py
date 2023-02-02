from django.apps import AppConfig


class WorkshareConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'workshare'

    def ready(self):
        import workshare.signals
