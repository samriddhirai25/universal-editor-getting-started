document.addEventListener('DOMContentLoaded', function () {
  function appendIcon(btn, url) {
    if (!url) return;
    if (btn.querySelector('.icon')) return; // avoid duplicates

    const img = document.createElement('img');
    img.className = 'icon';
    img.alt = ''; // decorative
    img.src = url;
    btn.appendChild(img);
  }

  function findIconUrlNear(btn) {
    // 1) Prefer a direct data-icon attribute on the button
    const direct = btn.getAttribute('data-icon');
    if (direct) return direct;

    // 2) If media already exists inside button, just normalize it
    const existing = btn.querySelector('img, picture, svg');
    if (existing) {
      existing.classList.add('icon');
      return null; // no need to inject
    }

    // 3) Look for AEM-rendered icon field nearby (common patterns)
    const scope = btn.closest('.button, .block, .cmp, .section') || document;

    // a) AEM authoring prop
    const aueIconLinkOrImg = scope.querySelector('[data-aue-prop="icon"] a, [data-aue-prop="icon"] img, [data-aue-prop="icon"] source');
    if (aueIconLinkOrImg) {
      return (
        aueIconLinkOrImg.getAttribute('href') ||
        aueIconLinkOrImg.getAttribute('src') ||
        aueIconLinkOrImg.getAttribute('srcset')
      );
    }

    // b) Any asset reference to /content/dam/ in the same block
    const damRef = scope.querySelector('a[href*="/content/dam/"], img[src*="/content/dam/"], source[srcset*="/content/dam/"]');
    if (damRef) {
      return (
        damRef.getAttribute('href') ||
        damRef.getAttribute('src') ||
        damRef.getAttribute('srcset')
      );
    }

    return null;
  }

  // Your CSS targets `.button .icon`, so the clickable element MUST have class "button"
  const buttons = document.querySelectorAll('a.button, button.button');

  buttons.forEach(function (btn) {
    // Normalize if icon element already exists
    const mediaInside = btn.querySelector('img, picture, svg');
    if (mediaInside) {
      mediaInside.classList.add('icon');
      return;
    }

    // Otherwise try to find a URL and append
    const url = findIconUrlNear(btn);
    if (url) appendIcon(btn, url);
  });
});