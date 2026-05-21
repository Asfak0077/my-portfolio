// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active Link Highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');

const options = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href').substring(1) === entry.target.id) {
                    item.classList.add('active');
                }
            });
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

// Typewriter Effect
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
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
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
}

// Mobile Menu Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (navLinks.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    });
});

// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');
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
    
    if(!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = track.querySelectorAll('.cert-card');
    if(cards.length === 0) return;

    let currentIndex = 0;

    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
});
