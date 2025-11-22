// login.js - simple client-side admin login for jobs-admin
// NOTE: This is client-side only and not secure. For production use server-side authentication.
document.getElementById('adminLogin').addEventListener('submit', function(e){
  e.preventDefault();
  const u = document.getElementById('user').value.trim();
  const p = document.getElementById('pass').value.trim();
  // hardcoded sample credentials - change as needed or implement server auth
  if(u === 'admin' && p === 'admin123'){
    sessionStorage.setItem('jobs_admin_auth','1');
    window.location.href = 'admin-dashboard.html';
  } else {
    document.getElementById('msg').textContent = 'Invalid credentials.';
  }
});