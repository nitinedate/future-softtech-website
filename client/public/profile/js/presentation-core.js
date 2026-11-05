let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    // Do nothing if the index is out of bounds or isn't changing
    if (index === currentSlide || index < 0 || index >= totalSlides) {
        return;
    }

    // Check if audio was playing before we change the slide
    const wasReading = typeof isReading !== 'undefined' && isReading;

    // If audio was playing, stop it immediately
    if (wasReading && typeof stopReading === 'function') {
        stopReading();
    }

    // Change the slide's visibility
    slides[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    updateUI();

    // If audio was active, automatically start it on the new slide
    if (wasReading && typeof startReading === 'function') {
        // Use a short delay to allow the slide transition animation to complete
        setTimeout(() => {
            startReading(true); // Pass 'true' to indicate auto-play
        }, 500);
    }
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

function goToSlide(index) {
    showSlide(index);
}