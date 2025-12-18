
document.addEventListener('DOMContentLoaded', function () {
  /**
   * Utility: create <img.icon> and append to button
   */
  function injectIcon(btn, url) {
    if (!url) return;
    if (btn.querySelector('.icon')) return; // avoid duplicates

    const img = document.createElement('img');
    img.className = 'icon';
    img.alt = ''; // decorative icon
    img.src = url;
    btn.appendChild(img);
  }

  /**
   * Find an icon URL close to the button, covering AEM patterns
   */
  function findIconUrl(scope) {
    // Direct hint via data attributes
    const withDataIcon = scope.querySelector('[data-icon]');
    if (withDataIcon && withDataIcon.getAttribute('data-icon')) {
      return withDataIcon.getAttribute('data-icon');
    }

    // AEM authoring prop node for icon
    const aueIcon = scope.querySelector('[data-aue-prop="icon"] a, [data-aue-prop="icon"] img, [data-aue-prop="icon"] source');
    if (aueIcon) {
      return (
        aueIcon.getAttribute('href') ||
        aueIcon.getAttribute('src') ||
        aueIcon.getAttribute('srcset')
      );
    }

    // Any asset reference nearby in the block
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

  /**
   * Initialize all button blocks
   * This assumes your button block container has a recognizable wrapper (e.g., `.button-block`),
   * but also works on loose anchors with class "button"
   */
  const blocks = document.querySelectorAll('.button-block, .block.button, .cmp-button, .franklin-button, a.button, button.button');

  blocks.forEach(function (block) {
    // If the clickable element already exists, use it; otherwise create one
    let anchor = block.querySelector('a.button, button.button');

    // Attempt to read values from common AEM data attributes or nearby labels
    // These can be populated server-side per your model fields.
    const link = block.getAttribute('data-link') ||
                 (anchor && anchor.getAttribute('href')) ||
                 ''; // fallback empty

    const linkText = block.getAttribute('data-link-text') ||
                     (anchor && anchor.textContent?.trim()) ||
                     'Learn More';

    const linkTitle = block.getAttribute('data-link-title') ||
                      (anchor && anchor.getAttribute('title')) ||
                      '';

    const linkType = block.getAttribute('data-link-type') || // 'primary' | 'secondary' | ''
                     (anchor && (anchor.classList.contains('primary') ? 'primary' : (anchor.classList.contains('secondary') ? 'secondary' : ''))) ||
                     '';

    const size = block.getAttribute('data-size') || // '' | 'full'
                 (anchor && (anchor.classList.contains('full-width') ? 'full' : '')) ||
                 ''; // model uses 'full', CSS expects 'full-width'

    // Create anchor if missing
    if (!anchor) {
      anchor = document.createElement('a');
      anchor.className = 'button';
      block.appendChild(anchor);
    } else {
      // Ensure base class
      anchor.classList.add('button');
    }

    // Apply href/title/text
    if (link) anchor.setAttribute('href', link);
    if (linkTitle) anchor.setAttribute('title', linkTitle);
    anchor.textContent = linkText;

    // Apply type classes (primary/secondary)
    anchor.classList.remove('primary', 'secondary');
    if (linkType === 'primary') anchor.classList.add('primary');
    else if (linkType === 'secondary') anchor.classList.add('secondary');

    // Apply size mapping: model 'full' -> CSS 'full-width'; empty -> fit-content
    anchor.classList.remove('full-width', 'fit-content');
    if (size === 'full') {
      anchor.classList.add('full-width');
    } else {
      anchor.classList.add('fit-content');
    }

    // Handle icon: prefer inline media already inside the anchor
    const mediaInside = anchor.querySelector('img, picture, svg');
    if (mediaInside) {
      mediaInside.classList.add('icon');
      return; // done for this block
    }

    // Otherwise locate icon URL nearby and inject
    const scope = block.closest('.block, .section, .cmp, .button-block') || block;
    const iconUrl = anchor.getAttribute('data-icon') || findIconUrl(scope);

    if (iconUrl) {
      injectIcon(anchor, iconUrl);
    }
  });
});
