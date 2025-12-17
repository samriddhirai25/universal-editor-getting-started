export default async function decorate(block) {
  const colorStyle = block.children[1].textContent.trim();
  block.children[0].classList.add(colorStyle);
  block.children[1].remove();
}