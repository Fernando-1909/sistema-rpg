from django.contrib import admin
from django.urls import path
from fichas.views import ( # importar direto as views
    home, 
    login, 
    registrar_usuario,
    campanhas, 
    user_info, 
    listar_campanhas, 
    criar_campanha, 
    listar_fichas,
    criar_ficha,
    visualizar_ficha,
    editar_ficha     
)

from django.conf import settings
from django.conf.urls.static import static
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='fichas_home'),  
    path('login/', login, name='fichas_login'),
    path('registrar/', registrar_usuario, name='registrar_usuario'),
    path('campanhas/', campanhas, name='campanhas'),
    path('campanhas/listar/', listar_campanhas),
    path('campanhas/criar/', criar_campanha, name='criar_campanha'),
    path('fichas/<int:campaign_id>/', listar_fichas, name='listar_fichas'),
    #path('ficha/novo/', criar_ficha, name='criar_ficha'),
    path('ficha/<int:ficha_id>/', visualizar_ficha, name='visualizar_ficha'),
    path('fichas/editar/', editar_ficha, name='editar_ficha'),  # Para criação
    path('fichas/editar/<int:ficha_id>/', editar_ficha, name='editar_ficha'),
    path('user-info/', user_info),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static('/css/', document_root=os.path.join(settings.BASE_DIR, '../frontend/css'))
    urlpatterns += static('/js/', document_root=os.path.join(settings.BASE_DIR, '../frontend/js'))
    urlpatterns += static('/assets/', document_root=os.path.join(settings.BASE_DIR, '../frontend/assets'))
    urlpatterns += static('/assets/', document_root=os.path.join(settings.BASE_DIR, '../frontend/assets/images'))
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
