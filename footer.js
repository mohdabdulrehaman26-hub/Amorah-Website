document.addEventListener("DOMContentLoaded",()=>{
  fetch("includes/footer.html").then(r=>r.text()).then(t=>{document.getElementById("footer").innerHTML=t});
});