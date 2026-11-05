let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let messageTimeout = null;
let isAudioPanelMinimized = false;

function updateButtonStates(reading) {
    const desktopBtn = document.getElementById('autoReadBtn');
    const mobileBtn = document.getElementById('mobileReadBtn');
    const mobileIcon = mobileBtn ? mobileBtn.querySelector('.mobile-btn-icon') : null;
    const mobileText = mobileBtn ? mobileBtn.querySelector('.mobile-btn-text') : null;
    const uiText = translations[currentLanguage].uiText;
    
    if (desktopBtn) {
        if (reading) {
            desktopBtn.innerHTML = `<span class="button-icon">⏸</span> ${uiText.stopReading}`;
            desktopBtn.classList.add('reading');
        } else {
            desktopBtn.innerHTML = `<span class="button-icon">▶</span> ${uiText.startReading}`;
            desktopBtn.classList.remove('reading');
        }
    }
    
    if (mobileBtn) {
        if (reading) {
            mobileBtn.classList.add('reading');
            if (mobileIcon) mobileIcon.textContent = '⏸';
            if (mobileText) mobileText.textContent = 'Stop';
        } else {
            mobileBtn.classList.remove('reading');
            if (mobileIcon) mobileIcon.textContent = '▶';
            if (mobileText) mobileText.textContent = 'Play';
        }
    }
}

function toggleMinimize() {
    const audioControls = document.getElementById('audioControls');
    const minimizeBtn = document.getElementById('minimizeBtn');
    if (!audioControls || !minimizeBtn) return;
    
    isAudioPanelMinimized = !isAudioPanelMinimized;
    audioControls.classList.toggle('minimized', isAudioPanelMinimized);
    minimizeBtn.textContent = isAudioPanelMinimized ? '+' : '−';
    minimizeBtn.title = isAudioPanelMinimized ? 'Maximize' : 'Minimize';
}

function closeAudioPanel() {
    const audioPanel = document.getElementById('audioControls');
    if (audioPanel) audioPanel.style.display = 'none';
    stopReading();
}

function makeAudioPanelDraggable() {
    const audioPanel = document.getElementById('audioControls');
    const audioHeader = audioPanel ? audioPanel.querySelector('.audio-header') : null;
    if (!audioPanel || !audioHeader) return;

    const startDrag = (e) => {
        isDragging = true;
        audioPanel.classList.add('dragging');
        const rect = audioPanel.getBoundingClientRect();
        dragOffset.x = (e.clientX || e.touches[0].clientX) - rect.left;
        dragOffset.y = (e.clientY || e.touches[0].clientY) - rect.top;
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
        e.preventDefault();
    };

    const drag = (e) => {
        if (!isDragging) return;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        let newX = clientX - dragOffset.x;
        let newY = clientY - dragOffset.y;
        newX = Math.max(0, Math.min(newX, window.innerWidth - audioPanel.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - audioPanel.offsetHeight));
        audioPanel.style.left = `${newX}px`;
        audioPanel.style.top = `${newY}px`;
        audioPanel.style.right = 'auto';
        e.preventDefault();
    };

    const stopDrag = () => {
        isDragging = false;
        audioPanel.classList.remove('dragging');
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    };

    audioHeader.addEventListener('mousedown', startDrag);
    audioHeader.addEventListener('touchstart', startDrag, { passive: false });
}

function showStartMessage() {
    const messageElement = document.getElementById('audioStartMessage');
    if (messageElement) {
        messageElement.classList.remove('hidden');
        messageTimeout = setTimeout(hideStartMessage, 1000);
    }
}

function hideStartMessage() {
    const messageElement = document.getElementById('audioStartMessage');
    if (messageElement) {
        messageElement.classList.add('hidden');
        setTimeout(() => { messageElement.style.display = 'none'; }, 800);
    }
    if (messageTimeout) clearTimeout(messageTimeout);
}