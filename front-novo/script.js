document.addEventListener('DOMContentLoaded', function() {
    // Contadores para novas perícias e ataques
    let skillCounter = 2;
    let attackCounter = 1;

    // ========== [1. SISTEMA DE FOTO] ========== //
    const photoUpload = document.getElementById('character-photo-upload');
    const photoPreview = document.getElementById('character-photo-preview');
    const photoPlaceholder = document.querySelector('.photo-placeholder');

    // Carregar foto salva ao iniciar
    const savedPhoto = localStorage.getItem('characterPhoto');
    if (savedPhoto) {
        photoPreview.src = savedPhoto;
        photoPreview.style.display = 'block';
        photoPlaceholder.style.display = 'none';
    }

    // Upload de nova foto
    photoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                photoPreview.src = event.target.result;
                photoPreview.style.display = 'block';
                photoPlaceholder.style.display = 'none';
                localStorage.setItem('characterPhoto', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // ========== [2. BARRAS DE HP/ENERGIA] ========== //
    const hpValueElement = document.getElementById('hp-value');
    const energyValueElement = document.getElementById('energy-value');

    // Carregar valores salvos ao iniciar
    const savedHP = localStorage.getItem('characterHP');
    const savedEnergy = localStorage.getItem('characterEnergy');
    
    if (savedHP) hpValueElement.textContent = savedHP;
    if (savedEnergy) energyValueElement.textContent = savedEnergy;

    // Função para atualizar barras
    function updateBar(targetId, change = 0) {
        const element = document.getElementById(targetId);
        let [current, max] = element.textContent.split('/').map(Number);
        
        // Aplicar mudança se houver
        if (change !== 0) {
            current = Math.max(0, Math.min(current + change, max));
            element.textContent = `${current} / ${max}`;
            localStorage.setItem(`character${targetId.replace('-value', '').toUpperCase()}`, `${current} / ${max}`);
        }
        
        // Atualizar a barra correspondente
        const percent = (current / max) * 100;
        if (targetId === 'hp-value') {
            document.getElementById('hp-bar').style.width = `${percent}%`;
        } else if (targetId === 'energy-value') {
            document.getElementById('energy-bar').style.width = `${percent}%`;
        }
    }

    // Event listeners para os botões de seta
    document.querySelectorAll('.arrow-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const isPlus = this.classList.contains('plus');
            updateBar(target, isPlus ? 1 : -1);
        });
    });

    // Permitir edição manual dos valores
    function setupEditableValue(element) {
        element.addEventListener('click', function() {
            const currentText = this.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'editable';
            
            this.textContent = '';
            this.appendChild(input);
            input.focus();
            
            input.addEventListener('blur', function() {
                const parent = this.parentElement;
                // Validar formato X/X
                if (/^\d+\s*\/\s*\d+$/.test(this.value)) {
                    parent.textContent = this.value;
                    const targetId = parent.id;
                    localStorage.setItem(`character${targetId.replace('-value', '').toUpperCase()}`, this.value);
                    updateBar(targetId);
                } else {
                    parent.textContent = currentText; // Reverter se formato inválido
                }
            });
            
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    this.blur();
                }
            });
        });
    }

    setupEditableValue(hpValueElement);
    setupEditableValue(energyValueElement);

    // ========== [3. PERÍCIAS] ========== //
    document.getElementById('add-skill').addEventListener('click', function() {
        skillCounter++;
        const skillsList = document.querySelector('.skills-list');
        
        const newSkill = document.createElement('div');
        newSkill.className = 'skill';
        newSkill.innerHTML = `
            <label for="skill-${skillCounter}">Nome da perícia</label>
            <input type="text" id="skill-${skillCounter}" class="editable" value="Nova Perícia">
            <input type="text" class="skill-value editable" value="+0">
        `;
        
        skillsList.insertBefore(newSkill, this);
    });

    // ========== [4. ATAQUES] ========== //
    document.getElementById('add-attack').addEventListener('click', function() {
        attackCounter++;
        const attacksList = document.querySelector('.attacks-list');
        
        const newAttack = document.createElement('div');
        newAttack.className = 'attack';
        newAttack.innerHTML = `
            <div class="attack-name">
                <label for="attack-${attackCounter}">Nome do ataque</label>
                <input type="text" id="attack-${attackCounter}" class="editable" value="Novo Ataque">
            </div>
            <div class="attack-details">
                <div class="form-group">
                    <label for="attack-${attackCounter}-dmg">Dano</label>
                    <input type="text" id="attack-${attackCounter}-dmg" class="editable" value="1d6">
                </div>
                <div class="form-group">
                    <label for="attack-${attackCounter}-type">Tipo</label>
                    <input type="text" id="attack-${attackCounter}-type" class="editable" value="Normal">
                </div>
            </div>
            <div class="attack-desc">
                <label for="attack-${attackCounter}-desc">Descrição</label>
                <textarea id="attack-${attackCounter}-desc" class="editable">Descrição do ataque</textarea>
            </div>
        `;
        
        attacksList.insertBefore(newAttack, this);
    });

    // ========== [5. CONTROLES PRINCIPAIS] ========== //
    
const previewBtn = document.createElement('button'); // Mudamos de <a> para <button>
previewBtn.className = 'btn btn-gradient';
previewBtn.textContent = 'Visualizar Personagem';
previewBtn.addEventListener('click', function() {
    // Salva os dados atuais antes de abrir a visualização
    saveCharacterData();
    // Abre em nova aba
    window.open('preview.html', '_blank');
});
document.querySelector('.sheet-actions').prepend(previewBtn);

// Função para salvar dados atualizada
function saveCharacterData() {
    // Salvar foto
    const photoPreview = document.getElementById('character-photo-preview');
    if (photoPreview.src) {
        localStorage.setItem('characterPhoto', photoPreview.src);
    }
    
    // Salvar HP
    const hpValue = document.getElementById('hp-value').textContent;
    localStorage.setItem('characterHP', hpValue);
    
    // Salvar Energia
    const energyValue = document.getElementById('energy-value').textContent;
    localStorage.setItem('characterEnergy', energyValue);
    
    // Atualizar a visualização se já estiver aberta
    if (window.previewWindow && !window.previewWindow.closed) {
        window.previewWindow.postMessage({
            type: 'updateCharacter',
            data: {
                photo: photoPreview.src,
                hp: hpValue,
                energy: energyValue
            }
        }, '*');
    }
}

// Adicione este listener para atualização em tempo real
window.addEventListener('beforeunload', function() {
    saveCharacterData();
});
    // Salvar ficha
    document.getElementById('save-sheet').addEventListener('click', function() {
        // Salvar todos os dados necessários
        localStorage.setItem('characterHP', hpValueElement.textContent);
        localStorage.setItem('characterEnergy', energyValueElement.textContent);
        
        if (photoPreview.src) {
            localStorage.setItem('characterPhoto', photoPreview.src);
        }
        
        alert('Ficha salva com sucesso! As alterações serão refletidas na visualização.');
    });

    // Resetar ficha
    document.getElementById('reset-sheet').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja resetar a ficha? Todos os dados serão perdidos.')) {
            // Resetar campos editáveis
            document.querySelectorAll('.editable').forEach(input => {
                input.value = input.defaultValue;
            });
            
            // Resetar valores especiais
            hpValueElement.textContent = '40 / 40';
            energyValueElement.textContent = '2 / 5';
            
            // Resetar foto
            photoPreview.src = '';
            photoPreview.style.display = 'none';
            photoPlaceholder.style.display = 'block';
            localStorage.removeItem('characterPhoto');
            
            // Atualizar barras
            updateBar('hp-value');
            updateBar('energy-value');
            
            // Limpar localStorage
            localStorage.removeItem('characterHP');
            localStorage.removeItem('characterEnergy');
        }
    });

    // ========== [INICIALIZAÇÃO] ========== //
    // Atualizar barras ao carregar
    updateBar('hp-value');
    updateBar('energy-value');
});