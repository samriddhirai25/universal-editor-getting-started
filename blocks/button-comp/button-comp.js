export default function decorate(block) {
  const rows = [...block.children];

  const iconWrapper = rows[0];
  const contentWrapper = rows[1];

  const icon = iconWrapper.querySelector('img');
  const text = contentWrapper.querySelector('p');
  const link = contentWrapper.querySelector('a');

  if (!link || !text) return;
  const em = link.closest('em');
  if (em) {
    em.replaceWith(link);
  }

  const button = document.createElement('a');
  button.href = link.href;
  button.className = 'btn';

  if (icon) {
    icon.classList.add('btn-icon');
    button.append(icon);
  }

  const span = document.createElement('span');
  span.textContent = text.textContent;
  button.append(span);

  block.textContent = '';
  block.append(button);
}

 