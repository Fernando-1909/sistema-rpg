# fichas/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.contrib.auth import authenticate, login as auth_login
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import get_user_model
from .models import Campaign, CharacterSheet
import json, traceback

User = get_user_model()  # pega CustomUser

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

@login_required
def listar_fichas(request, campaign_id=None):
    if request.user.is_superuser:
        fichas = CharacterSheet.objects.filter(campaign_id=campaign_id) if campaign_id else CharacterSheet.objects.all()
        campanhas = Campaign.objects.all()
    else:
        fichas = CharacterSheet.objects.filter(player=request.user, campaign_id=campaign_id) if campaign_id else CharacterSheet.objects.filter(player=request.user)
        campanhas = Campaign.objects.all()

    return render(request, 'fichas.html', {
        'fichas': fichas,
        'campanhas': campanhas
    })

@login_required
def visualizar_ficha(request, ficha_id):
    # Debug inicial
    print("\n=== DEBUG visualizar_ficha ===")
    print(f"Ficha ID solicitada: {ficha_id}")
    print(f"Usuário atual: {request.user}")
    print(f"Superusuário? {request.user.is_superuser}")

    try:
        # Debug antes da query
        print("\nAntes da consulta no banco...")
        
        ficha = get_object_or_404(
            CharacterSheet,
            id=ficha_id,
            player=request.user if not request.user.is_superuser else None
        )
        
        # Debug após encontrar a ficha
        print("\nFicha encontrada com sucesso!")
        print(f"ID: {ficha.id}")
        print(f"Nome: {ficha.name}")
        print(f"Jogador: {ficha.player}")
        print(f"Campanha: {ficha.campaign.nome if ficha.campaign else 'Nenhuma'}")
        print(f"Foto: {'Sim' if ficha.photo else 'Não'}")
        
        # Debug das perícias
        print("\nProcessando perícias...")
        if ficha.skills:
            try:
                skills = eval(ficha.skills)
                print("Perícias (eval):", skills)
            except Exception as e:
                print(f"Erro ao avaliar perícias: {str(e)}")
                skills = [{'name': ficha.skills, 'value': ''}]
                print("Perícias (fallback):", skills)
        else:
            skills = []
            print("Nenhuma perícia cadastrada")

        # Debug final antes do retorno
        print("\nRetornando render...")
        return render(request, 'partials/ficha_detalhes.html', {
            'ficha': ficha,
            'skills': skills
        })
        
    except Exception as e:
        print(f"\n=== ERRO CRÍTICO ===")
        print(f"Tipo: {type(e).__name__}")
        print(f"Mensagem: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise


@login_required
def criar_ficha(request):
    if request.method == 'POST':
        try:
            ficha = CharacterSheet(
                player=request.user,
                name=request.POST.get('name'),
                race=request.POST.get('race'),
                char_class=request.POST.get('char_class'),
                weapon=request.POST.get('weapon'),
                element=request.POST.get('element'),
                strength=request.POST.get('strength'),
                vitality=request.POST.get('vitality'),
                agility=request.POST.get('agility'),
                charisma=request.POST.get('charisma'),
                intelligence=request.POST.get('intelligence'),
                hp=request.POST.get('hp'),
                speed=request.POST.get('speed'),
                energy=request.POST.get('energy'),
                opinion=request.POST.get('opinion'),
                skills=request.POST.get('skills'),
                photo=request.FILES.get('photo') 
            )

            campaign_id = request.POST.get('campaign_id')
            if campaign_id:
                try:
                    ficha.campaign = Campaign.objects.get(id=int(campaign_id))
                except (Campaign.DoesNotExist, ValueError):
                    ficha.campaign = None  # evita crash e deixa sem campanha


            ficha.save()

            return redirect('listar_fichas', campaign_id=ficha.campaign.id if ficha.campaign else 0)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    return HttpResponseBadRequest('Método não permitido')

@login_required
def editar_ficha(request, ficha_id):
    ficha = get_object_or_404(CharacterSheet, id=ficha_id)
    
    if not (request.user.is_superuser or ficha.player == request.user):
        return HttpResponseForbidden("Sem permissão")

    if request.method == 'POST':
        try:
            # Atualiza os campos da ficha
            ficha.name = request.POST.get('name', ficha.name)
            ficha.race = request.POST.get('race', ficha.race)
            ficha.char_class = request.POST.get('char_class', ficha.char_class)
            ficha.weapon = request.POST.get('weapon', ficha.weapon)
            ficha.element = request.POST.get('element', ficha.element)
            ficha.strength = request.POST.get('strength', ficha.strength)
            ficha.vitality = request.POST.get('vitality', ficha.vitality)
            ficha.agility = request.POST.get('agility', ficha.agility)
            ficha.charisma = request.POST.get('charisma', ficha.charisma)
            ficha.intelligence = request.POST.get('intelligence', ficha.intelligence)
            ficha.hp = request.POST.get('hp', ficha.hp)
            ficha.speed = request.POST.get('speed', ficha.speed)
            ficha.energy = request.POST.get('energy', ficha.energy)
            ficha.opinion = request.POST.get('opinion', ficha.opinion)
            ficha.skills = request.POST.get('skills', ficha.skills)

            # Atualiza campanha se necessário
            campaign_id = request.POST.get('campaign_id')
            if campaign_id:
                ficha.campaign = Campaign.objects.get(id=campaign_id)

            # Salva a foto se foi enviada
            if 'photo' in request.FILES:
                ficha.photo = request.FILES['photo']
            
            ficha.save()
            return redirect('visualizar_ficha', ficha_id=ficha.id)
        
        except Exception as e:
            error_message = f"Erro ao editar: {str(e)}"
            return render(request, 'fichas.html', {
                'error': error_message,
                'fichas': CharacterSheet.objects.filter(player=request.user),
                'campanhas': Campaign.objects.all()
            })

    # Se for GET, mostra o formulário preenchido
    return render(request, 'fichas.html', {
        'editar_mode': True,
        'ficha_edit': ficha,
        'fichas': CharacterSheet.objects.filter(player=request.user),
        'campanhas': Campaign.objects.all()
    })