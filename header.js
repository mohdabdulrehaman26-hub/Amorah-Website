document.addEventListener("DOMContentLoaded", () => {
  
  // Load the header dynamically
  fetch("includes/header.html")
    .then(r => r.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;

      // After header is inserted → Activate Scroll Effect
      initHeaderScroll();
      initMobileMenu();
    });
});


// ---------------------------------------------
// HEADER SCROLL EFFECT
// ---------------------------------------------
function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;

  function applyHeader() {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  applyHeader();
  window.addEventListener("scroll", applyHeader);
}


// ---------------------------------------------
// MOBILE MENU SCRIPT
// ---------------------------------------------
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileBtn');
  const closeBtn = document.getElementById('closeBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileMenu = document.getElementById('mobileMenu');
  const body = document.body;

  function toggleMenu() {
    body.classList.toggle('mobile-active');
  }

  if (mobileBtn) mobileBtn.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu);
}
