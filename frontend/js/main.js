// Toast Notifications melhorado
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('data-theme-fix', 'true'); // Para correção de tema
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <div class="toast-progress"></div>
    `;
    
    document.body.appendChild(toast);
    
    // Barra de progresso
    const progress = toast.querySelector('.toast-progress');
    progress.style.animation = 'progress 3s linear forwards';
    
    // Remoção suave
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

// Inicialização melhorada
document.addEventListener('DOMContentLoaded', () => {
    // Efeito de entrada nos cards
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.5s forwards ${index * 0.1}s`;
    });
    
    // Verificar elementos com problemas de contraste
    checkContrastIssues();
});

// Verificar problemas de contraste
function checkContrastIssues() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const problematicElements = document.querySelectorAll(`
        .footer-links a,
        .footer-contact li,
        .nav-link,
        .btn-secondary
    `);
    
    problematicElements.forEach(el => {
        el.setAttribute('data-theme-fix', 'true');
        if (currentTheme === 'light') {
            el.style.color = '';
        }
    });
}

// Função para registrar usuário
async function registerUser(formData) {
    try {
        const response = await fetch('/registrar_usuario/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        const data = await handleApiResponse(response);
        
        showToast('Cadastro realizado com sucesso!', 'success');
        setTimeout(() => window.location.href = '/campanhas', 1500);
        
        return data;
    } catch (error) {
        console.error('Erro no cadastro:', error);
        // O toast já foi mostrado pela handleApiResponse
        throw error;
    }
}
