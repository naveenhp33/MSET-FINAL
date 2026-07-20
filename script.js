function updateCountdown() {
    const eventDate = new Date("September 24, 2026 10:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = eventDate - now;

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
    } else {
        document.getElementById("countdown").innerHTML = "<p>The event has started!</p>";
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

function showDetails(imageSrc, name, designation) {
    document.getElementById('fullImage').src = imageSrc;
    document.getElementById('name').textContent = name;
    document.getElementById('designation').textContent = designation;
}

// Function to close the popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function downloadBrochure() {
    const link = document.createElement('a');
    link.href = 'assets/ICMSET 26.pdf';
    link.download = 'ICMSET26_Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// =========================================
// IMAGE GALLERY LIGHTBOX
// =========================================
function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-modal').style.display = "block";
}

function closeLightbox() {
    document.getElementById('lightbox-modal').style.display = "none";
}

// Close lightbox when clicking outside the image
window.addEventListener("click", function(event) {
    const modal = document.getElementById('lightbox-modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// =========================================
// GALLERY CAROUSEL SLIDER
// =========================================
(function () {
    let galleryIndex = 0;
    let galleryAutoPlay;
    let isHovering = false;
    let touchStartX = 0;

    function initGallerySlider() {
        const carousel = document.getElementById('gallery-carousel');
        if (!carousel) return;

        const slides = Array.from(carousel.querySelectorAll('.gallery-slide'));
        const dotsContainer = document.getElementById('gallery-dots');
        const prevButton = document.getElementById('gallery-prev');
        const nextButton = document.getElementById('gallery-next');
        const gallerySection = document.querySelector('.gallery-section');
        const lightboxModal = document.getElementById('lightbox-modal');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        const cards = Array.from(document.querySelectorAll('.gallery-card'));
        const loadMoreBtn = document.getElementById('load-more-btn');
        const totalSlides = slides.length;
        let isDragging = false;
        let dragStartX = 0;
        let dragDeltaX = 0;

        if (!dotsContainer || !prevButton || !nextButton) return;

        slides.forEach((slide, index) => {
            slide.dataset.index = index;
        });

        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'gallery-dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            galleryIndex = (index + totalSlides) % totalSlides;
            const slideWidth = slides[0].getBoundingClientRect().width;
            carousel.style.transform = `translateX(-${galleryIndex * slideWidth}px)`;
            slides.forEach((slide, i) => slide.classList.toggle('active', i === galleryIndex));
            dotsContainer.querySelectorAll('.gallery-dot').forEach((dot, i) => dot.classList.toggle('active', i === galleryIndex));
        }

        function updateSlidePosition() {
            const slideWidth = slides[0].getBoundingClientRect().width;
            carousel.style.transition = 'transform 0.6s ease';
            carousel.style.transform = `translateX(-${galleryIndex * slideWidth}px)`;
        }

        function nextSlide() {
            goToSlide(galleryIndex + 1);
        }

        function prevSlide() {
            goToSlide(galleryIndex - 1);
        }

        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        const carouselWrapper = carousel.parentElement;
        carouselWrapper.addEventListener('mouseenter', () => {
            isHovering = true;
            clearInterval(galleryAutoPlay);
        });

        carouselWrapper.addEventListener('mouseleave', () => {
            isHovering = false;
            resetAutoPlay();
        });

        carouselWrapper.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                touchStartX = event.touches[0].screenX;
                clearInterval(galleryAutoPlay);
            }
        }, { passive: true });

        carouselWrapper.addEventListener('touchmove', (event) => {
            if (event.touches.length !== 1) return;
            dragDeltaX = event.touches[0].screenX - touchStartX;
            carousel.style.transition = 'none';
            const slideWidth = slides[0].getBoundingClientRect().width;
            carousel.style.transform = `translateX(-${galleryIndex * slideWidth - dragDeltaX}px)`;
        }, { passive: true });

        carouselWrapper.addEventListener('touchend', (event) => {
            const touchEndX = event.changedTouches[0].screenX;
            const deltaX = touchStartX - touchEndX;
            if (Math.abs(deltaX) > 40) {
                if (deltaX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            resetAutoPlay();
        });

        carouselWrapper.addEventListener('mousedown', (event) => {
            isDragging = true;
            dragStartX = event.clientX;
            dragDeltaX = 0;
            carousel.style.cursor = 'grabbing';
            carousel.style.transition = 'none';
            clearInterval(galleryAutoPlay);
        });

        carouselWrapper.addEventListener('mousemove', (event) => {
            if (!isDragging) return;
            dragDeltaX = event.clientX - dragStartX;
            const slideWidth = slides[0].getBoundingClientRect().width;
            carousel.style.transform = `translateX(-${galleryIndex * slideWidth - dragDeltaX}px)`;
        });

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            carousel.style.cursor = 'grab';
            const threshold = 60;
            if (dragDeltaX > threshold) {
                prevSlide();
            } else if (dragDeltaX < -threshold) {
                nextSlide();
            } else {
                updateSlidePosition();
            }
            resetAutoPlay();
        };

        carouselWrapper.addEventListener('mouseup', endDrag);
        carouselWrapper.addEventListener('mouseleave', endDrag);

        function startAutoPlay() {
            galleryAutoPlay = setInterval(() => {
                nextSlide();
            }, 4500);
        }

        function resetAutoPlay() {
            clearInterval(galleryAutoPlay);
            if (!isHovering) {
                startAutoPlay();
            }
        }

        // Initialize position immediately and start autoplay shortly after.
        // Image elements may be `loading="lazy"` and not fire load events while offscreen,
        // so avoid waiting for every image to load before starting the slider.
        goToSlide(0);
        // Small delay before starting autoplay to allow layout/measurements to settle
        setTimeout(() => {
            startAutoPlay();
        }, 600);

        function openLightbox(index) {
            const card = cards[index];
            if (!card) return;
            lightboxImg.src = card.dataset.src;
            lightboxImg.alt = card.dataset.alt || card.dataset.caption || 'Event image preview';
            lightboxCaption.textContent = card.dataset.caption || '';
            lightboxModal.classList.add('active');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            currentLightboxIndex = index;
        }

        function closeLightbox() {
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }

        function prevLightbox() {
            openLightbox((currentLightboxIndex - 1 + cards.length) % cards.length);
        }

        function nextLightbox() {
            openLightbox((currentLightboxIndex + 1) % cards.length);
        }

        let currentLightboxIndex = 0;

        cards.forEach((card) => {
            card.addEventListener('click', () => {
                openLightbox(parseInt(card.dataset.index, 10));
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', (event) => { event.stopPropagation(); prevLightbox(); });
        lightboxNext.addEventListener('click', (event) => { event.stopPropagation(); nextLightbox(); });

        lightboxModal.addEventListener('click', (event) => {
            if (event.target === lightboxModal) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (!lightboxModal.classList.contains('active')) return;
            if (event.key === 'Escape') closeLightbox();
            if (event.key === 'ArrowRight') nextLightbox();
            if (event.key === 'ArrowLeft') prevLightbox();
        });

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                const hiddenCards = Array.from(document.querySelectorAll('.gallery-card.hidden'));
                hiddenCards.slice(0, 4).forEach((card) => card.classList.remove('hidden'));
                if (document.querySelectorAll('.gallery-card.hidden').length === 0) {
                    loadMoreBtn.style.display = 'none';
                }
            });
        }

        if (gallerySection) {
            const observer = new IntersectionObserver((entries, observerRef) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gallerySection.classList.add('ready');
                        observerRef.disconnect();
                    }
                });
            }, { threshold: 0.15 });
            observer.observe(gallerySection);
        }

        window.addEventListener('resize', updateSlidePosition);
    }

    document.addEventListener('DOMContentLoaded', initGallerySlider);
})();
