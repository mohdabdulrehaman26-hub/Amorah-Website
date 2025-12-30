/**
 * ==========================================================================
 * AMORAH GROUP - LINKS INITIALIZATION ENGINE (V12.0)
 * --------------------------------------------------------------------------
 * Automatically injects centralized links into the DOM after load.
 * ==========================================================================
 */

function applyGlobalLinks() {
    // 1. Map links using the data-link attribute
    // Example: <a data-link="whatsapp_chat"></a>
    const linkElements = document.querySelectorAll('[data-link]');
    
    linkElements.forEach(el => {
        const linkKey = el.getAttribute('data-link');
        if (EXTERNAL_LINKS[linkKey]) {
            el.href = EXTERNAL_LINKS[linkKey];
            
            // Auto-apply security for external links
            if (EXTERNAL_LINKS[linkKey].startsWith('http')) {
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'noopener noreferrer');
            }
        }
    });

    // 2. Map images/assets using the data-asset attribute
    // Example: <img data-asset="brand_logo">
    const assetElements = document.querySelectorAll('[data-asset]');
    
    assetElements.forEach(el => {
        const assetKey = el.getAttribute('data-asset');
        if (EXTERNAL_LINKS[assetKey]) {
            if (el.tagName === 'IMG') el.src = EXTERNAL_LINKS[assetKey];
            if (el.tagName === 'SOURCE') el.src = EXTERNAL_LINKS[assetKey];
        }
    });

    console.log("Amorah Engine: Global links and assets synchronized.");
}

/**
 * INITIALIZATION SEQUENCE
 * We must wait for 'componentsLoaded' event triggered by main.js
 * to ensure the Header and Footer are present before scanning.
 */
document.addEventListener('componentsLoaded', applyGlobalLinks);

// Fallback: If no components are injected, run on standard load
window.addEventListener('load', () => {
    if (document.querySelectorAll('[data-link]').length > 0) {
        applyGlobalLinks();
    }
});