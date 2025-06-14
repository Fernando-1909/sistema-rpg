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

// Envio do formulário
document.getElementById('new-sheet-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Pega o campaign_id da URL atual
    const urlParts = window.location.pathname.split('/');
    const campaignId = urlParts.length > 2 ? urlParts[2] : '0';
    
    // Configura o action para a URL correta
    this.action = `/fichas/${campaignId}/`;
    
    // Envia o formulário
    this.submit();
});

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

    // Constrói o HTML do modal
    conteudo.innerHTML = `
  <div class="ficha-detalhes-container">
    ${foto ? `<img src="${foto}" alt="Foto de ${nome}" class="ficha-foto-modal">` : ''}

        <!-- BARRAS DE STATUS INTERATIVAS -->
        <div class="status-bars-container">
        <div class="bar-section">
            <label class="bar-label">HP</label>
            <div class="bar-controls">
            <button class="arrow-btn minus" data-target="modal-hp-value">-</button>
            <div id="modal-hp-value" class="bar-value">${hp} / ${hp}</div>
            <button class="arrow-btn plus" data-target="modal-hp-value">+</button>
            </div>
            <div class="bar-bg">
            <div class="bar-fill hp-fill" id="modal-hp-bar" style="width: 100%"></div>
            </div>
        </div>

        <div class="bar-section">
            <label class="bar-label">Energia</label>
            <div class="bar-controls">
            <button class="arrow-btn minus" data-target="modal-energy-value">-</button>
            <div id="modal-energy-value" class="bar-value">${energia} / 5</div>
            <button class="arrow-btn plus" data-target="modal-energy-value">+</button>
            </div>
            <div class="bar-bg">
            <div class="bar-fill energy-fill" id="modal-energy-bar" style="width: ${(parseInt(energia)/5)*100}%"></div>
            </div>
        </div>
        </div>

        <div class="ficha-detalhes-grid-lindo">
        <!-- COLUNA ESQUERDA: INFORMAÇÕES BÁSICAS -->
        <div class="detalhes-coluna-info">
            <div class="info-item"><strong>Nome:</strong> ${nome}</div>
            <div class="info-item"><strong>Raça:</strong> ${raca}</div>
            <div class="info-item"><strong>Classe:</strong> ${classe}</div>
            <div class="info-item"><strong>Arma:</strong> ${arma}</div>
            <div class="info-item"><strong>Elemento:</strong> ${elemento}</div>
            <div class="info-item"><strong>Campanha:</strong> ${campanha}</div>
        </div>

        <!-- COLUNA DIREITA: ATRIBUTOS COLORIDOS -->
        <div class="detalhes-coluna-atributos">
            <div class="atributo-tag forca">Força <span>${forca}</span></div>
            <div class="atributo-tag vitalidade">Vitalidade <span>${vitalidade}</span></div>
            <div class="atributo-tag agilidade">Agilidade <span>${agilidade}</span></div>
            <div class="atributo-tag carisma">Carisma <span>${carisma}</span></div>
            <div class="atributo-tag inteligencia">Inteligência <span>${inteligencia}</span></div>
            <div class="atributo-tag velocidade">Velocidade <span>${velocidade}</span></div>
        </div>
        </div>

        <div class="ficha-detalhes-section">
        <h3>Perícias</h3>
        <p>${pericias}</p>
        </div>
        
        <div class="ficha-detalhes-section">
        <h3>Anotações</h3>
        <p>${anotacoes}</p>
        </div>

        <div class="modal-buttons">
            <button onclick="editarFicha(${fichaId})" class="btn btn-gradient">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button onclick="confirmarDelecao(${fichaId})" class="btn btn-pink">
                <i class="fas fa-trash"></i> Deletar
            </button>
            <button onclick="abrirCalculadoraDano(${fichaId})" class="btn btn-purple">
                <i class="fas fa-calculator"></i> Calculadora de Dano
            </button>
        </div>

    </div>
    `;
    // Controle das barras (dentro do modal)
    const modalMaxHP = parseInt(hp) || 0;
    const modalMaxEnergy = 5;

    function atualizarBarraModal(targetId, max) {
    const valueElement = document.getElementById(targetId);
    const barElement = document.getElementById(targetId === 'modal-hp-value' ? 'modal-hp-bar' : 'modal-energy-bar');
    
    let [current, total] = valueElement.textContent.split('/').map(v => parseInt(v.trim()));
    const percent = Math.max(0, Math.min(100, (current / max) * 100));
    barElement.style.width = percent + '%';
    }

    document.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const valueEl = document.getElementById(targetId);
        let [current, total] = valueEl.textContent.split('/').map(v => parseInt(v.trim()));
        const max = (targetId === 'modal-hp-value') ? modalMaxHP : modalMaxEnergy;

        if (btn.classList.contains('plus') && current < max) current++;
        if (btn.classList.contains('minus') && current > 0) current--;

        valueEl.textContent = `${current} / ${max}`;
        atualizarBarraModal(targetId, max);
    });
    });



    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function fecharModalFicha() {
    document.getElementById('detalhes-ficha-modal').classList.remove('show');
    document.getElementById('detalhes-ficha-modal').classList.add('hidden');
}

function confirmarDelecao(fichaId) {
    if (confirm('⚠️ Tem certeza que deseja deletar PERMANENTEMENTE esta ficha?')) {
        // Pega o CSRF token
        const csrftoken = getCookie('csrftoken');
        
        // Envia a requisição DELETE
        fetch(`/fichas/${fichaId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ficha_id: fichaId
            })
        })
        .then(response => {
            if (response.status === 403) {
                throw new Error('Você não tem permissão para deletar esta ficha');
            }
            if (!response.ok) {
                throw new Error('Erro ao deletar ficha');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Ficha deletada com sucesso!');
                window.location.reload();
            } else {
                alert('Erro ao deletar ficha: ' + (data.error || 'Erro desconhecido'));
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('❌ ' + error.message);
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
    
    // Preenche os campos com os dados
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

// Substitua todo o bloco do evento submit do formulário por este:
document.getElementById('new-sheet-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Pega o campaign_id da URL atual
    const urlParts = window.location.pathname.split('/');
    const campaignId = urlParts.length > 2 ? urlParts[2] : '0';
    
    // Verifica se é edição ou criação
    const isEditing = this.action.includes('editar');
    
    // Configura o action para a URL correta
    if (isEditing) {
        // Mantém a URL de edição que já estava configurada
    } else {
        this.action = `/fichas/${campaignId}/`;
    }
    
    // Envia o formulário
    this.submit();
});

// Substitua a função editarFicha por esta:
function editarFicha(fichaId) {
    // Fecha o modal de detalhes
    fecharModalFicha();
    
    // Abre o modal de edição
    const editModal = document.getElementById('create-sheet-modal');
    
    // Configura como modal de edição
    editModal.querySelector('h2').textContent = 'Editar Ficha';
    editModal.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
    
    // Preenche os campos com os dados
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
    form.action = `/fichas/${fichaId}/`;  // Usando a mesma URL para edição
    
    // Adiciona campo hidden com o ID
    let idInput = document.querySelector('input[name="ficha_id"]');
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

// Verificar se deve fechar o modal ao carregar a página
window.addEventListener('load', function() {
    if (localStorage.getItem('fecharModal') === 'true') {
        document.getElementById('create-sheet-modal').classList.add('hidden');
        localStorage.removeItem('fecharModal');
    }
});

// Inicializa fichasData pegando os dados dos botões "Ver detalhes" no HTML
const fichasData = Array.from(document.querySelectorAll('.ver-detalhes')).map(button => ({
  id: parseInt(button.dataset.id),
  nome: button.dataset.nome,
  raca: button.dataset.raca,
  classe: button.dataset.classe,
  arma: button.dataset.arma,
  elemento: button.dataset.elemento,
  forca: parseInt(button.dataset.forca) || 0,
  vitalidade: parseInt(button.dataset.vitalidade) || 0,
  agilidade: parseInt(button.dataset.agilidade) || 0,
  carisma: parseInt(button.dataset.carisma) || 0,
  inteligencia: parseInt(button.dataset.inteligencia) || 0,
  hp: parseInt(button.dataset.hp) || 0,
  velocidade: parseInt(button.dataset.velocidade) || 0,
  energia: parseInt(button.dataset.energia) || 0,
  campanha: button.dataset.campanha,
  anotacoes: button.dataset.anotacoes,
  pericias: button.dataset.pericias,
  foto: button.dataset.foto
}));

let fichaSelecionada = null;

function abrirCalculadoraDano(fichaId) {
    fichaSelecionada = fichasData.find(f => f.id === fichaId);
    if (!fichaSelecionada) {
        alert("Ficha não encontrada.");
        return;
    }

    fecharModalFicha(); // Fecha o modal atual (modal de detalhes)

    // Abre o modal da calculadora
    const modal = document.getElementById("calculadora-dano-modal");
    modal.classList.remove("hidden");

    // Reseta os inputs e resultado da calculadora
    document.getElementById("dano-base").value = "";
    document.getElementById("chance-critico").value = "";
    document.getElementById("resultado-dano").innerHTML = "";
}

function fecharCalculadoraDano() {
    document.getElementById("calculadora-dano-modal").classList.add("hidden");
}

function calcularDano() {
    const danoBase = parseFloat(document.getElementById("dano-base").value);
    const critico = parseFloat(document.getElementById("chance-critico").value);

    if (isNaN(danoBase) || isNaN(critico) || critico > 1.01 || critico < 0) {
        alert("Insira valores válidos. Chance crítica deve estar entre 0 e 1.01");
        return;
    }

    if (!fichaSelecionada) {
      alert("Nenhuma ficha selecionada para calcular dano.");
      return;
    }

    const dado = Math.floor(Math.random() * 20) + 1;
    const forca = parseInt(fichaSelecionada.forca || 0);

    const dano = (forca + danoBase) * (1 + critico) + dado;

    document.getElementById("resultado-dano").innerHTML = `
        <p><strong>Força:</strong> ${forca}</p>
        <p><strong>Dano base:</strong> ${danoBase}</p>
        <p><strong>Chance crítica:</strong> ${critico}</p>
        <p><strong>Valor do dado (1d20):</strong> ${dado}</p>
        <p><strong><u>Dano total:</u></strong> ${dano.toFixed(2)}</p>
    `;
}

