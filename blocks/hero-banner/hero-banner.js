export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const [imageRow, textRow] = rows;
  const picture = imageRow.querySelector('picture');
  const textContent = textRow.querySelector('div') || textRow;

  const inner = document.createElement('div');
  inner.className = 'hero-banner-inner';

  const imageSide = document.createElement('div');
  imageSide.className = 'hero-banner-image';
  if (picture) imageSide.append(picture);

  const textSide = document.createElement('div');
  textSide.className = 'hero-banner-text';
  [...textContent.children].forEach((child) => textSide.append(child));

  // Imagen izquierda, texto derecha — orden del original Bankinter
  inner.append(imageSide, textSide);
  block.replaceChildren(inner);
}
