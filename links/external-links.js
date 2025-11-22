// external-links.js - centralized external links
const externalLinks = {
  "link1": "https://amorahgroup.in/",
  "link2": "https://amorahgroup.in/about",
  "link3": "https://amorahgroup.in/overseas-services",
  "link4": "https://amorahgroup.in/services",
  "link5": "https://amorahgroup.in/wp-content/uploads/2025/10/cropped-Amorah-Logo-PNG-1.png",
  "link6": "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
  "link7": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
  "link8": "https://fonts.googleapis.com",
  "link9": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap",
  "link10": "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap",
  "link11": "https://fonts.gstatic.com",
  "link12": "https://unpkg.com/aos@2.3.1/dist/aos.css",
  "link13": "https://wa.me/916301694153",
};

// helper to find key by url
function findKeyByUrl(url){
  for(const k in externalLinks) if(externalLinks[k]===url) return k;
  return null;
}
