function initThumbnails() {
    const thumbnailsContainer = document.getElementById('thumbnails');
    for (let i = 0; i < totalSlides; i++) {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (i === 0) thumbnail.classList.add('active');
        thumbnail.onclick = () => goToSlide(i);
        thumbnailsContainer.appendChild(thumbnail);
    }
}

function updateARIA() {
    slides.forEach((slide, index) => {
        slide.setAttribute('aria-hidden', index !== currentSlide ? 'true' : 'false');
        slide.setAttribute('aria-current', index === currentSlide ? 'slide' : 'false');
    });
}

function updateUI() {
    document.getElementById('current-slide').textContent = currentSlide + 1;
    document.getElementById('total-slides').textContent = totalSlides;
    document.getElementById('prev-btn').disabled = currentSlide === 0;
    document.getElementById('next-btn').disabled = currentSlide === totalSlides - 1;
    
    // ADDED these two lines for mobile buttons
    document.getElementById('mobilePrevBtn').disabled = currentSlide === 0;
    document.getElementById('mobileNextBtn').disabled = currentSlide === totalSlides - 1;
    
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentSlide);
    });
    
    updateARIA();
}