// Initialize data from LocalStorage or set defaults
let japaData = JSON.parse(localStorage.getItem('japaData')) || {
    activeMantram: "Om Namah Shivaya",
    chants: { "Om Namah Shivaya": 0 }
};

const display = document.getElementById('count-display');
const mantramSelect = document.getElementById('mantram-select');

// Update the UI
function updateUI() {
    const currentCount = japaData.chants[japaData.activeMantram] || 0;
    display.innerText = currentCount;
    localStorage.setItem('japaData', JSON.stringify(japaData));
}

// Change increment/decrement
function changeCount(amount) {
    if (!japaData.chants[japaData.activeMantram]) {
        japaData.chants[japaData.activeMantram] = 0;
    }
    
    // Prevent negative counts
    if (japaData.chants[japaData.activeMantram] + amount < 0) {
        japaData.chants[japaData.activeMantram] = 0;
    } else {
        japaData.chants[japaData.activeMantram] += amount;
    }
    
    // Haptic feedback (vibration) for mobile
    if (navigator.vibrate) navigator.vibrate(40);
    
    updateUI();
}

// Add a new Mantram
function addMantram() {
    const name = prompt("Enter Mantram Name:");
    if (name && !japaData.chants[name]) {
        japaData.chants[name] = 0;
        const option = document.createElement('option');
        option.value = name;
        option.innerText = name;
        mantramSelect.appendChild(option);
        mantramSelect.value = name;
        japaData.activeMantram = name;
        updateUI();
    }
}

// Handle Mantram selection change
mantramSelect.addEventListener('change', (e) => {
    japaData.activeMantram = e.target.value;
    updateUI();
});

// Initial Load
window.onload = () => {
    // Populate dropdown with saved mantrams
    mantramSelect.innerHTML = '';
    Object.keys(japaData.chants).forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        option.innerText = m;
        if (m === japaData.activeMantram) option.selected = true;
        mantramSelect.appendChild(option);
    });
    updateUI();
};
