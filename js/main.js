/**
 * AMORAH GROUP - MAIN JAVASCRIPT (V12.1 – FINAL PRODUCTION)
 * =========================================================
 * 1. Configuration
 * 2. Initialization Sequence
 * 3. Tracking (Analytics/Pixels)
 * 4. Swipers (Marquee & Layouts)
 * 5. Component Loader (Header/Footer)
 * 6. UI & Navigation (Mobile Menu, Scroll)
 * 7. Form Handling
 * 8. Visuals (All Canvas Animations, AOS, Tilt)
 * 9. Widgets (WhatsApp, Cookies)
 */

/* ==========================================
   1. CONFIGURATION
========================================== */
const CONFIG = {
    GOOGLE_FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfX7XYrf-wF4OoHc92pnS9kaEzNPx5zWMdKpJort7OXvzvtqg/formResponse",
    NOTIFICATION_SOUND: "https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3",
    HEADER_HEIGHT: 92,
    ANIMATION_DURATION: 800,
    TRACKING: {
        GA_ID: "G-7C6ZVCVHQB",
        META_ID: "1281069910148431",
        LINKEDIN_ID: "518457798"
    }
};

/* ==========================================
   2. INITIALIZATION SEQUENCE
========================================== */
document.addEventListener('DOMContentLoaded', async () => {

    /* A. Load Header & Footer (Wait for completion) */
    try {
        await Promise.all([
            loadComponent('header', 'includes/header.html'),
            loadComponent('footer', 'includes/footer.html')
        ]);
        
        // UI Logic that depends on Header/Footer existing
        initMobileMenu(); 
        highlightActiveLink();
        updateCopyrightYear();
        
    } catch (error) {
        console.error("Error loading components:", error);
    }

    /* B. Core Logic (Immediate) */
    initStickyHeader();
    initSmoothScroll();
    initServiceTabs();
    initForms(); 

    /* C. Integrations */
    initTrackingSystem();
    initSwipers();

    /* D. Visuals & Widgets (Deferred) */
    setTimeout(() => {
        initAOS();
        initCounters();
        initCanvasAnimations(); // Handles Blue, Red, and Dots canvases
        initWhatsAppBubble();
        initCookieBanner();
        
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
        }
    }, 500); 
});

/* ==========================================
   3. TRACKING SYSTEM
========================================== */
function initTrackingSystem() {
    try {
        const { GA_ID, META_ID, LINKEDIN_ID } = CONFIG.TRACKING;

        // Google Analytics
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_ID);

        // Meta Pixel
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', META_ID);
        fbq('track', 'PageView');

        // LinkedIn Insight
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(LINKEDIN_ID);
        (function(l) {
        if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
        window.lintrk.q=[]}
        var s = document.getElementsByTagName("script")[0];
        var b = document.createElement("script");
        b.type = "text/javascript";b.async = true;
        b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
        s.parentNode.insertBefore(b, s);})(window.lintrk);

    } catch (e) {
        console.log("Tracking blocked.");
    }
}

/* ==========================================
   4. SWIPERS (MARQUEE & LAYOUTS)
========================================== */
function initSwipers() {
    if (typeof Swiper === 'undefined') {
        setTimeout(initSwipers, 100);
        return;
    }

    // 1. Continuous Marquee
    if (document.querySelector('.clientsSwiper') || document.querySelector('.toolsSwiper')) {
        new Swiper(".clientsSwiper, .toolsSwiper", {
            slidesPerView: "auto",
            spaceBetween: 60,
            loop: true,
            speed: 5000,
            allowTouchMove: false, 
            freeMode: true,
            freeModeMomentum: false,
            autoplay: { delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false },
            on: {
                init: function() {
                    this.wrapperEl.style.transitionTimingFunction = "linear";
                }
            }
        });
    }

    // 2. Global Presence
    if (document.querySelector('.gpTopSwiper') && document.querySelector('.gpMainSwiper')) {
        const gpTop = new Swiper(".gpTopSwiper", {
            slidesPerView: "auto",
            spaceBetween: 14,
            freeMode: true,
            watchSlidesProgress: true,
            loop: false,
            grabCursor: true
        });

        new Swiper(".gpMainSwiper", {
            slidesPerView: 1.2,
            spaceBetween: 20,
            centeredSlides: true,
            loop: false,
            speed: 600,
            autoplay: { delay: 3500, disableOnInteraction: false },
            thumbs: { swiper: gpTop },
            breakpoints: {
                640: { slidesPerView: 2, centeredSlides: false },
                1024: { slidesPerView: 4, centeredSlides: false }
            },
            pagination: { el: ".gp-pagination", clickable: true }
        });
    }

    // 3. Testimonials
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
   5. COMPONENT LOADER (WITH CACHE BUSTING)
========================================== */
async function loadComponent(id, path) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const version = new Date().getTime(); 
        const res = await fetch(`${path}?v=${version}`);
        
        if (!res.ok) throw new Error(res.status);
        el.innerHTML = await res.text();
        document.dispatchEvent(new Event(`${id}Loaded`));
        
        if(id === 'header') highlightActiveLink();
    } catch (e) {
        console.warn(`Component load failed: ${path}`);
    }
}

/* ==========================================
   6. UI & NAVIGATION
========================================== */
function updateCopyrightYear() {
    const y = document.getElementById('currentYear');
    if (y) y.textContent = new Date().getFullYear();
}

function initStickyHeader() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (!header) return;
        const scrolled = window.scrollY > 20;
        header.classList.toggle('scrolled', scrolled);
        header.classList.toggle('bg-white', scrolled);
        header.classList.toggle('shadow-md', scrolled);
        header.classList.toggle('bg-transparent', !scrolled);
        
        // Toggle Link Colors
        const links = header.querySelectorAll('.nav-link');
        links.forEach(link => {
            if (scrolled) {
                link.classList.remove('text-white');
                link.classList.add('text-slate-800');
            } else {
                link.classList.add('text-white');
                link.classList.remove('text-slate-800');
            }
        });
    }, { passive: true });
}

function initMobileMenu() {
    // Corrected IDs: mobileBtn, closeBtn
    document.addEventListener('click', e => {
        const toggleBtn = e.target.closest('#mobileBtn'); 
        const closeBtn = e.target.closest('#closeBtn');   
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileOverlay');
        const dropdownBtn = e.target.closest('.mobile-dropdown-btn');

        if (!menu || !overlay) return;

        if (toggleBtn) {
            menu.style.transform = 'translateX(0)';
            overlay.classList.remove('invisible', 'opacity-0');
            document.body.style.overflow = 'hidden';
        }

        if (closeBtn || e.target === overlay) {
            menu.style.transform = 'translateX(100%)';
            overlay.classList.add('invisible', 'opacity-0');
            document.body.style.overflow = '';
        }

        if (dropdownBtn) {
            const content = dropdownBtn.nextElementSibling;
            const icon = dropdownBtn.querySelector('.fa-chevron-down');
            if (content) {
                content.classList.toggle('hidden');
                if (icon) icon.classList.toggle('rotate-180');
            }
        }
    });
}

function highlightActiveLink() {
    setTimeout(() => {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(a => {
            const href = a.getAttribute('href');
            if(href === path || (path === 'index.html' && href === './')) {
                a.classList.add('text-blue-600');
                a.classList.remove('text-white');
            }
        });
    }, 300);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - CONFIG.HEADER_HEIGHT - 20,
                    behavior: 'smooth'
                });
                // Close menu if open
                const menu = document.getElementById("mobileMenu");
                const overlay = document.getElementById('mobileOverlay');
                if (menu && menu.style.transform === 'translateX(0px)') {
                     menu.style.transform = 'translateX(100%)';
                     if(overlay) overlay.classList.add('invisible', 'opacity-0');
                     document.body.style.overflow = '';
                }
            }
        });
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
            if (window.scrollY >= s.offsetTop - 180) current = s.id;
        });
        links.forEach(l => {
            l.classList.remove('active-tab');
            if(l.getAttribute('href').includes(current)) l.classList.add('active-tab');
        });
    }, { passive: true });
}

/* ==========================================
   7. FORM HANDLING
========================================== */
function initForms() {
    document.addEventListener('submit', async e => {
        const form = e.target;
        if (form.tagName !== 'FORM') return;
        if (form.id === 'coachingForm') return; 

        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn ? btn.innerHTML : 'Submit';
        const msg = form.querySelector('#formMsg');
        
        const honey = form.querySelector('input[name="bot_check"]');
        if(honey && honey.value) return;

        if(btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
        if(msg) msg.classList.add('hidden');

        try {
            await fetch(CONFIG.GOOGLE_FORM_URL, {
                method: 'POST', mode: 'no-cors', body: new FormData(form)
            });
            if(typeof gtag !== 'undefined') gtag('event', 'form_submit');
            
            if(msg) {
                msg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! We have received your request.';
                msg.className = "mt-4 text-green-600 font-bold text-center text-sm block bg-green-50 p-3 rounded-lg border border-green-200 animate-pulse";
                msg.classList.remove('hidden');
            }
            form.reset();
        } catch (err) {
            if(msg) {
                msg.textContent = "Connection error. Please try WhatsApp.";
                msg.className = "mt-4 text-red-500 font-bold text-center text-sm block bg-red-50 p-3 rounded-lg border border-red-200";
                msg.classList.remove('hidden');
            }
        } finally {
            setTimeout(() => {
                if(btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }
            }, 3000);
        }
    });
}

/* ==========================================
   8. VISUALS (ALL CANVAS ANIMATIONS)
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
            const target = +el.dataset.target || 0;
            let count = 0;
            const step = Math.ceil(target / 40);
            const timer = setInterval(() => {
                count += step;
                if (count >= target) {
                    el.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    el.textContent = count;
                }
            }, 30);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });
    els.forEach(el => obs.observe(el));
}

function initCanvasAnimations() {
    // Helper to setup a canvas (supports Red/Blue/Dots)
    const setupCanvas = (id, colorLine, colorDot, isNetwork) => {
        const canvas = document.getElementById(id);
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let w, h, dots = [];
        
        const resize = () => {
            w = canvas.width = canvas.parentElement.offsetWidth;
            h = canvas.height = canvas.parentElement.offsetHeight;
            initDots();
        };
        
        const initDots = () => {
            // Optimization: Fewer dots on mobile
            const count = window.innerWidth < 768 ? 30 : 80;
            dots = Array.from({ length: count }, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            dots.forEach((d, i) => {
                d.x += d.vx; d.y += d.vy;
                if (d.x < 0 || d.x > w) d.vx *= -1;
                if (d.y < 0 || d.y > h) d.vy *= -1;

                if (isNetwork) {
                    dots.slice(i + 1).forEach(o => {
                        const dist = Math.hypot(d.x - o.x, d.y - o.y);
                        if (dist < 110) {
                            // Extract opacity placeholder and replace
                            ctx.strokeStyle = colorLine.replace('OPACITY', (1 - dist / 110) * 0.4); 
                            ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(o.x, o.y); ctx.stroke();
                        }
                    });
                }
                ctx.fillStyle = colorDot;
                ctx.beginPath(); ctx.arc(d.x, d.y, 2, 0, Math.PI * 2); ctx.fill();
            });
            requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        
        // Use IntersectionObserver for performance
        new IntersectionObserver(e => { if(e[0].isIntersecting) draw(); }).observe(canvas);
    };

    // 1. Default Blue Network (Generic)
    setupCanvas('network-lines', 'rgba(37, 99, 235, OPACITY)', 'rgba(37, 99, 235, 0.4)', true);

    // 2. Red Network (Services Section)
    setupCanvas('network-lines-red', 'rgba(220, 38, 38, OPACITY)', 'rgba(220, 38, 38, 0.5)', true);

    // 3. Red Floating Dots (Why Choose Us) - No Lines
    setupCanvas('canvas-dots', null, 'rgba(220, 38, 38, 0.25)', false);
}

/* ==========================================
   9. WIDGETS (WHATSAPP & COOKIES)
========================================== */
function initWhatsAppBubble() {
    if (document.getElementById('wa-bubble')) return;
    
    setTimeout(() => {
        const bubble = document.createElement("div");
        bubble.id = "wa-bubble";
        // Uses Tailwind classes defined in CSS/HTML structure
        bubble.className = "fixed bottom-24 right-5 z-[9999] animate-fade-in-up";
        bubble.innerHTML = `
            <div class="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-[280px]">
                <div class="w-10 h-10 bg-[#25d366] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg">
                    <i class="fab fa-whatsapp text-xl"></i>
                </div>
                <div onclick="window.open('https://wa.me/916301694153?text=Hello%20Amorah','_blank')">
                    <p class="font-bold text-slate-800 text-sm">Welcome to Amorah 👋</p>
                    <p class="text-xs text-slate-500 mt-1">Need visa or job help? Chat now!</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-slate-400 hover:text-red-500 transition px-1">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        document.body.appendChild(bubble);
        
        const sound = new Audio(CONFIG.NOTIFICATION_SOUND);
        sound.volume = 0.4;
        sound.play().catch(() => {}); 
    }, 4000);
}

function initCookieBanner() {
    if (localStorage.getItem("cookieConsent")) return;

    setTimeout(() => {
        const banner = document.createElement("div");
        banner.className = "fixed bottom-0 left-0 w-full bg-slate-900 text-white p-4 z-[10000] flex flex-col md:flex-row items-center justify-center gap-4 text-sm shadow-2xl border-t border-slate-700";
        banner.innerHTML = `
            <div class="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
                <span class="text-xl">🍪</span>
                <p class="text-slate-300">We use cookies to improve user experience. By using our site, you agree to our <a href="privacy-policy.html" class="text-blue-400 underline">Privacy Policy</a>.</p>
            </div>
            <div class="flex gap-3">
                <button id="declineCookies" class="px-4 py-2 border border-slate-600 rounded-full hover:bg-slate-800 transition">Decline</button>
                <button id="acceptCookies" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-bold shadow-lg transition">Accept</button>
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
    }, 2000);
}
