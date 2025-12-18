
document.addEventListener('DOMContentLoaded', function () {
  // Finds anchors or buttons with a data-icon attribute
  const buttons = document.querySelectorAll('a.button[data-icon], button.button[data-icon]');

  buttons.forEach(function (btn) {
    const iconUrl = btn.getAttribute('data-icon');
    if (!iconUrl) return;

    // Avoid duplicates
    if (btn.querySelector('.icon')) return;

    // Create <img> icon (works for SVG or image URLs)
    const img = document.createElement('img');
    img.className = 'icon';
    img.src = iconUrl;
    img.alt = ''; // decorative

    // Append icon at the end of the button text
    btn.appendChild(img);
  });
});
