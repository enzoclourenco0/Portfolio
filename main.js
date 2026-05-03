// ===== PORTFOLIO MAIN JS — BLACK & WHITE CINEMATIC =====

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initClock();
    initMenu();
    initScrollReveal();
    initSmoothScroll();
    initSkillBars();
    initWorkPreview();
    initYear();
    initMagneticButtons();
});

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    // Check for touch device
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows directly
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;

        // Follower lags behind
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;
        follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverables = document.querySelectorAll('a, button, [data-magnetic]');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            follower.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            follower.classList.remove('hovering');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
}

// ===== LIVE CLOCK =====
function initClock() {
    const timeEl = document.getElementById('nav-time');
    if (!timeEl) return;

    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}:${seconds}`;
    }

    update();
    setInterval(update, 1000);
}

// ===== FULLSCREEN MENU =====
function initMenu() {
    const btn = document.getElementById('nav-menu-btn');
    const overlay = document.getElementById('menu-overlay');
    if (!btn || !overlay) return;

    let isOpen = false;

    btn.addEventListener('click', () => {
        isOpen = !isOpen;
        btn.classList.toggle('active', isOpen);
        overlay.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    overlay.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            isOpen = false;
            btn.classList.remove('active');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach((el, i) => {
        // Stagger siblings
        const parent = el.parentElement;
        const siblings = parent ? Array.from(parent.children).filter(c => c.classList.contains('reveal-up')) : [];
        const idx = siblings.indexOf(el);
        if (idx > 0) {
            el.style.transitionDelay = `${idx * 0.1}s`;
        }
        observer.observe(el);
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    fills.forEach(fill => observer.observe(fill));
}

// ===== WORK PREVIEW ON HOVER =====
function initWorkPreview() {
    const preview = document.getElementById('work-preview');
    const previewImg = document.getElementById('work-preview-img');
    const workItems = document.querySelectorAll('.work-item');

    if (!preview || !previewImg || !workItems.length) return;

    // Don't run on mobile
    if (window.innerWidth < 1024) return;

    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;

    workItems.forEach(item => {
        const imgSrc = item.getAttribute('data-img');

        item.addEventListener('mouseenter', () => {
            previewImg.src = imgSrc;
            preview.classList.add('visible');
        });

        item.addEventListener('mouseleave', () => {
            preview.classList.remove('visible');
        });

        item.addEventListener('mousemove', (e) => {
            targetX = e.clientX + 20;
            targetY = e.clientY - 100;
        });
    });

    function animatePreview() {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        preview.style.left = currentX + 'px';
        preview.style.top = currentY + 'px';
        requestAnimationFrame(animatePreview);
    }
    animatePreview();
}

// ===== YEAR =====
function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

// ===== MAGNETIC BUTTONS =====
function initMagneticButtons() {
    if ('ontouchstart' in window) return;

    const magnetics = document.querySelectorAll('[data-magnetic]');

    magnetics.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => el.style.transition = '', 400);
        });
    });
}

