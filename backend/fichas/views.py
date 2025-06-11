# fichas/views.py

from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login as auth_login
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import get_user_model
from .models import Campaign
import json
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404

User = get_user_model()  # pega seu CustomUser

def home(request):
    return render(request, 'index.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)
            return redirect('/campanhas')
        else:
            return render(request, 'login.html', {'error': 'Usuário ou senha incorretos.'})

    return render(request, 'login.html')

@csrf_exempt
def registrar_usuario(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not all([username, email, password]):
            return JsonResponse({'error': 'Todos os campos são obrigatórios.'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Usuário já existe.'}, status=400)

        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            return JsonResponse({'success': True, 'user_id': user.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método não permitido.'}, status=405)

@login_required
def campanhas(request):
    campanhas = Campaign.objects.all()  # Busca todas as campanhas
    return render(request, 'campanhas.html', {'campanhas': campanhas})

@login_required
def listar_campanhas(request):
    campanhas = Campaign.objects.all()  # já pega do banco MySQL
    
    context = {
        'campanhas': campanhas,
        'is_admin': request.user.is_superuser,
    }
    
    return render(request, 'campanhas.html', context)


@login_required
def user_info(request):
    return JsonResponse({
        'is_authenticated': request.user.is_authenticated,
        'is_admin': request.user.is_superuser,
        'username': request.user.username,
    })


@csrf_exempt
@login_required
@user_passes_test(lambda u: u.is_superuser)
def criar_campanha(request):
    print("View criar_campanha acessada. Método:", request.method)
    if request.method == 'POST':
        nome = request.POST.get('nome')
        sistema = request.POST.get('sistema')
        imagem = request.FILES.get('imagem')
        descricao = request.POST.get('descricao')

        if not nome or not sistema:
            return HttpResponseBadRequest("Nome e sistema são obrigatórios.")

        campanha = Campaign(
            player=request.user,
            nome=nome,
            sistema=sistema,
            imagem=imagem,
            descricao=descricao
        )
        campanha.save()
        return JsonResponse({'success': True})

    return HttpResponseBadRequest("Método não permitido.")

@csrf_exempt
@login_required
def character_sheet(request):
