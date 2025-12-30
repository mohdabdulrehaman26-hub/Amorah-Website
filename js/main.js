/**
 * AMORAH GROUP - MAIN JAVASCRIPT (V4.0 – FINAL RELEASE)
 * Includes: Sliders, Forms, Animations, Cookie Consent, and Google Ads
 */

/* ==========================================
   1. CONFIGURATION
========================================== */
const CONFIG = {
    // General Contact Form URL (Google Form Action)
    GOOGLE_FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfX7XYrf-wF4OoHc92pnS9kaEzNPx5zWMdKpJort7OXvzvtqg/formResponse",
    
    // Notification Sound for WhatsApp Bubble
    NOTIFICATION_SOUND: "https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3",
    
    HEADER_HEIGHT: 92,
    ANIMATION_DURATION: 800
};

/* ==========================================
   2. INITIALIZATION
========================================== */
document.addEventListener('DOMContentLoaded', async () => {

    /* A. Load Header & Footer Dynamically */
    await Promise.all([
        loadComponent('header', 'includes/header.html'),
        loadComponent('footer', 'includes/footer.html')
    ]);

    /* B. Core Logic (Runs Immediately) */
    initMobileMenu();
    initStickyHeader();
    highlightActiveLink();
    updateCopyrightYear();
    initSmoothScroll();
    initServiceTabs();
    initForms(); 

    /* C. Sliders (Runs Immediately with Retry) */
    initSwipers();

    /* D. Visuals (Deferred for Performance) */
    setTimeout(() => {
        initAOS();
        initCounters();
        initCanvasAnimations();
        initWhatsAppBubble();
    }, 120);
});

/* ==========================================
   3. SWIPERS (ALL SLIDER LOGIC)
========================================== */
function initSwipers() {
    // Safety Check: If Swiper library isn't loaded yet, retry in 100ms
    if (typeof Swiper === 'undefined') {
        setTimeout(initSwipers, 100);
        return;
    }

    /* 1. Marquee Sliders (Clients & Tools) */
    if (document.querySelector('.clientsSwiper') || document.querySelector('.toolsSwiper')) {
        new Swiper(".clientsSwiper, .toolsSwiper", {
            slidesPerView: "auto", // Relies on CSS width: auto
            spaceBetween: 40,
            loop: true,
            speed: 4000, // Linear continuous speed
            allowTouchMove: false, 
            autoplay: {
                delay: 0, // No pause between slides
                disableOnInteraction: false,
                pauseOnMouseEnter: false
            }
        });
    }

    /* 2. Global Presence – STRICT SYNC */
    if (document.querySelector('.gpTopSwiper') && document.querySelector('.gpMainSwiper')) {
        
        // Top Text Bar
        const gpTop = new Swiper(".gpTopSwiper", {
            slidesPerView: "auto",
            spaceBetween: 14,
            freeMode: true,
            watchSlidesProgress: true,
            loop: false,
            grabCursor: true
        });

        // Bottom Cards
        new Swiper(".gpMainSwiper", {
            slidesPerView: 1.2,
            spaceBetween: 20,
            centeredSlides: true,
            loop: false,
            speed: 600,
            autoplay: {
                delay: 3200,
                pauseOnMouseEnter: true,
                disableOnInteraction: false
            },
            thumbs: { swiper: gpTop },
            breakpoints: {
                640: { slidesPerView: 2, centeredSlides: false },
                1024: { slidesPerView: 4, centeredSlides: false }
            },
            pagination: { el: ".gp-pagination", clickable: true }
        });
    }

    /* 3. Testimonials */
    if (document.querySelector('.testimonialSwiper')) {
        new Swiper(".testimonialSwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: { delay: 5000 },
            pagination: { el: ".testi-pagination", clickable: true },
            breakpoints: { 768: { slidesPerView: 2 } }
        });
    }
}

/* ==========================================
   4. COMPONENT LOADER
========================================== */
async function loadComponent(id, path) {
    const el = document.getElementById(id);
    if (!el) return;

    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(res.status);
        el.innerHTML = await res.text();
        document.dispatchEvent(new Event(`${id}Loaded`));
    } catch (e) {
        console.warn(`Component load failed: ${path} (Note: Use Live Server)`);
    }
}

/* ==========================================
   5. UI & NAVIGATION
========================================== */
function updateCopyrightYear() {
    const y = document.getElementById('currentYear');
    if (y) y.textContent = new Date().getFullYear();
}

function initStickyHeader() {
    setTimeout(() => {
        const header = document.querySelector('.header');
        if (!header) return;

        const toggle = () => {
            const scrolled = window.scrollY > 20;
            header.classList.toggle('scrolled', scrolled);
            header.classList.toggle('bg-white', scrolled);
            header.classList.toggle('shadow-md', scrolled);
            header.classList.toggle('bg-transparent', !scrolled);
        };

        window.addEventListener('scroll', toggle, { passive: true });
        toggle(); 
    }, 120);
}

function initMobileMenu() {
    document.addEventListener('click', e => {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileOverlay');
        if (!menu || !overlay) return;

        if (e.target.closest('#mobileBtn')) {
            menu.style.transform = 'translateX(0)';
            overlay.classList.remove('opacity-0', 'invisible');
            document.body.style.overflow = 'hidden';
        }

        if (e.target.closest('#closeBtn') || e.target.closest('#mobileOverlay')) {
            menu.style.transform = 'translateX(100%)';
            overlay.classList.add('opacity-0', 'invisible');
            document.body.style.overflow = '';
        }
    });
}

function highlightActiveLink() {
    setTimeout(() => {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link, .mobile-menu a')
            .forEach(a => {
                if(a.getAttribute('href') === path) {
                    a.classList.add('text-blue-600');
                    a.classList.remove('text-white');
                }
            });
    }, 200);
}

function initSmoothScroll() {
    document.addEventListener('click', e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href');
        if(targetId === '#' || targetId.length < 2) return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        window.scrollTo({
            top: target.offsetTop - CONFIG.HEADER_HEIGHT - 20,
            behavior: 'smooth'
        });
        
        const overlay = document.getElementById('mobileOverlay');
        if(overlay && !overlay.classList.contains('invisible')) {
            overlay.click();
        }
    });
}

function initServiceTabs() {
    const tabs = document.querySelector('.sticky-tabs');
    if (!tabs) return;

    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".tab-link");

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 150) current = s.id;
        });
        links.forEach(l => {
            l.classList.remove('active-tab');
            if(l.getAttribute('href').includes(current)) l.classList.add('active-tab');
        });
    });
}

/* ==========================================
   6. FORM HANDLING
========================================== */
function initForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async e => {
            // Skip Coaching form (handled by iframe in HTML)
            if(form.id === 'coachingForm') return; 

            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            const msg = form.querySelector('#formMsg');
            
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                // 1. Send to Google Forms
                await fetch(CONFIG.GOOGLE_FORM_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: new FormData(form)
                });
                
                // 2. Google Ads Conversion Tracking
                if(typeof gtag !== 'undefined') {
                    // Replace 'AW-CONVERSION_ID/LABEL_HERE' with real ID
                    gtag('event', 'conversion', {
                        'send_to': 'AW-CONVERSION_ID/LABEL_HERE', 
                        'value': 1.0,
                        'currency': 'INR'
                    });
                }

                // 3. Success Message
                if(msg) {
                    msg.textContent = "Thank you! We've received your request.";
                    msg.className = "mt-4 text-green-600 font-bold text-center text-sm block";
                    msg.classList.remove('hidden');
                }
                form.reset();

            } catch (err) {
                // 4. Error Message
                if(msg) {
                    msg.textContent = "Submission failed. Please call us directly.";
                    msg.className = "mt-4 text-red-500 font-bold text-center text-sm block";
                    msg.classList.remove('hidden');
                }
                console.error(err);
            } finally {
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }, 3000);
            }
        });
    });
}

/* ==========================================
   7. ANIMATIONS & COUNTERS
========================================== */
function initAOS() {
    if (window.AOS) AOS.init({ duration: CONFIG.ANIMATION_DURATION, once: true });
}

function initCounters() {
    const els = document.querySelectorAll('.counter-num, .gp-number');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = +el.dataset.target;
            let count = 0;
            const step = Math.ceil(target / 60);

            const tick = () => {
                count += step;
                if (count < target) {
                    el.textContent = count;
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target + '+';
                }
            };
            tick();
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    els.forEach(el => obs.observe(el));
}

/* ==========================================
   8. CANVAS NETWORK
========================================== */
function initCanvasAnimations() {
    const canvas = document.getElementById("network-lines");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let w, h;
    const resize = () => {
        w = canvas.width = canvas.parentElement.offsetWidth;
        h = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const dots = Array.from({ length: window.innerWidth < 768 ? 25 : 50 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - .5) * .5,
        vy: (Math.random() - .5) * .5
    }));

    const draw = () => {
        ctx.clearRect(0, 0, w, h);
        dots.forEach((d, i) => {
            d.x += d.vx; d.y += d.vy;
            if (d.x < 0 || d.x > w) d.vx *= -1;
            if (d.y < 0 || d.y > h) d.vy *= -1;

            dots.slice(i + 1).forEach(o => {
                const dist = Math.hypot(d.x - o.x, d.y - o.y);
                if (dist < 120) {
                    ctx.strokeStyle = `rgba(37,99,235,${0.15 * (1 - dist / 120)})`;
                    ctx.beginPath();
                    ctx.moveTo(d.x, d.y);
                    ctx.lineTo(o.x, o.y);
                    ctx.stroke();
                }
            });

            ctx.fillStyle = "rgba(37,99,235,.5)";
            ctx.beginPath();
            ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    };

    new IntersectionObserver(e => e[0].isIntersecting && draw()).observe(canvas);
}

/* ==========================================
   9. WHATSAPP BUBBLE
========================================== */
function initWhatsAppBubble() {
    if (document.getElementById('wa-bubble')) return;

    const sound = new Audio(CONFIG.NOTIFICATION_SOUND);
    sound.volume = 0.6;

    setTimeout(() => {
        const bubble = document.createElement("div");
        bubble.id = "wa-bubble";
        bubble.innerHTML = `
            <div class="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-[280px] transform translate-y-10 opacity-0 transition-all duration-500">
                <div class="w-10 h-10 bg-[#25d366] rounded-full flex items-center justify-center text-white shrink-0">
                    <i class="fab fa-whatsapp text-xl"></i>
                </div>
                <div onclick="window.open('https://wa.me/916301694153','_blank')">
                    <p class="font-bold text-slate-800 text-sm">Welcome to Amorah 👋</p>
                    <p class="text-xs text-slate-500 mt-1">Hi there! How can we help you today?</p>
                </div>
                <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-red-500 transition">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        
        Object.assign(bubble.style, {
            position: 'fixed', bottom: '90px', right: '20px', zIndex: '9999'
        });
        
        document.body.appendChild(bubble);
        
        requestAnimationFrame(() => {
            const inner = bubble.firstElementChild;
            inner.classList.remove('translate-y-10', 'opacity-0');
            sound.play().catch(() => {});
        });
    }, 5000);
}

/* ==========================================
   10. COOKIE CONSENT BANNER (GDPR)
========================================== */
(function initCookieBanner() {
    if (localStorage.getItem("cookieConsent")) return; // Check if already accepted/declined

    setTimeout(() => {
        const banner = document.createElement("div");
        banner.innerHTML = `
            <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; background: #0f172a; color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000; display: flex; flex-direction: column; md:flex-row; align-items: center; justify-content: space-between; gap: 1rem; max-width: 1200px; margin: 0 auto; border: 1px solid #334155;">
                <div style="flex: 1;">
                    <p style="font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; margin-top:0;">🍪 We use cookies</p>
                    <p style="font-size: 0.9rem; color: #cbd5e1; margin:0;">We use cookies to improve your experience and analyze website traffic. By clicking "Accept", you agree to our use of cookies.</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button id="declineCookies" style="padding: 0.6rem 1.2rem; border-radius: 99px; font-weight: 600; font-size: 0.9rem; color: white; border: 1px solid #475569; background: transparent; cursor: pointer;">Decline</button>
                    <button id="acceptCookies" style="padding: 0.6rem 1.8rem; border-radius: 99px; font-weight: 600; font-size: 0.9rem; color: white; background: #2563eb; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);">Accept</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById("acceptCookies").onclick = () => {
            localStorage.setItem("cookieConsent", "true");
            banner.remove();
        };

        document.getElementById("declineCookies").onclick = () => {
            localStorage.setItem("cookieConsent", "false");
            banner.remove();
        };
    }, 2000); // Show after 2 seconds
})();