import os
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('fichas.urls')),  # Sua API ou outras rotas
    path('', TemplateView.as_view(template_name='index.html'), name='home'),  # Serve seu index.html como home
]

if settings.DEBUG:
    urlpatterns += static('/css/', document_root=os.path.join(settings.BASE_DIR, '../frontend/css'))
    urlpatterns += static('/js/', document_root=os.path.join(settings.BASE_DIR, '../frontend/js'))
    urlpatterns += static('/assets/', document_root=os.path.join(settings.BASE_DIR, '../frontend/assets'))
