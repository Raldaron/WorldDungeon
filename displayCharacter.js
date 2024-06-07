function displayCharacter() {
    const name = sessionStorage.getItem('name');
    const occupation = sessionStorage.getItem('occupation');
    let level = parseInt(sessionStorage.getItem('level')) || 1; // Default to level 1 if not set
    const stats = JSON.parse(sessionStorage.getItem('stats')) || {
        Strength: 0, Dexterity: 0, Stamina: 0,
        Intelligence: 0, Perception: 0, Wit: 0,
        Charisma: 0, Manipulation: 0, Appearance: 0
    };
    const skills = JSON.parse(sessionStorage.getItem('skills')) || {};
    const inventory = JSON.parse(sessionStorage.getItem('inventory')) || [];

    const hp = stats.Stamina * 5;
    const mp = stats.Intelligence * 5;

    document.getElementById('charName').textContent = name || 'Unnamed';
    document.getElementById('charOccupation').textContent = occupation || 'Unemployed';
    document.getElementById('charLevel').textContent = level;
    document.getElementById('charHP').textContent = hp;
    document.getElementById('charMP').textContent = mp;

    // Calculate available stat and skill points
    let statPoints = 2 * level - Object.values(stats).reduce((a, b) => a + b, 0);
    let skillPoints;
    if (level >= 1 && level <= 5) {
        skillPoints = 6 * level - Object.values(skills).reduce((a, b) => a + b, 0);
    } else if (level >= 6 && level <= 10) {
        skillPoints = 8 * level - Object.values(skills).reduce((a, b) => a + b, 0);
    } else if (level >= 11 && level <= 15) {
        skillPoints = 10 * level - Object.values(skills).reduce((a, b) => a + b, 0);
    } else if (level >= 16 && level <= 20) {
        skillPoints = 12 * level - Object.values(skills).reduce((a, b) => a + b, 0);
    } else if (level >= 21) {
        skillPoints = 14 * level - Object.values(skills).reduce((a, b) => a + b, 0);
    }

    document.getElementById('availableStatPoints').textContent = statPoints;
    document.getElementById('availableSkillPoints').textContent = skillPoints;

    // Populate stats
    Object.keys(stats).forEach(stat => {
        document.getElementById(`stat${stat}`).textContent = stats[stat];
    });

    // Populate skills
    const skillsContainer = document.querySelector('.expertise-grid');
    skillsContainer.innerHTML = ''; // Clear previous content
    Object.keys(skills).forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'expertise-item';
        skillElement.innerHTML = `
            <p>${skill}</p>
            <p><span id="skill${skill}" ondblclick="editSkill('${skill}')">${skills[skill]}</span></p>
        `;
        skillsContainer.appendChild(skillElement);
    });

    // Populate inventory
    const inventoryContainer = document.querySelector('.inventory-list');
    inventoryContainer.innerHTML = ''; // Clear previous content
    inventory.forEach(item => {
        const itemElement = document.createElement('p');
        itemElement.textContent = item;
        inventoryContainer.appendChild(itemElement);
    });

    // Populate actions
    const actions = JSON.parse(sessionStorage.getItem('actions')) || [];
    const actionGrid = document.querySelector('.action-grid');
    actionGrid.innerHTML = ''; // Clear previous content
    actions.forEach(action => {
        const actionElement = document.createElement('div');
        actionElement.className = 'action';
        actionElement.innerHTML = `
            <h3>${action.type}</h3>
            <p>${action.name}</p>
            <p>${action.damage}</p>
        `;
        actionGrid.appendChild(actionElement);
    });

    // Populate spells
    const spells = JSON.parse(sessionStorage.getItem('spells')) || [];
    const spellsList = document.querySelector('.spells-list');
    spellsList.innerHTML = ''; // Clear previous content
    spells.forEach(spell => {
        const spellElement = document.createElement('div');
        spellElement.className = 'spell';
        spellElement.innerHTML = `
            <p>${spell.name}</p>
            <p>${spell.effect}</p>
        `;
        spellsList.appendChild(spellElement);
    });

    // Populate equipment
    const equipment = JSON.parse(sessionStorage.getItem('equipment')) || [];
    const equipmentList = document.querySelector('.equipment-list');
    equipmentList.innerHTML = ''; // Clear previous content
    equipment.forEach(item => {
        const equipmentElement = document.createElement('div');
        equipmentElement.className = 'equipment-item';
        equipmentElement.innerHTML = `
            <p>${item.name}</p>
            <p>${item.effect}</p>
        `;
        equipmentList.appendChild(equipmentElement);
    });

    // Populate quest notes
    const questNotes = sessionStorage.getItem('questNotes');
    const questNotesContainer = document.querySelector('.quest-notes .quest');
    questNotesContainer.innerHTML = ''; // Clear previous content
    questNotesContainer.innerHTML = `
        <h3>The Dark Tower</h3>
        <p>${questNotes}</p>
    `;

    // Populate hints
    const hint = sessionStorage.getItem('hint');
    const hintsContainer = document.querySelector('.hints');
    hintsContainer.innerHTML = ''; // Clear previous content
    hintsContainer.innerHTML = `
        <h2>Hint</h2>
        <p>${hint}</p>
    `;

    // Populate ability points
    const abilityPoints = sessionStorage.getItem('abilityPoints') || '0';
    const abilityPointsContainer = document.getElementById('charAbilityPoints');
    abilityPointsContainer.value = abilityPoints;
}

function editCharacter() {
    window.location.href = 'index.html'; // Redirect to the character creation form
}

function updateLevel() {
    let level = parseInt(document.getElementById('charLevel').textContent);
    sessionStorage.setItem('level', level);
    displayCharacter();
}

function increaseLevel() {
    let level = parseInt(document.getElementById('charLevel').textContent);
    level += 1;
    sessionStorage.setItem('level', level);
    displayCharacter();
}

function editStat(stat) {
    const currentValue = document.getElementById(`stat${stat}`).textContent;
    const newValue = prompt(`Enter new value for ${stat}`, currentValue);
    if (newValue !== null) {
        saveStat(stat, newValue);
    }
}

function saveStat(stat, value) {
    const stats = JSON.parse(sessionStorage.getItem('stats')) || {
        Strength: 0, Dexterity: 0, Stamina: 0,
        Intelligence: 0, Perception: 0, Wit: 0,
        Charisma: 0, Manipulation: 0, Appearance: 0
    };
    stats[stat] = parseInt(value);
    sessionStorage.setItem('stats', JSON.stringify(stats));
    displayCharacter();
}

function editSkill(skill) {
    const currentValue = document.getElementById(`skill${skill}`).textContent;
    const newValue = prompt(`Enter new value for ${skill}`, currentValue);
    if (newValue !== null) {
        saveSkill(skill, newValue);
    }
}

function saveSkill(skill, value) {
    const skills = JSON.parse(sessionStorage.getItem('skills')) || {};
    skills[skill] = parseInt(value);
    sessionStorage.setItem('skills', JSON.stringify(skills));
    displayCharacter();
}

function resetCharacter() {
    if (confirm("Are you sure you want to reset your character? This action cannot be undone.")) {
        sessionStorage.clear();
        window.location.href = 'index.html'; // Redirect to character creation form
    }
}

window.onload = function() {
    displayCharacter();
};
