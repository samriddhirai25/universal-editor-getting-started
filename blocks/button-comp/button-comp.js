export default function decorate(block) {
  const container = block.querySelector('.button-container');
  if (!container) return;

  const link = container.querySelector('a.button');
  const icon = container.querySelector('img');

  if (!link) return;

  // Wrap contents into flex button
  const text = document.createElement('span');
  text.textContent = link.textContent;

  link.textContent = '';
  link.append(text);

  // Add icon if authored
  if (icon && icon.src) {
    icon.classList.add('btn-icon');
    link.prepend(icon);
  }
}