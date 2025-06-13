document.addEventListener('DOMContentLoaded', function() {
    // ========== [0. MODAL DE CRIAÇÃO DE FICHA] ========== //
    const createSheetBtn = document.getElementById('create-sheet-btn');
    const modal = document.getElementById('create-sheet-modal');
    const closeModal = document.querySelector('.close-modal');

    // Abrir modal
    if (createSheetBtn) {
        createSheetBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });
    }

    // Fechar modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Fechar ao clicar 
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
        if (createSheetBtn) {
    createSheetBtn.addEventListener('click', () => {
        console.log('Botão clicado!'); // Debug
        modal.classList.add('show');
        console.log('Modal deve estar visível agora'); // Debug
        });
    }
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });

    // Envio do formulário de nova ficha
    // Envio do formulário de nova ficha/edição

// Envio do formulário de nova ficha/edição
const newSheetForm = document.getElementById('new-sheet-form');
if (newSheetForm) {
    newSheetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Cria um FormData com os dados do formulário
        const formData = new FormData(this);
        
        // Envia via fetch (sem AJAX, mas mantendo na mesma página)
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (response.ok) {
                // Fecha o modal e mostra mensagem sem recarregar
                document.getElementById('create-sheet-modal').classList.remove('show');
                alert('Alterações salvas com sucesso!');
                
                // Atualiza os dados na página se necessário
                if (window.updateFichaList) {
                    updateFichaList();
                }
            } else {
                alert('Erro ao salvar as alterações');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro na conexão');
        });
    });
}

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
    const characterData = {
        // Informações básicas
        name: document.getElementById('character-name').value,
        race: document.getElementById('character-race').value,
        char_class: document.getElementById('character-class').value,
        weapon: document.getElementById('character-weapon').value,
        element: document.getElementById('character-element').value,
        
        // Atributos
        strength: document.getElementById('attr-for').value,
        vitality: document.getElementById('attr-vit').value,
        agility: document.getElementById('attr-agi').value,
        charisma: document.getElementById('attr-cha').value,
        intelligence: document.getElementById('attr-int').value,
        
        // Status
        hp: document.getElementById('hp-value').textContent.split('/')[0].trim(),
        energy: document.getElementById('energy-value').textContent.split('/')[0].trim(),
        
        // Anotações
        opinion: document.getElementById('character-notes').value,
        
        // Foto
        photo: document.getElementById('character-photo-preview').src
    };
    
    // Salvar no localStorage
    localStorage.setItem('characterData', JSON.stringify(characterData));
    
    // Enviar para o servidor (implementar conforme sua API)
    fetch(saveSheetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(characterData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Ficha salva com sucesso!');
        }
    })
    .catch(error => {
        console.error('Erro ao salvar ficha:', error);
    });
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

// Parte Fernando, a parte superior possivelmente será alterada
// NÃO MODIFICAR O QUE ESTÁ ABAIXO DESTE COMENTÁRIO!!! 

document.addEventListener('DOMContentLoaded', function() {
    const energyBar = document.getElementById('energy-bar');
    if (energyBar) {
        const energyValue = parseInt(energyBar.dataset.energy) || 0;
        energyBar.style.width = `${energyValue * 20}%`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const btnCriarFicha = document.getElementById('create-sheet-btn');
  const modalCriarFicha = document.getElementById('create-sheet-modal');
  const btnsFechar = modalCriarFicha.querySelectorAll('.close-modal');

  btnCriarFicha.addEventListener('click', () => {
    modalCriarFicha.classList.remove('hidden');
  });

  btnsFechar.forEach(btn => {
    btn.addEventListener('click', () => {
      modalCriarFicha.classList.add('hidden');
    });
  });

  modalCriarFicha.addEventListener('click', (e) => {
    if (e.target === modalCriarFicha) {
      modalCriarFicha.classList.add('hidden');
    }
  });
});

function abrirModalFicha(button) {
    const modal = document.getElementById('detalhes-ficha-modal');
    const conteudo = document.getElementById('ficha-detalhes-content');
    
    // Extrai todos os dados de uma vez
    const {
        nome, raca, classe, arma, elemento, 
        forca, vitalidade, agilidade, carisma, inteligencia,
        hp, velocidade, energia, campanha, anotacoes, pericias, foto, id: fichaId
    } = button.dataset;


    // Passar essa parte para o código html para facilitar a organização !!!!!!! //
    // Constrói o HTML do modal
    conteudo.innerHTML = `
        <div class="ficha-detalhes-container">
            ${foto ? `<img src="${foto}" alt="Foto de ${nome}" class="ficha-foto-modal">` : ''}
            
            <div class="ficha-detalhes-grid">
                <div class="ficha-detalhes-col">
                    <p><strong>Nome:</strong> ${nome}</p>
                    <p><strong>Raça:</strong> ${raca}</p>
                    <p><strong>Classe:</strong> ${classe}</p>
                    <p><strong>Arma:</strong> ${arma}</p>
                    <p><strong>Elemento:</strong> ${elemento}</p>
                </div>
                <div class="ficha-detalhes-col">
                    <p><strong>Força:</strong> ${forca}</p>
                    <p><strong>Vitalidade:</strong> ${vitalidade}</p>
                    <p><strong>Agilidade:</strong> ${agilidade}</p>
                    <p><strong>Carisma:</strong> ${carisma}</p>
                    <p><strong>Inteligência:</strong> ${inteligencia}</p>
                </div>
                <div class="ficha-detalhes-col">
                    <p><strong>HP:</strong> ${hp}</p>
                    <p><strong>Velocidade:</strong> ${velocidade}</p>
                    <p><strong>Energia:</strong> ${energia}</p>
                    <p><strong>Campanha:</strong> ${campanha}</p>
                </div>
            </div>
            
            <div class="ficha-detalhes-section">
                <h3>Anotações</h3>
                <p>${anotacoes}</p>
            </div>
            
            <div class="ficha-detalhes-section">
                <h3>Perícias</h3>
                <p>${pericias}</p>
            </div>
            
            <!-- Área dos Botões -->
            <div class="modal-buttons">
                <button onclick="editarFicha(${fichaId})" class="btn btn-gradient">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="confirmarDelecao(${fichaId})" class="btn btn-pink">
                    <i class="fas fa-trash"></i> Deletar
                </button>
            </div>
        </div>

        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function fecharModalFicha() {
    document.getElementById('detalhes-ficha-modal').classList.remove('show');
    document.getElementById('detalhes-ficha-modal').classList.add('hidden');
}

function confirmarDelecao(fichaId) {
    if (confirm('⚠️ Tem certeza que deseja deletar PERMANENTEMENTE esta ficha?')) {
        fetch(`/fichas/${fichaId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                alert('❌ Erro ao deletar! Verifique suas permissões.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('❌ Falha na conexão. Tente novamente.');
        });
    }
}

// Função auxiliar para CSRF Token
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

function editarFicha(fichaId) {
    // Fecha o modal de detalhes
    fecharModalFicha();
    
    // Abre o modal de edição
    const editModal = document.getElementById('create-sheet-modal');
    
    // Configura como modal de edição
    editModal.querySelector('h2').textContent = 'Editar Ficha';
    editModal.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
    
    // Preenche os campos com os dados do botão clicado
    const button = document.querySelector(`button[data-id="${fichaId}"]`);
    if (button) {
        document.getElementById('new-character-name').value = button.dataset.nome || '';
        document.getElementById('new-character-race').value = button.dataset.raca || '';
        document.getElementById('new-character-class').value = button.dataset.classe || '';
        document.getElementById('new-character-weapon').value = button.dataset.arma || '';
        document.getElementById('new-character-element').value = button.dataset.elemento || '';
        document.getElementById('new-character-strength').value = button.dataset.forca || '0';
        document.getElementById('new-character-vitality').value = button.dataset.vitalidade || '0';
        document.getElementById('new-character-agility').value = button.dataset.agilidade || '0';
        document.getElementById('new-character-charisma').value = button.dataset.carisma || '0';
        document.getElementById('new-character-intelligence').value = button.dataset.inteligencia || '0';
        document.getElementById('new-character-hp').value = button.dataset.hp || '0';
        document.getElementById('new-character-speed').value = button.dataset.velocidade || '0';
        document.getElementById('new-character-energy').value = button.dataset.energia || '0';
        document.getElementById('new-character-opinion').value = button.dataset.anotacoes || '';
        document.getElementById('new-character-skills').value = button.dataset.pericias || '';
    }
    
    // Atualiza o action do formulário
    const form = document.getElementById('new-sheet-form');
    form.action = `/ficha/editar/${fichaId}/`;
    
    // Adiciona campo hidden com o ID
    let idInput = form.querySelector('input[name="ficha_id"]');
    if (!idInput) {
        idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'ficha_id';
        form.appendChild(idInput);
    }
    idInput.value = fichaId;
    
    // Abre o modal
    editModal.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', function() {
    // Reseta o modal de criação quando aberto para nova ficha
    document.getElementById('create-sheet-btn').addEventListener('click', function() {
        const modal = document.getElementById('create-sheet-modal');
        const form = document.getElementById('new-sheet-form');
        
        // Reseta o formulário
        form.reset();
        form.action = "{% url 'criar_ficha' %}";
        
        // Remove o campo hidden de edição se existir
        const idInput = form.querySelector('input[name="ficha_id"]');
        if (idInput) {
            form.removeChild(idInput);
        }
        
        // Atualiza o título e botão
        modal.querySelector('h2').textContent = 'Criar Nova Ficha';
        modal.querySelector('button[type="submit"]').textContent = 'Criar Ficha';
        
        // Abre o modal
        modal.classList.remove('hidden');
    });
});

// Fechar modal após submit bem-sucedido
document.getElementById('new-sheet-form').addEventListener('submit', function() {
    // Isso garante que o modal será fechado após o recarregamento
    localStorage.setItem('fecharModal', 'true');
});

// Verificar se deve fechar o modal ao carregar a página
window.addEventListener('load', function() {
    if (localStorage.getItem('fecharModal') === 'true') {
        document.getElementById('create-sheet-modal').classList.add('hidden');
        localStorage.removeItem('fecharModal');
    }
});
