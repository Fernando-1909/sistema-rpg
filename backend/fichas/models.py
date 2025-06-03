import os
from django.db import models
from django.contrib.auth.models import AbstractUser
from sistema_rpg.settings import MEDIA_URL


# Função para salvar as imagens na pasta desejada dentro do frontend
def salvar_no_assets(instance, filename):
    return os.path.join('frontend', 'assets', 'images', filename)


# Usuário customizado com foto
class CustomUser(AbstractUser):
    photo = models.ImageField(upload_to=salvar_no_assets, blank=True, null=True)

    def __str__(self):
        return self.username


# Campanha do jogador
class Campaign(models.Model):
    player = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='campaigns')
    nome = models.CharField(max_length=100) 
    sistema = models.CharField(max_length=100)
    imagem = models.ImageField(upload_to= '', blank=True, null=True)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nome


# Ficha de personagem
class CharacterSheet(models.Model):
    player = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sheets')
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, blank=True, null=True, related_name='sheets')
    name = models.CharField(max_length=100)
    race = models.CharField(max_length=50)
    char_class = models.CharField(max_length=50)
    weapon = models.CharField(max_length=50, blank=True, null=True)
    element = models.CharField(max_length=50, blank=True, null=True)
    strength = models.IntegerField(blank=True, null=True)
    vitality = models.IntegerField(blank=True, null=True)
    agility = models.IntegerField(blank=True, null=True)
    charisma = models.IntegerField(blank=True, null=True)
    intelligence = models.IntegerField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    hp = models.IntegerField(blank=True, null=True)
    speed = models.IntegerField(blank=True, null=True)
    energy = models.IntegerField(blank=True, null=True)
    opinion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.player.username})"


# Bestiário da campanha
class Bestiary(models.Model):
    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to=salvar_no_assets, blank=True, null=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='bestiaries')

    def __str__(self):
        return self.name


# Monstro do bestiário
class Monster(models.Model):
    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to=salvar_no_assets, blank=True, null=True)
    classification = models.CharField(max_length=50, blank=True, null=True)
    bestiary = models.ForeignKey(Bestiary, on_delete=models.CASCADE, related_name='monsters')

    def __str__(self):
        return self.name
