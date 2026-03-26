// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to current nav item
const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
        link.classList.add('active');
    }
});

// Navbar background on scroll + hero logo hide/show
const navbar = document.querySelector('.navbar');
const heroSection = document.querySelector('.fullscreen-hero');

function updateNavbar() {
    if (!navbar) return;

    // Existing scrolled style
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Hide navbar logo while hero logo is in view
    if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight * 0.75;
        if (window.scrollY < heroBottom) {
            navbar.classList.add('hero-visible');
        } else {
            navbar.classList.remove('hero-visible');
        }
    }
}

// Set initial state without waiting for a scroll event
updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

// Hero Slideshow
if (document.querySelector('.hero-slideshow')) {
    const slides = document.querySelectorAll('.hero-slide');
    const heroFadeDurationMs = 2000;
    let currentSlide = 0;

    function nextSlide() {
        const outgoingSlide = slides[currentSlide];
        const outgoingMedia = outgoingSlide.querySelector('.hero-slide-media');

        if (outgoingMedia) {
            // Hold the current transform during the fade so the image does not snap back.
            outgoingMedia.style.transform = window.getComputedStyle(outgoingMedia).transform;
        }

        outgoingSlide.classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');

        if (outgoingMedia) {
            window.setTimeout(() => {
                outgoingMedia.style.transform = '';
            }, heroFadeDurationMs);
        }
    }

    if (slides.length > 1) {
        // Change slide every 6.5 seconds
        setInterval(nextSlide, 6500);
    }
}

// Specs accordion (detail pages)
document.querySelectorAll('.specs-container').forEach(container => {
    const title = container.querySelector('.specs-title');
    if (!title) return;

    const toggle = document.createElement('button');
    toggle.className = 'specs-toggle';
    toggle.setAttribute('aria-expanded', 'false');

    const label = document.createElement('span');
    label.className = 'specs-toggle-label';
    label.textContent = title.textContent;

    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.setAttribute('class', 'specs-chevron');
    chevron.setAttribute('viewBox', '0 0 24 24');
    chevron.setAttribute('fill', 'none');
    chevron.setAttribute('stroke', 'currentColor');
    chevron.setAttribute('stroke-width', '2');
    chevron.setAttribute('stroke-linecap', 'round');
    chevron.setAttribute('stroke-linejoin', 'round');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    poly.setAttribute('points', '6 9 12 15 18 9');
    chevron.appendChild(poly);

    toggle.appendChild(label);
    toggle.appendChild(chevron);

    const body = document.createElement('div');
    body.className = 'specs-body';
    Array.from(container.children).forEach(child => {
        if (child !== title) body.appendChild(child);
    });

    title.replaceWith(toggle);
    container.appendChild(body);

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        body.classList.toggle('open', !isOpen);
    });
});
