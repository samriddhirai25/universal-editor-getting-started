document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.button[data-icon]').forEach(function (btn) {
    const iconUrl = btn.getAttribute('data-icon');
    if (iconUrl && !btn.querySelector('.icon')) {
      const img = document.createElement('img');
      img.className = 'icon';
      img.src = iconUrl;
      img.alt = '';
      btn.appendChild(img);
       }
  })
})