// Initialize the presentation
document.addEventListener('DOMContentLoaded', () => {
    // Original presentation initialization
    initThumbnails();
    updateUI();
    
    if (isMobileDevice()) {
        initMobileFeatures();
    }

    // New: Initialize the audio application
    initializeAudioApp();
});