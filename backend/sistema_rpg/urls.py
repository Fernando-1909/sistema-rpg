from django.contrib import admin
from django.urls import path
from fichas.views import home, login, registrar_usuario, campanhas  # importe direto as views
from django.conf import settings
from django.conf.urls.static import static
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='fichas_home'),  
    path('login/', login, name='fichas_login'),
    path('api/registrar/', registrar_usuario, name='registrar_usuario'),
    path('campanhas/', campanhas, name='campanhas'),
]

if settings.DEBUG:
    urlpatterns += static('/css/', document_root=os.path.join(settings.BASE_DIR, '../frontend/css'))
    urlpatterns += static('/js/', document_root=os.path.join(settings.BASE_DIR, '../frontend/js'))
    urlpatterns += static('/assets/', document_root=os.path.join(settings.BASE_DIR, '../frontend/assets'))
