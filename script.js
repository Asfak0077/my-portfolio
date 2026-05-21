const PortfolioLogic = {
    shouldNavbarBeScrolled(scrollY, threshold = 50) {
        return scrollY > threshold;
    },

    getActiveSectionId(entries) {
        let activeSectionId = null;
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target && entry.target.id) {
                activeSectionId = entry.target.id;
            }
        });
        return activeSectionId;
    },

    getTypewriterNextState({ words, txt, wordIndex, isDeleting, wait }) {
        const current = wordIndex % words.length;
        const fullTxt = words[current];

        const nextTxt = isDeleting
            ? fullTxt.substring(0, txt.length - 1)
            : fullTxt.substring(0, txt.length + 1);

        let typeSpeed = 100;
        let nextIsDeleting = isDeleting;
        let nextWordIndex = wordIndex;

        if (nextIsDeleting) {
            typeSpeed /= 2;
        }

        if (!nextIsDeleting && nextTxt === fullTxt) {
            typeSpeed = wait;
            nextIsDeleting = true;
        } else if (nextIsDeleting && nextTxt === '') {
            nextIsDeleting = false;
            nextWordIndex++;
            typeSpeed = 500;
        }

        return {
            txt: nextTxt,
            wordIndex: nextWordIndex,
            isDeleting: nextIsDeleting,
            typeSpeed
        };
    },

    getNavToggleSpanStyle(index, isActive) {
        if (!isActive) {
            return { transform: 'none', opacity: '1' };
        }
        if (index === 0) {
            return { transform: 'rotate(-45deg) translate(-5px, 6px)', opacity: '1' };
        }
        if (index === 1) {
            return { transform: 'none', opacity: '0' };
        }
        if (index === 2) {
            return { transform: 'rotate(45deg) translate(-5px, -6px)', opacity: '1' };
        }
        return { transform: 'none', opacity: '1' };
    },

    getNextCarouselIndex(currentIndex, totalItems) {
        return (currentIndex + 1) % totalItems;
    },

    getPrevCarouselIndex(currentIndex, totalItems) {
        return (currentIndex - 1 + totalItems) % totalItems;
    },

    getCarouselTransform(currentIndex) {
        return `translateX(-${currentIndex * 100}%)`;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioLogic;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (PortfolioLogic.shouldNavbarBeScrolled(window.scrollY)) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Active Link Highlighting
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    const options = {
        threshold: 0.5
    };

    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            const activeSectionId = PortfolioLogic.getActiveSectionId(entries);
            if (!activeSectionId) {
                return;
            }

            navItems.forEach((item) => {
                item.classList.remove('active');
                const href = item.getAttribute('href');
                if (!href || !href.startsWith('#')) {
                    return;
                }
                if (href.substring(1) === activeSectionId) {
                    item.classList.add('active');
                }
            });
        }, options);

        sections.forEach((section) => {
            observer.observe(section);
        });
    }

    // Typewriter Effect
    class TypeWriter {
        constructor(txtElement, words, wait = 3000) {
            this.txtElement = txtElement;
            this.words = words;
            this.txt = '';
            this.wordIndex = 0;
            this.wait = parseInt(wait, 10);
            this.isDeleting = false;
            this.type();
        }

        type() {
            const nextState = PortfolioLogic.getTypewriterNextState({
                words: this.words,
                txt: this.txt,
                wordIndex: this.wordIndex,
                isDeleting: this.isDeleting,
                wait: this.wait
            });

            this.txt = nextState.txt;
            this.wordIndex = nextState.wordIndex;
            this.isDeleting = nextState.isDeleting;
            this.txtElement.textContent = '';
            const span = document.createElement('span');
            span.className = 'txt';
            span.textContent = this.txt;
            this.txtElement.appendChild(span);

            setTimeout(() => this.type(), nextState.typeSpeed);
        }
    }

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // Initialize AOS
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        const txtElement = document.querySelector('.type-writer');
        if (!txtElement) {
            return;
        }
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }

    // Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const spans = navToggle.querySelectorAll('span');
            const isActive = navLinks.classList.contains('active');

            spans.forEach((span, index) => {
                const style = PortfolioLogic.getNavToggleSpanStyle(index, isActive);
                span.style.transform = style.transform;
                span.style.opacity = style.opacity;
            });
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-links a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    const style = PortfolioLogic.getNavToggleSpanStyle(index, false);
                    span.style.transform = style.transform;
                    span.style.opacity = style.opacity;
                });
            });
        });
    }

    // Loader
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader-wrapper');
        if (!loader) {
            return;
        }
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });

    // Carousel Logic
    document.addEventListener('DOMContentLoaded', () => {
        const track = document.getElementById('certTrack');
        const prevBtn = document.getElementById('certPrev');
        const nextBtn = document.getElementById('certNext');
        const dotsContainer = document.getElementById('certDots');

        if (!track || !prevBtn || !nextBtn || !dotsContainer) {
            return;
        }

        const cards = track.querySelectorAll('.cert-card');
        if (cards.length === 0) {
            return;
        }

        let currentIndex = 0;

        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function updateCarousel() {
            track.style.transform = PortfolioLogic.getCarouselTransform(currentIndex);
            dots.forEach((dot) => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = PortfolioLogic.getNextCarouselIndex(currentIndex, cards.length);
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = PortfolioLogic.getPrevCarouselIndex(currentIndex, cards.length);
            updateCarousel();
        }

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    });
}
