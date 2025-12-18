document.addEventListener('DOMContentLoaded', function () {
  // Enhance buttons with icons. Supports:
  // - data-icon="/path/to/icon.svg" (image URL or data URL)
  // - data-icon-html="<svg>...</svg>" (inline SVG/HTML, sanitized with DOMPurify if available)
  // - data-icon-position="left|right" (defaults to right)

  const hasPurify = typeof DOMPurify !== 'undefined';

  document.querySelectorAll('.button').forEach(function (btn) {
    // don't duplicate
    if (btn.querySelector('.icon-wrapper')) return;

    const iconUrl = btn.getAttribute('data-icon');
    const iconHtml = btn.getAttribute('data-icon-html');
    const position = (btn.getAttribute('data-icon-position') || 'right').toLowerCase();

    if (!iconUrl && !iconHtml) return;

    const wrapper = document.createElement('span');
    wrapper.className = 'icon-wrapper ' + (position === 'left' ? 'icon--left' : 'icon--right');

    // If inline HTML provided, sanitize and insert
    if (iconHtml) {
      try {
        wrapper.innerHTML = hasPurify ? DOMPurify.sanitize(iconHtml) : iconHtml;
      } catch (e) {
        console.warn('Icon HTML sanitization failed', e);
        wrapper.textContent = '';
      }
      if (position === 'left') btn.insertBefore(wrapper, btn.firstChild);
      else btn.appendChild(wrapper);
      return;
    }

    // If the data contains raw HTML (e.g. "<svg>...") treat as HTML too
    if (iconUrl && /<[^>]+>/.test(iconUrl)) {
      try {
        wrapper.innerHTML = hasPurify ? DOMPurify.sanitize(iconUrl) : iconUrl;
      } catch (e) {
        console.warn('Icon HTML sanitization failed', e);
        wrapper.textContent = '';
      }
      if (position === 'left') btn.insertBefore(wrapper, btn.firstChild);
      else btn.appendChild(wrapper);
      return;
    }

    // Otherwise treat as an image URL (supports data: URLs as well)
    const img = document.createElement('img');
    img.className = 'icon';
    img.src = iconUrl;
    img.alt = '';
    wrapper.appendChild(img);
    if (position === 'left') btn.insertBefore(wrapper, btn.firstChild);
    else btn.appendChild(wrapper);
  });
});