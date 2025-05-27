// Character CRUD operations
async function loadCharacters() {
    try {
        const response = await fetch('http://localhost:5000/character-sheets');
        const characters = await response.json();
        const charactersList = document.getElementById('charactersList');
        charactersList.innerHTML = '';
        
        characters.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.className = 'card';
            characterCard.innerHTML = `
                <h3>${character.name}</h3>
                <p><strong>Jogador:</strong> ${character.player_name}</p>
                <p><strong>Raça:</strong> ${character.race}</p>
                <p><strong>Classe:</strong> ${character.class}</p>
                ${character.weapon ? `<p><strong>Arma:</strong> ${character.weapon}</p>` : ''}
                ${character.element ? `<p><strong>Elemento:</strong> ${character.element}</p>` : ''}
                <p><strong>HP:</strong> ${character.hp || 'N/A'} | <strong>Vel:</strong> ${character.speed || 'N/A'} | <strong>Energia:</strong> ${character.energy || 'N/A'}</p>
                <div class="card-actions">
                    <button class="btn-primary btn-edit" data-id="${character.id}">Editar</button>
                    <button class="btn-primary btn-delete" data-id="${character.id}">Excluir</button>
                </div>
            `;
            charactersList.appendChild(characterCard);
            
            // Add event listeners to the buttons we just created
            characterCard.querySelector('.btn-edit').addEventListener('click', () => editCharacter(character));
            characterCard.querySelector('.btn-delete').addEventListener('click', () => deleteCharacter(character.id));
        });
    } catch (error) {
        console.error('Error loading characters:', error);
    }
}

async function addCharacter(characterData) {
    try {
        const response = await fetch('http://localhost:5000/character-sheets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(characterData)
        });
        
        if (response.ok) {
            loadCharacters();
        }
    } catch (error) {
        console.error('Error adding character:', error);
    }
}

function editCharacter(character) {
    const characterModal = document.getElementById('characterModal');
    document.getElementById('characterId').value = character.id;
    document.getElementById('characterName').value = character.name;
    document.getElementById('characterRace').value = character.race;
    document.getElementById('characterClass').value = character.class;
    document.getElementById('characterWeapon').value = character.weapon || '';
    document.getElementById('characterElement').value = character.element || '';
    document.getElementById('characterStrength').value = character.strength || '';
    document.getElementById('characterVitality').value = character.vitality || '';
    document.getElementById('characterAgility').value = character.agility || '';
    document.getElementById('characterCharisma').value = character.charisma || '';
    document.getElementById('characterIntelligence').value = character.intelligence || '';
    document.getElementById('characterSkills').value = character.skills || '';
    document.getElementById('characterHp').value = character.hp || '';
    document.getElementById('characterSpeed').value = character.speed || '';
    document.getElementById('characterEnergy').value = character.energy || '';
    document.getElementById('characterOpinion').value = character.opinion || '';
    
    // Need to set the player select option - this will be handled when we load players into the select
    document.getElementById('modalCharacterTitle').textContent = 'Editar Personagem';
    characterModal.style.display = 'block';
}

async function updateCharacter(id, characterData) {
    try {
        const response = await fetch(`http://localhost:5000/character-sheets/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(characterData)
        });
        
        if (response.ok) {
            loadCharacters();
        }
    } catch (error) {
        console.error('Error updating character:', error);
    }
}

async function deleteCharacter(id) {
    if (confirm('Tem certeza que deseja excluir este personagem?')) {
        try {
            const response = await fetch(`http://localhost:5000/character-sheets/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadCharacters();
            }
        } catch (error) {
            console.error('Error deleting character:', error);
        }
    }
}

// Character modal functionality
const characterModal = document.getElementById('characterModal');
const addCharacterBtn = document.getElementById('addCharacterBtn');
const characterForm = document.getElementById('characterForm');
const modalCharacterTitle = document.getElementById('modalCharacterTitle');
const characterSpan = characterModal.querySelector('.close');

addCharacterBtn.addEventListener('click', async () => {
    characterForm.reset();
    document.getElementById('characterId').value = '';
    modalCharacterTitle.textContent = 'Adicionar Personagem';
    
    // Load players into the select dropdown
    await loadPlayerOptions();
    
    characterModal.style.display = 'block';
});

characterSpan.addEventListener('click', () => {
    characterModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === characterModal) {
        characterModal.style.display = 'none';
    }
});

characterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const characterId = document.getElementById('characterId').value;
    const characterData = {
        player_id: document.getElementById('characterPlayer').value,
        name: document.getElementById('characterName').value,
        race: document.getElementById('characterRace').value,
        class: document.getElementById('characterClass').value,
        weapon: document.getElementById('characterWeapon').value || null,
        element: document.getElementById('characterElement').value || null,
        strength: document.getElementById('characterStrength').value ? parseInt(document.getElementById('characterStrength').value) : null,
        vitality: document.getElementById('characterVitality').value ? parseInt(document.getElementById('characterVitality').value) : null,
        agility: document.getElementById('characterAgility').value ? parseInt(document.getElementById('characterAgility').value) : null,
        charisma: document.getElementById('characterCharisma').value ? parseInt(document.getElementById('characterCharisma').value) : null,
        intelligence: document.getElementById('characterIntelligence').value ? parseInt(document.getElementById('characterIntelligence').value) : null,
        skills: document.getElementById('characterSkills').value || null,
        hp: document.getElementById('characterHp').value ? parseInt(document.getElementById('characterHp').value) : null,
        speed: document.getElementById('characterSpeed').value ? parseInt(document.getElementById('characterSpeed').value) : null,
        energy: document.getElementById('characterEnergy').value ? parseInt(document.getElementById('characterEnergy').value) : null,
        opinion: document.getElementById('characterOpinion').value || null
    };
    
    if (characterId) {
        updateCharacter(characterId, characterData);
    } else {
        addCharacter(characterData);
    }
    
    characterModal.style.display = 'none';
});

async function loadPlayerOptions() {
    try {
        const response = await fetch('http://localhost:5000/players');
        const players = await response.json();
        const playerSelect = document.getElementById('characterPlayer');
        playerSelect.innerHTML = '';
        
        players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.id;
            option.textContent = player.name;
            playerSelect.appendChild(option);
        });
        
        // If we're editing a character, set the selected player
        const characterId = document.getElementById('characterId').value;
        if (characterId) {
            const characterResponse = await fetch(`http://localhost:5000/character-sheets/${characterId}`);
            const character = await characterResponse.json();
            playerSelect.value = character.player_id;
        }
    } catch (error) {
        console.error('Error loading players for select:', error);
    }
}