// Contact form return from FormSubmit (strip ?thanks= from URL, show note)
(function () {
    if (new URLSearchParams(location.search).get('thanks') !== '1') return;
    const intro = document.querySelector('.contact-intro');
    if (intro) {
        const note = document.createElement('p');
        note.className = 'contact-thanks';
        note.textContent = 'Thanks — your message is on its way. I\u2019ll be in touch soon.';
        intro.insertBefore(note, intro.firstChild);
    }
    const url = new URL(location.href);
    url.searchParams.delete('thanks');
    const clean = url.pathname + (url.search || '') + (url.hash || '');
    history.replaceState(null, '', clean);
})();

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const open = navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(open));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Smooth scrolling for in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hash = this.getAttribute('href');
        if (hash === '#') return;
        const target = document.querySelector(hash);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Highlight current top-level nav item
const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
        link.classList.add('active');
    }
});

// Subtle navbar shadow on scroll
const navbar = document.querySelector('.navbar');
function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 8);
}
updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

// Hero crossfading carousel (homepage)
(function () {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;
    const slides = carousel.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;

    let active = 0;
    setInterval(() => {
        slides[active].classList.remove('is-active');
        active = (active + 1) % slides.length;
        slides[active].classList.add('is-active');
    }, 5000);
})();

// Make detail-page gallery thumbnails keyboard accessible
(function () {
    const thumbs = document.querySelectorAll('.thumbnail[data-full-src]');
    thumbs.forEach((thumb, i) => {
        thumb.setAttribute('role', 'button');
        thumb.setAttribute('tabindex', '0');
        thumb.setAttribute('aria-label', 'View photo ' + (i + 1) + ' of ' + thumbs.length);
        thumb.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                thumb.click();
            }
        });
    });
})();

// Specs accordion (detail pages)
document.querySelectorAll('.specs-container').forEach(container => {
    const title = container.querySelector('.specs-title');
    if (!title) return;

    const toggle = document.createElement('button');
    toggle.className = 'specs-toggle';
    toggle.setAttribute('aria-expanded', 'true');

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
    body.className = 'specs-body open';
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
