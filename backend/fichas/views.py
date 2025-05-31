from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def home(request):
    return render(request, 'index.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)  # Faz login
            return redirect('/campanhas')  # Redireciona corretamente
        else:
            # Retorna com mensagem de erro se falhar
            return render(request, 'login.html', {'error': 'Usuário ou senha incorretos.'})
    return render(request, 'login.html')  # GET normal

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

def campanhas(request):
    if not request.user.is_authenticated:
        return redirect('/login/')
    return render(request, 'campanhas.html')
