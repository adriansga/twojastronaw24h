// ===== INLINE TOAST (zamiast alert) =====
function showInlineToast(message, type) {
    let toast = document.getElementById('inlineToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'inlineToast';
        toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#27AE60;color:#fff;padding:14px 24px;border-radius:50px;font-size:0.95rem;font-weight:600;z-index:10000;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:opacity 0.4s;pointer-events:none;';
        document.body.appendChild(toast);
    }
    toast.style.background = (type === 'error') ? '#e74c3c' : '#27AE60';
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 4000);
}

// ===== PORTFOLIO EXPAND =====
function initPortfolioExpand() {
    const expandBtn = document.getElementById('portfolioExpandBtn');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (!expandBtn || !portfolioGrid) return;
    
    expandBtn.addEventListener('click', () => {
        const isExpanded = portfolioGrid.classList.contains('expanded');
        
        if (isExpanded) {
            portfolioGrid.classList.remove('expanded');
            expandBtn.classList.remove('expanded');
            expandBtn.querySelector('span').textContent = 'Zobacz więcej realizacji';
            expandBtn.querySelector('i').classList.remove('fa-chevron-up');
            expandBtn.querySelector('i').classList.add('fa-chevron-down');
        } else {
            portfolioGrid.classList.add('expanded');
            expandBtn.classList.add('expanded');
            expandBtn.querySelector('span').textContent = 'Zwiń';
            expandBtn.querySelector('i').classList.remove('fa-chevron-down');
            expandBtn.querySelector('i').classList.add('fa-chevron-up');
        }
    });
}

// ===== HAMBURGER MENU =====
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Close menu on link click (mobile)
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.getElementById('navMenu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// ===== FAQ ACCORDION (z keyboard support i aria-expanded) =====
document.querySelectorAll('.faq-question').forEach(question => {
    function toggleFaq() {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Zamknij wszystkie inne
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            const q = item.querySelector('.faq-question');
            if (q) q.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isActive) {
            faqItem.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    }

    question.addEventListener('click', toggleFaq);
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFaq();
        }
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== 'javascript:openKalkulator()') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});


// ===== SOCIAL PROOF TOASTS =====
const socialProofMessages = [
    { text: "Ktoś z {city} poprosił o wycenę strony", icon: "📋" },
    { text: "Nowe zapytanie od firmy z {city}", icon: "📩" },
    { text: "Ktoś właśnie zadzwonił w sprawie strony", icon: "📞" },
    { text: "Właściciel firmy z {city} wypełnił brief", icon: "✅" },
    { text: "Nowy klient z {city} — realizacja w toku", icon: "🏠" },
];

const socialProofTimes = [
    "przed chwila", "2 min temu", "5 min temu",
    "8 min temu", "12 min temu", "18 min temu",
];

const socialProofCities = ["Warszawa", "Krakow", "Wroclaw", "Gdansk", "Poznan", "Lodz", "Katowice"];

let socialProofTimer;
let socialProofCount = 0;
const MAX_TOASTS = 5;
const FIRST_DELAY = 15000; // 15s
const NEXT_DELAY_MIN = 60000; // 60s (zmieniony z 30s na 60s - mniej intrusive)
const NEXT_DELAY_MAX = 90000; // 90s (zmieniony z 60s na 90s)
const TOAST_DURATION = 6000; // 6s

function showSocialProof() {
    if (socialProofCount >= MAX_TOASTS) return;

    // Nie pokazuj na mobile
    if (window.innerWidth < 768) return;

    const toast = document.getElementById('socialProofToast');
    const textEl = document.getElementById('toastText');
    const timeEl = document.getElementById('toastTime');

    if (!toast || !textEl || !timeEl) return;

    // Losowa wiadomosc
    const msg = socialProofMessages[Math.floor(Math.random() * socialProofMessages.length)];
    const time = socialProofTimes[Math.floor(Math.random() * socialProofTimes.length)];
    const city = socialProofCities[Math.floor(Math.random() * socialProofCities.length)];

    textEl.textContent = msg.text.replace('{city}', city);
    timeEl.textContent = time;
    toast.querySelector('.toast-icon').textContent = msg.icon;

    // Pokaz
    toast.classList.add('show');
    socialProofCount++;

    // Schowaj po TOAST_DURATION
    clearTimeout(socialProofTimer);
    socialProofTimer = setTimeout(() => {
        toast.classList.remove('show');

        // Zaplanuj nastepne
        if (socialProofCount < MAX_TOASTS) {
            const nextDelay = NEXT_DELAY_MIN + Math.random() * (NEXT_DELAY_MAX - NEXT_DELAY_MIN);
            clearTimeout(socialProofTimer);
            socialProofTimer = setTimeout(showSocialProof, nextDelay);
        }
    }, TOAST_DURATION);
}

function closeSocialProof() {
    const toast = document.getElementById('socialProofToast');
    if (toast) {
        toast.classList.remove('show');
    }
}

// Start social proof po zaladowaniu strony
window.addEventListener('load', () => {
    socialProofTimer = setTimeout(showSocialProof, FIRST_DELAY);
});

// Zatrzymaj social proof gdy uzytkownik wypelnia formularz
document.addEventListener('focus', (e) => {
    if (e.target.matches('input, textarea, select')) {
        clearTimeout(socialProofTimer);
    }
}, true);

document.addEventListener('blur', (e) => {
    if (e.target.matches('input, textarea, select')) {
        if (socialProofCount < MAX_TOASTS) {
            socialProofTimer = setTimeout(showSocialProof, NEXT_DELAY_MIN);
        }
    }
}, true);

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate cards on scroll
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card, .benefit-card, .problem-card, .timeline-item, .faq-item, .portfolio-item, .testimonial-card, .gwarancja-card, .comparison-row');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Initialize portfolio expand functionality
    initPortfolioExpand();
});

// ===== LOADING STATE (dla formularzy, nie dotyczy exit popup) =====
document.querySelectorAll('form:not(#exitPopupForm)').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                showInlineToast('✅ Wiadomość wysłana! Odezwiemy się w ciągu 24h.', 'success');
                form.reset();
            }, 2000);
        }
    });
});

// ===== COUNTDOWN TIMER (urgency bar, 72h z localStorage) =====
(function() {
    const key = 's24hUrgencyDeadline';
    let deadline;
    try {
        deadline = localStorage.getItem(key);
        if (!deadline) {
            deadline = Date.now() + 72 * 60 * 60 * 1000;
            localStorage.setItem(key, deadline);
        }
    } catch(e) {
        deadline = Date.now() + 72 * 60 * 60 * 1000;
    }
    const el = document.getElementById('urgencyCountdown');
    if (!el) return;
    function tick() {
        const diff = parseInt(deadline) - Date.now();
        if (diff <= 0) { el.textContent = '0h 00m 00s'; return; }
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        el.textContent = h + 'h ' + String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';
    }
    tick();
    setInterval(tick, 1000);
})();

// ===== ESC KEY — zamknij exit popup =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const popup = document.getElementById('exitPopup');
        if (popup && popup.classList.contains('active')) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ===== ACTIVE NAV HIGHLIGHT on scroll =====
(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active-nav'));
                const active = document.querySelector('.nav-menu a[href="#' + entry.target.id + '"]');
                if (active) active.classList.add('active-nav');
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(s => obs.observe(s));
})();

// ===== DEV INFO =====
// console.log('%c🚀 Stronaw24h', 'font-size:16px;font-weight:bold;color:#27AE60;');
