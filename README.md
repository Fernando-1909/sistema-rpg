# Sistema de RPG com Django e MySQL

Este é um sistema de gerenciamento de fichas de RPG desenvolvido com Django, utilizando MySQL como banco de dados e um painel administrativo integrado.

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes itens instalados:

- Python 3.10 ou superior
- MySQL Server
- pip (gerenciador de pacotes do Python)
- Visual Studio Build Tools (no Windows, para compilar mysqlclient)
- Git (opcional, para versionamento)

---

## 1. Clonar o projeto ou copiar os arquivos

Coloque os arquivos do projeto em uma pasta local, com a seguinte estrutura:

```
backend/
frontend/
```

---

## 2. Criar o banco de dados no MySQL

Abra seu terminal MySQL (ou use phpMyAdmin) e execute:

```sql
CREATE DATABASE rpg_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> Dica: você pode usar outro nome, mas precisará atualizá-lo no arquivo `.env`.

---

## 3. Configurar o ambiente virtual

Dentro da pasta `backend/`, crie e ative um ambiente virtual:

### Windows:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

### Linux/Mac:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

---

## 4. Instalar as dependências

Com o ambiente virtual ativado:

```bash
pip install -r requirements.txt
```

---

## 5. Criar e configurar o arquivo `.env`

Na raiz da pasta `backend/`, crie um arquivo `.env` com as seguintes variáveis:

```env
SECRET_KEY=uma-chave-secreta
MYSQL_DATABASE=rpg_db
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha
MYSQL_HOST=localhost
MYSQL_PORT=3306
```

> Substitua `sua_senha` pela senha real do seu usuário MySQL.

---

## 6. Aplicar as migrações (criar tabelas)

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 7. Criar um superusuário para o admin

```bash
python manage.py createsuperuser
```

Siga as instruções para definir o nome de usuário, email e senha.

---

## 8. Rodar o servidor local

```bash
python manage.py runserver
```

---

## 9. Acessar o sistema

- Painel administrativo: http://localhost:8000/admin  
  (Use o usuário criado com `createsuperuser`)

- Front-end estático (HTML/CSS/JS): http://localhost:8000/index.html  
  (desde que os arquivos estejam na pasta `frontend/`, como configurado em `STATICFILES_DIRS`)

- API de fichas (GET): http://localhost:8000/api/fichas/

---

## Observações

- Para adicionar mais funcionalidades à API (como POST, PUT, DELETE), você pode expandir as views ou usar Django REST Framework.
- O painel admin permite criar, editar e excluir fichas de forma segura e rápida.
- O sistema suporta tema escuro/claro via CSS e botão no frontend.

---

## Autor

Desenvolvido por Fernando Macedo.
