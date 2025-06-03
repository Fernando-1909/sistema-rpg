from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # Adiciona o campo de imagem na parte dos dados pessoais
    fieldsets = UserAdmin.fieldsets + (
        ('Foto de Perfil', {'fields': ('photo',)}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
