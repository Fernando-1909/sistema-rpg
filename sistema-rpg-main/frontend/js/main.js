// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Efeito de hover nos cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.animation = 'fadeIn 0.5s forwards';
    });
    
    // Exemplo de uso:
    // showToast('Bem-vindo ao RPG Manager!', 'success');
});