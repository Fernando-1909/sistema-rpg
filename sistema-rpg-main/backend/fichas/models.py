from django.db import models
from django.contrib.auth.models import User  # Importa o User padrão do Django

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)  # Permite null/blank temporariamente
    name = models.CharField(max_length=100)
    photo = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Campaign(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='campaigns')
    name = models.CharField(max_length=100)
    photo = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


class CharacterSheet(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='sheets')
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
        return f"{self.name} ({self.player.name})"


class Bestiary(models.Model):
    name = models.CharField(max_length=100)
    photo = models.CharField(max_length=255, blank=True, null=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='bestiaries')

    def __str__(self):
        return self.name


class Monster(models.Model):
    name = models.CharField(max_length=100)
    photo = models.CharField(max_length=255, blank=True, null=True)
    classification = models.CharField(max_length=50, blank=True, null=True)
    bestiary = models.ForeignKey(Bestiary, on_delete=models.CASCADE, related_name='monsters')

    def __str__(self):
        return self.name
