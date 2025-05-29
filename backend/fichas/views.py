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

@csrf_exempt  # Decorador correto (sem o 'd' no final)
def registrar_usuario(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))  # Adicionado decode
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            if not all([username, password, email]):  # Validação adicional
                return JsonResponse({'error': 'Todos os campos são obrigatórios.'}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Usuário já existe.'}, status=400)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_staff=False,
                is_superuser=False
            )
            return JsonResponse({'success': True, 'user_id': user.id})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON inválido'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método inválido'}, status=405)

def campanhas(request):
    if not request.user.is_authenticated:
        return redirect('/login/')
    return render(request, 'campanhas.html')
