document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
    } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(totalSlides - 1);
    }
});

let touchStartX = 0;
let isScrolling = false;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isScrolling = false;
}, { passive: true });

document.addEventListener('touchmove', () => {
    isScrolling = true;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (isScrolling) return;
    const touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) {
        nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
        previousSlide();
    }
}, { passive: true });

window.addEventListener('resize', () => {
    updateUI();
});