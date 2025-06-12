document.addEventListener('DOMContentLoaded', function() {
    // Elementos da DOM
    const previewPhoto = document.getElementById('preview-photo');
    const previewHpValue = document.getElementById('preview-hp-value');
    const previewEnergyValue = document.getElementById('preview-energy-value');
    const previewHpBar = document.getElementById('preview-hp-bar');
    const previewEnergyBar = document.getElementById('preview-energy-bar');

    // Carregar dados iniciais
    function loadInitialData() {
        const savedPhoto = localStorage.getItem('characterPhoto');
        const savedHP = localStorage.getItem('characterHP') || '40 / 40';
        const savedEnergy = localStorage.getItem('characterEnergy') || '2 / 5';

        if (savedPhoto) previewPhoto.src = savedPhoto;
        updatePreviewValues(savedHP, savedEnergy);
    }

    // Atualizar visualização
    function updatePreviewValues(hp, energy) {
        previewHpValue.textContent = hp;
        previewEnergyValue.textContent = energy;
        
        // Atualizar barras
        const [hpCurrent, hpMax] = hp.split('/').map(Number);
        const [energyCurrent, energyMax] = energy.split('/').map(Number);
        
        previewHpBar.style.width = `${(hpCurrent / hpMax) * 100}%`;
        previewEnergyBar.style.width = `${(energyCurrent / energyMax) * 100}%`;
    }

    // Ouvir mensagens da janela principal
    window.addEventListener('message', function(event) {
        if (event.data.type === 'updateCharacter') {
            const { photo, hp, energy } = event.data.data;
            if (photo) previewPhoto.src = photo;
            updatePreviewValues(hp, energy);
        }
    });

    // Carregar dados ao iniciar
    loadInitialData();

    // Atualizar a cada segundo (fallback)
    setInterval(() => {
        const savedHP = localStorage.getItem('characterHP');
        const savedEnergy = localStorage.getItem('characterEnergy');
        if (savedHP !== previewHpValue.textContent || 
            savedEnergy !== previewEnergyValue.textContent) {
            updatePreviewValues(savedHP || '40 / 40', savedEnergy || '2 / 5');
        }
    }, 1000);
});