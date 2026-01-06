/**
 * ==========================================================================
 * AMORAH GROUP - EXTERNAL LINKS REPOSITORY (V15.0)
 * --------------------------------------------------------------------------
 * Centralized data object for all external and high-priority internal links.
 * Works in tandem with links-init.js to sync the DOM.
 * ==========================================================================
 */

const EXTERNAL_LINKS = {
    // --- BRAND IDENTITY ---
    brand_logo: "https://amorahgroup.in/assets/images/amorah-logo.png",
    
    // --- SOCIAL MEDIA CHANNELS ---
    facebook: "https://www.facebook.com/amorahinfotech",
    instagram: "https://www.instagram.com/amorah_info_tech/",
    linkedin: "https://www.linkedin.com/company/amorah-info-tech-pvt-ltd/",
    twitter: "https://x.com/Amorah_Infotech",
    youtube: "https://www.youtube.com/@AmorahInfoTech",

    // --- COMMUNICATION CHANNELS ---
    // WhatsApp with pre-filled professional message
    whatsapp_chat: "https://wa.me/916301694153?text=Hello%20Amorah%20Group,%20I%20would%20like%20to%20enquire%20about%20your%20services.",
    phone: "tel:+916301694153",
    email: "mailto:info@amorahgroup.in",

    // --- EXTERNAL PORTALS ---
    careers_portal: "https://jobs.amorahgroup.in",
    
    // --- THIRD PARTY BADGES & REVIEWS ---
    clutch_profile: "https://clutch.co/profile/amorah-infotech",
    goodfirms_badge: "https://assets.goodfirms.co/badges/color-badge/app-development.svg",
    google_maps: "https://www.google.com/maps?cid=YOUR_CID_HERE", // Replace with actual CID when available

    // --- SECONDARY ASSETS ---
    hero_video: "https://amorahgroup.in/assets/videos/index%20hero%20video.mp4",
    bg_pattern: "https://amorahgroup.in/assets/images/Gemini_Generated_Image_nfrwtfnfrwtfnfrw.png"
};

// PREVENT TAMPERING: Ensures the data object cannot be modified by other scripts
Object.freeze(EXTERNAL_LINKS);

/**
 * LOGICAL OVERVIEW FOR DEVELOPERS:
 * To use these links in your HTML, simply add 'data-link' to any anchor:
 * <a data-link="facebook">FB</a> -> Automatically becomes the link above.
 */
