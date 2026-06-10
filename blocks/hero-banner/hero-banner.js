export default function decorate(block) {
  // La tabla AEM tiene 2 filas:
  // row[0] → imagen (picture)
  // row[1] → texto (h1 + párrafo subtítulo)
  const rows = [...block.children];
  if (rows.length < 2) return;

  const [imageRow, textRow] = rows;
  const imageEl = imageRow.querySelector('picture, img');
  const textDiv = textRow.querySelector('div') || textRow;

  // Crear la estructura split: texto izquierda | imagen derecha
  const inner = document.createElement('div');
  inner.className = 'hero-banner-inner';

  const textSide = document.createElement('div');
  textSide.className = 'hero-banner-text';
  // Mover todos los hijos del textDiv al textSide
  [...(textRow.querySelector('div')?.children || textRow.children)].forEach(
    (child) => textSide.append(child)
  );

  const imageSide = document.createElement('div');
  imageSide.className = 'hero-banner-image';
  if (imageEl) {
    // Subir al picture si el imageEl es img
    const picture = imageEl.closest('picture') || imageEl;
    imageSide.append(picture);
  }

  inner.append(textSide, imageSide);
  block.replaceChildren(inner);
}
