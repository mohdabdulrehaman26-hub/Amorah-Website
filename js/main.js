/**
 * AMORAH GROUP - MAIN JAVASCRIPT (FINAL PRODUCTION v15.0)
 * =========================================================
 * Modular Architecture | Error Handling | Performance Optimized
 */

const CONFIG = {
    // Google Form Endpoint (Contact/Newsletter)
    GOOGLE_FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfX7XYrf-wF4OoHc92pnS9kaEzNPx5zWMdKpJort7OXvzvtqg/formResponse",
    
    // Coaching Form Endpoint (Separate Sheet)
    COACHING_FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfi7WtJPDe3aMmXxc7PMOJHzTv8t2x-EyfcUx_nfUq8JSzMLg/formResponse",
    
    NOTIFICATION_SOUND: "https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3",
    HEADER_HEIGHT: 92,
    ANIMATION_DURATION: 800,
    TRACKING: {
        GA_ID: "G-7C6ZVCVHQB",
        META_ID: "1281069910148431",
        LINKEDIN_ID: "518457798"
    }
};

/* --- INITIALIZATION SEQUENCE --- */
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Load Global Components (Header/Footer)
    try {
        await Promise.all([
            loadComponent('header', 'includes/header.html'),
            loadComponent('footer', 'includes/footer.html')
        ]);
        
        // Trigger dependent logic once HTML is injected
        initMobileMenu();
        highlightActiveLink();
        updateCopyrightYear();
        
        // Custom Event for other scripts (like links-init.js)
        document.dispatchEvent(new Event('componentsLoaded'));
        
    } catch (error) {
        console.warn("Component loading warning:", error);
    }

    // 2. Core Features (Immediate)
    initStickyHeader();
    initSmoothScroll();
    initServiceTabs(); // For services.html scrolling
    initForms();       // Handles all forms

    // 3. Integrations (Immediate)
    initTrackingSystem();
    initSwipers();     // Sliders/Carousels

    // 4. Deferred Integrations (Visuals & Widgets - 500ms delay)
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
   3. COMPONENT LOADER
========================================== */
async function loadComponent(id, path) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        // Cache busting to ensure fresh content on deployment updates
        const version = new Date().getTime(); 
        const res = await fetch(`${path}?v=${version}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        el.innerHTML = await res.text();
    } catch (e) {
        console.error(`Failed to load ${path}`, e);
        // Fallback: If header fails, ensure body isn't hidden
        document.body.style.opacity = '1';
    }
}

/* ==========================================
   4. TRACKING SYSTEM
========================================== */
function initTrackingSystem() {
    try {
        const { GA_ID, META_ID, LINKEDIN_ID } = CONFIG.TRACKING;

        // Google Analytics
        if (!document.getElementById('ga-script')) {
            const gaScript = document.createElement('script');
            gaScript.id = 'ga-script';
            gaScript.async = true;
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
            document.head.appendChild(gaScript);

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', GA_ID);
        }

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
        console.log("Tracking blocked or failed to initialize.");
    }
}

/* ==========================================
   5. UI & NAVIGATION
========================================== */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    // Use specific ID selector to update mobile button color
    const updateHeaderState = () => {
        const scrolled = window.scrollY > 20;
        const mobileBtn = document.getElementById('mobileBtn');
        
        // 1. Header Background
        header.classList.toggle('scrolled', scrolled);
        
        // 2. Desktop Links
        const links = header.querySelectorAll('.nav-link');
        links.forEach(l => {
            if(scrolled) { 
                l.classList.remove('text-white'); 
                l.classList.add('text-slate-800'); 
            } else { 
                l.classList.add('text-white'); 
                l.classList.remove('text-slate-800'); 
            }
        });

        // 3. Mobile Button Color Fix
        if(mobileBtn) {
            if(scrolled) {
                mobileBtn.style.color = '#0f172a'; // Dark
            } else {
                mobileBtn.style.color = '#ffffff'; // White
            }
        }
    };

    // Initialize immediately
    updateHeaderState();
    
    // Update on scroll
    window.addEventListener('scroll', updateHeaderState, { passive: true });
}

function initMobileMenu() {
    // Event delegation for dynamic elements
    document.addEventListener('click', e => {
        const toggle = e.target.closest('#mobileBtn');
        const close = e.target.closest('#closeBtn');
        const overlay = document.getElementById('mobileOverlay');
        const menu = document.getElementById('mobileMenu');
        
        // Open Menu
        if (toggle && menu) {
            menu.style.transform = 'translateX(0)';
            if(overlay) {
                overlay.classList.remove('invisible', 'opacity-0');
            }
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        // Close Menu
        if ((close || e.target === overlay) && menu) {
            menu.style.transform = 'translateX(100%)';
            if(overlay) {
                overlay.classList.add('invisible', 'opacity-0');
            }
            document.body.style.overflow = '';
        }
        
        // Mobile Dropdown Toggle
        const dropBtn = e.target.closest('.mobile-dropdown-btn');
        if (dropBtn) {
            const content = dropBtn.nextElementSibling;
            const icon = dropBtn.querySelector('.fa-chevron-down');
            if (content) {
                content.classList.toggle('hidden');
                if (icon) icon.classList.toggle('rotate-180');
            }
        }
    });
}

function highlightActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(a => {
        const href = a.getAttribute('href');
        // Basic match
        if(href === path) {
            a.classList.add('text-blue-600');
            a.classList.remove('text-white');
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetPosition = target.offsetTop - CONFIG.HEADER_HEIGHT - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // If mobile menu is open, close it
                const menu = document.getElementById("mobileMenu");
                const overlay = document.getElementById("mobileOverlay");
                if (menu && menu.getBoundingClientRect().x === 0) {
                    menu.style.transform = 'translateX(100%)';
                    if(overlay) overlay.classList.add('invisible', 'opacity-0');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

function initServiceTabs() {
    // Specifically for services.html sticky sub-nav
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".tab-link");
    
    if(!links.length) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;
        
        sections.forEach(s => {
            const sectionTop = s.offsetTop;
            const sectionHeight = s.offsetHeight;
            if (scrollY >= sectionTop - 200 && scrollY < sectionTop + sectionHeight) {
                current = s.getAttribute("id");
            }
        });

        links.forEach(l => {
            l.classList.remove('active-tab');
            if(l.getAttribute('href').includes(current)) {
                l.classList.add('active-tab');
            }
        });
    }, { passive: true });
}

/* ==========================================
   6. FORM HANDLING
========================================== */
function initForms() {
    document.addEventListener('submit', async e => {
        const form = e.target;
        if (form.tagName !== 'FORM') return;

        e.preventDefault();
        
        // Determine URL based on form ID
        let targetUrl = CONFIG.GOOGLE_FORM_URL;
        if (form.id === 'coachingForm') targetUrl = CONFIG.COACHING_FORM_URL;

        const btn = form.querySelector('button[type="submit"]');
        const origText = btn ? btn.innerHTML : 'Submit';
        const msg = form.querySelector('#formMsg');
        
        // 1. Honeypot Spam Check
        const honey = form.querySelector('input[name="bot_check"]');
        if(honey && honey.value) {
            console.log("Bot detected");
            return; // Silent fail for bots
        }

        // 2. UI Loading State
        if(btn) { 
            btn.disabled = true; 
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'; 
        }
        
        // 3. Submission
        try {
            await fetch(targetUrl, { 
                method: 'POST', 
                mode: 'no-cors', // Important for Google Forms
                body: new FormData(form) 
            });

            // 4. Success Handling
            if(msg) {
                msg.innerHTML = '<i class="fas fa-check-circle"></i> Success! We will contact you shortly.';
                msg.className = "mt-4 text-green-700 font-bold text-center block bg-green-50 p-3 rounded-lg border border-green-200 shadow-sm";
                msg.classList.remove('hidden');
            }
            form.reset();

            // Track Event (if GTM is active)
            if(window.dataLayer) {
                window.dataLayer.push({'event': 'form_submission', 'form_id': form.id});
            }

        } catch (err) {
            // 5. Error Handling
            if(msg) {
                msg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Network Error. Please use WhatsApp.';
                msg.className = "mt-4 text-red-600 font-bold text-center block bg-red-50 p-3 rounded-lg border border-red-200";
                msg.classList.remove('hidden');
            }
        } finally {
            // 6. Reset Button
            setTimeout(() => { 
                if(btn) { 
                    btn.disabled = false; 
                    btn.innerHTML = origText; 
                } 
                if(msg) {
                    setTimeout(() => msg.classList.add('hidden'), 8000); // Hide msg after 8s
                }
            }, 2000);
        }
    });
}

/* ==========================================
   7. SWIPER SLIDERS
========================================== */
function initSwipers() {
    if (typeof Swiper === 'undefined') return;

    // 1. Infinite Marquee (Clients / Tools)
    if (document.querySelector('.clientsSwiper') || document.querySelector('.toolsSwiper')) {
        new Swiper(".clientsSwiper, .toolsSwiper", {
            slidesPerView: "auto",
            spaceBetween: 60,
            loop: true,
            speed: 4000, // Smooth continuous speed
            allowTouchMove: false,
            autoplay: { delay: 0, disableOnInteraction: false },
            on: { 
                init: function() { 
                    this.wrapperEl.style.transitionTimingFunction = "linear"; 
                } 
            }
        });
    }

    // 2. Global Presence (Synced Sliders)
    if (document.querySelector('.gpTopSwiper') && document.querySelector('.gpMainSwiper')) {
        const gpTop = new Swiper(".gpTopSwiper", {
            slidesPerView: "auto",
            spaceBetween: 14,
            freeMode: true,
            watchSlidesProgress: true
        });
        new Swiper(".gpMainSwiper", {
            slidesPerView: 1.2,
            spaceBetween: 20,
            centeredSlides: true,
            loop: false,
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
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: ".testi-pagination", clickable: true },
            breakpoints: {
                768: { slidesPerView: 2 }
            }
        });
    }
}

/* ==========================================
   8. VISUALS & ANIMATIONS
========================================== */
function initAOS() { 
    if (window.AOS) {
        AOS.init({ 
            duration: CONFIG.ANIMATION_DURATION, 
            once: true,
            offset: 100
        }); 
    }
}

function initCounters() {
    const els = document.querySelectorAll('.counter-num, .gp-number');
    
    const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = +el.dataset.target; // Get number from data-target
                if(!target) return;

                let count = 0;
                const duration = 2000; // 2 seconds
                const steps = 60;
                const increment = target / steps;
                const intervalTime = duration / steps;

                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) { 
                        el.textContent = target + '+'; 
                        clearInterval(timer); 
                    } else { 
                        el.textContent = Math.ceil(count); 
                    }
                }, intervalTime);
                
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    els.forEach(el => obs.observe(el));
}

function initCanvasAnimations() {
    const setup = (id, colorString, isNet) => {
        const cvs = document.getElementById(id);
        if(!cvs) return;
        
        const ctx = cvs.getContext("2d");
        let w, h, dots = [];
        
        const resize = () => { 
            w = cvs.width = cvs.parentElement.offsetWidth; 
            h = cvs.height = cvs.parentElement.offsetHeight; 
            init(); 
        };
        
        const init = () => { 
            // Fewer dots on mobile for performance
            const count = window.innerWidth < 768 ? 30 : 60;
            dots = Array.from({length: count}, () => ({
                x: Math.random() * w, 
                y: Math.random() * h, 
                vx: (Math.random() - 0.5) * 0.5, 
                vy: (Math.random() - 0.5) * 0.5
            })); 
        };
        
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            dots.forEach((d, i) => {
                d.x += d.vx; 
                d.y += d.vy;
                
                // Bounce off walls
                if(d.x < 0 || d.x > w) d.vx *= -1; 
                if(d.y < 0 || d.y > h) d.vy *= -1;
                
                if(isNet) {
                    // Draw connecting lines
                    dots.slice(i + 1).forEach(o => {
                        const dist = Math.hypot(d.x - o.x, d.y - o.y);
                        if(dist < 100) {
                            // Dynamic opacity based on distance
                            const alpha = (1 - dist / 100) * 0.3;
                            // Replace placeholder OP with calculated alpha
                            ctx.strokeStyle = colorString.replace('OP', alpha);
                            ctx.beginPath(); 
                            ctx.moveTo(d.x, d.y); 
                            ctx.lineTo(o.x, o.y); 
                            ctx.stroke();
                        }
                    });
                }
                
                // Draw Dot
                ctx.fillStyle = colorString.replace('OP', 0.4);
                ctx.beginPath(); 
                ctx.arc(d.x, d.y, 2, 0, Math.PI * 2); 
                ctx.fill();
            });
            requestAnimationFrame(draw);
        };
        
        window.addEventListener('resize', resize); 
        resize();
        
        // Only animate when visible to save battery
        new IntersectionObserver(e => {
            if(e[0].isIntersecting) draw();
        }).observe(cvs);
    };
    
    // Initialize specific canvases
    setup('network-lines-red', 'rgba(220, 38, 38, OP)', true); // Red Network
    setup('canvas-dots', 'rgba(37, 99, 235, OP)', false);      // Blue Dots
}

/* ==========================================
   9. WIDGETS
========================================== */
function initWhatsAppBubble() {
    if(document.getElementById('wa-bubble')) return;
    
    setTimeout(() => {
        const b = document.createElement("div");
        b.id = "wa-bubble";
        b.className = "fixed bottom-24 right-5 z-[999] animate-bounce-slow";
        b.innerHTML = `
            <div class="flex items-center gap-3 p-4 bg-white rounded-xl shadow-2xl border border-slate-100 cursor-pointer" onclick="window.open('${EXTERNAL_LINKS?.whatsapp_chat || "#"}', '_blank')">
                <div class="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl shadow-lg relative">
                    <i class="fab fa-whatsapp"></i>
                    <span class="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                    <p class="font-bold text-slate-800 text-sm">Welcome to Amorah 👋 </p>
                    <p class="text-xs text-green-600 font-semibold">How can we assist you today?</p>
                </div>
                <button onclick="event.stopPropagation(); this.closest('#wa-bubble').remove()" class="text-slate-300 hover:text-red-500 ml-2 p-1">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        document.body.appendChild(b);
        
        // Play gentle sound
        new Audio(CONFIG.NOTIFICATION_SOUND).play().catch(()=>{});
    }, 4000); // Show after 4 seconds
}

function initCookieBanner() {
    if (localStorage.getItem("cookieConsent")) return;

    setTimeout(() => {
        const banner = document.createElement("div");
        banner.className = "fixed bottom-0 left-0 w-full bg-slate-900 text-white p-4 z-[10000] flex flex-col md:flex-row items-center justify-center gap-4 text-sm shadow-2xl border-t border-slate-700 animate-slide-up";
        banner.innerHTML = `
            <div class="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
                <span class="text-xl">🍪</span>
                <p class="text-slate-300">We use cookies to improve user experience. By using our site, you agree to our <a href="privacy-policy.html" class="text-blue-400 underline hover:text-blue-300">Privacy Policy</a>.</p>
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

function updateCopyrightYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
}
