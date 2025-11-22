// links-init.js - replace external anchors to use externalLinks mapping
document.addEventListener('DOMContentLoaded', function(){
  if (typeof externalLinks === 'undefined') return;
  document.querySelectorAll('a[href^="http"]').forEach(a=>{
    const url = a.getAttribute('href');
        // do not touch anchors inside includes/header.html (we avoid modifying includes folder anchors)
    if (a.closest && a.closest('header') && a.closest('header').id === 'header') return;
    const key = findKeyByUrl(url) || null;
    if (key){
      a.setAttribute('data-ext-key', key);
      a.setAttribute('href', '#');
      a.addEventListener('click', function(e){ e.preventDefault(); window.open(externalLinks[key], '_blank'); });
    }
  });
});
