export default function decorate(block) {
  const rows = [...block.children];
  const inner = document.createElement('div');
  inner.className = 'hero-banner-inner';

  const textSide = document.createElement('div');
  textSide.className = 'hero-banner-text';

  if (rows.length >= 2) {
    // Estructura con imagen: fila 0 = imagen, fila 1 = texto
    const [imageRow, textRow] = rows;
    const picture = imageRow.querySelector('picture');
    const textContent = textRow.querySelector('div') || textRow;

    const imageSide = document.createElement('div');
    imageSide.className = 'hero-banner-image';

    const picWrap = document.createElement('div');
    picWrap.className = 'hero-banner-pic';
    if (picture) picWrap.append(picture);
    imageSide.append(picWrap);

    [...textContent.children].forEach((child) => textSide.append(child));
    inner.append(imageSide, textSide);
  } else {
    // Estructura solo-texto (una fila): "content" richtext — layout centrado
    const contentCell = rows[0]?.querySelector('div') || rows[0];
    if (contentCell) {
      [...contentCell.children].forEach((child) => textSide.append(child));
    }
    inner.append(textSide);
    block.classList.add('hero-banner-text-only');
  }

  block.replaceChildren(inner);
}
