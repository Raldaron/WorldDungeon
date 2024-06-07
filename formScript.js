let currentStep = 1;
const totalStatPoints = 60;
let allocatedStatPoints = {
    Strength: 0, Dexterity: 0, Stamina: 0,
    Intelligence: 0, Perception: 0, Wit: 0,
    Charisma: 0, Manipulation: 0, Appearance: 0
};
let allocatedSkillPoints = {
    "Alchemy": 0, "Animal Ken": 0, "Archery": 0, "Arcana": 0, "Athletics": 0,
    "Awareness": 0, "Climbing": 0, "Crafting": 0, "Dodge": 0, "Disguise": 0,
    "Engineering": 0, "Firearms": 0, "Insight": 0, "Intimidation": 0, "Investigation": 0,
    "Larceny": 0, "Leadership": 0, "Lore": 0, "Medicine": 0, "Melee": 0,
    "Performance": 0, "Persuasion": 0, "Pop Culture": 0, "Pugilism": 0, "Read Lips": 0,
    "Ride": 0, "Sapper": 0, "Scrounge": 0, "Search": 0, "Sense Deception": 0,
    "Sleight of Hand": 0, "Stealth": 0, "Streetwise": 0, "Subterfuge": 0, "Survival": 0,
    "Swimming": 0, "Tactics": 0, "Vehicle Operation": 0
};
const totalSkillPoints = 25;  // Arbitrary total points for skills
let availableSkillPoints = totalSkillPoints;
let inventoryItems = {
    "Sword": { selected: false },
    "Shield": { selected: false },
    "Bow": { selected: false },
    "Arrows": { selected: false },
    "Healing Potion": { selected: false },
    "Magic Staff": { selected: false }
};

function nextStep(step) {
    const current = document.getElementById(`step${currentStep}`);
    const next = document.getElementById(`step${step}`);
    current.style.display = 'none';
    next.style.display = 'block';
    currentStep = step;

    if (step === 2) {
        populateStats();
    } else if (step === 3) {
        populateSkills();
    } else if (step === 4) {
        populateInventory();
    } else if (step === 5) {
        populateReview();
    }
}

function populateStats() {
    const statsContainer = document.getElementById('stats');
    statsContainer.innerHTML = '';
    Object.keys(allocatedStatPoints).forEach(stat => {
        const statElement = document.createElement('div');
        statElement.innerHTML = `<label>${stat}: </label><input type="number" id="${stat}" value="${allocatedStatPoints[stat]}" min="0" max="15" onchange="updateStatPoints('${stat}', this.value)" class="hidden"><span ondblclick="editStat('${stat}')">${allocatedStatPoints[stat]}</span><br>`;
        statsContainer.appendChild(statElement);
    });
}

function updateStatPoints(stat, value) {
    const inputElement = document.getElementById(stat);
    value = parseInt(value);
    const difference = value - allocatedStatPoints[stat];
    const totalPointsElement = document.getElementById('totalPoints');
    let remainingPoints = parseInt(totalPointsElement.textContent);

    if (remainingPoints - difference >= 0 && value >= 0 && value <= 15) {
        allocatedStatPoints[stat] = value;
        remainingPoints -= difference;
        totalPointsElement.textContent = remainingPoints.toString();
    } else {
        inputElement.value = allocatedStatPoints[stat]; // Reset to previous value
    }
}

function populateSkills() {
    const skillsContainer = document.getElementById('skills');
    skillsContainer.innerHTML = '';
    Object.keys(allocatedSkillPoints).sort().forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.innerHTML = `<label>${skill}: </label><input type="number" id="skill_${skill}" value="${allocatedSkillPoints[skill]}" min="0" onchange="updateSkillPoints('${skill}', this.value)" class="hidden"><span ondblclick="editSkill('${skill}')">${allocatedSkillPoints[skill]}</span><br>`;
        skillsContainer.appendChild(skillElement);
    });
}

function updateSkillPoints(skill, value) {
    const inputElement = document.getElementById(`skill_${skill}`);
    value = parseInt(value);
    const oldLevel = allocatedSkillPoints[skill];
    const newLevel = value;

    let pointCost = 0;
    for (let i = oldLevel; i < newLevel; i++) {
        pointCost += i + 1;  // Cost to level up to the next level
    }

    const difference = pointCost;

    if (availableSkillPoints - difference >= 0 && value >= 0) {
        allocatedSkillPoints[skill] = value;
        availableSkillPoints -= difference;
        document.getElementById('availableSkillPoints').textContent = availableSkillPoints.toString();
    } else {
        inputElement.value = allocatedSkillPoints[skill]; // Reset to previous value
    }
}

function populateInventory() {
    const inventoryContainer = document.getElementById('inventory');
    inventoryContainer.innerHTML = '';
    Object.keys(inventoryItems).forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `<label><input type="checkbox" id="item_${item}" ${inventoryItems[item].selected ? 'checked' : ''} onchange="toggleInventoryItem('${item}')"> ${item}</label><br>`;
        inventoryContainer.appendChild(itemElement);
    });
}

function toggleInventoryItem(item) {
    const checkbox = document.getElementById(`item_${item}`);
    inventoryItems[item].selected = checkbox.checked;
}

function populateReview() {
    const reviewContainer = document.getElementById('review');
    reviewContainer.innerHTML = '<h3>Character Summary:</h3>';
    Object.keys(allocatedStatPoints).forEach(stat => {
        reviewContainer.innerHTML += `<p>${stat}: ${allocatedStatPoints[stat]}</p>`;
    });
    Object.keys(allocatedSkillPoints).forEach(skill => {
        reviewContainer.innerHTML += `<p>${skill}: ${allocatedSkillPoints[skill]}</p>`;
    });
    reviewContainer.innerHTML += '<h4>Starting Inventory:</h4>';
    Object.keys(inventoryItems).forEach(item => {
        if (inventoryItems[item].selected) {
            reviewContainer.innerHTML += `<p>${item}</p>`;
        }
    });
}

function submitCharacter() {
    const name = document.getElementById('name').value;
    const occupation = document.getElementById('occupation').value;
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('occupation', occupation);
    sessionStorage.setItem('stats', JSON.stringify(allocatedStatPoints));
    sessionStorage.setItem('skills', JSON.stringify(allocatedSkillPoints));
    sessionStorage.setItem('inventory', JSON.stringify(Object.keys(inventoryItems).filter(item => inventoryItems[item].selected)));
    sessionStorage.setItem('actions', JSON.stringify([
        { type: 'Melee', image: 'melee.png', name: 'Power Strike', damage: '12-17 damage' },
        { type: 'Magic', image: 'magic.png', name: 'Fireball', damage: '10-15 damage' }
    ]));
    sessionStorage.setItem('spells', JSON.stringify([
        { name: 'Fireball', image: 'fireball.png', effect: '10-15 damage' },
        { name: 'Teleport', image: 'teleport.png', effect: 'Move to known location' }
    ]));
    sessionStorage.setItem('equipment', JSON.stringify([
        { name: 'Greatsword', image: 'greatsword.png', effect: '+2 attack, 2d6' },
        { name: 'Steel Shield', image: 'steel-shield.png', effect: '+3 defense' }
    ]));
    sessionStorage.setItem('questNotes', 'Retrieve the ancient artifact from the tower.');
    sessionStorage.setItem('hint', 'Watch for traps in the dungeon.');

    window.location.href = 'characterSheet.html'; // Redirect to character sheet display
}

window.onload = function() {
    nextStep(1); // Start at step 1
};

function editStat(stat) {
    document.getElementById(stat).classList.remove('hidden');
    document.querySelector(`[ondblclick="editStat('${stat}')"]`).classList.add('hidden');
    document.getElementById(stat).focus();
}

function editSkill(skill) {
    document.getElementById(`skill_${skill}`).classList.remove('hidden');
    document.querySelector(`[ondblclick="editSkill('${skill}')"]`).classList.add('hidden');
    document.getElementById(`skill_${skill}`).focus();
}
