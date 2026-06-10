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

  // Wrapper para la foto: permite overflow:hidden en la imagen
  // sin afectar al cuadrado decorativo ::after del contenedor padre.
  const picWrap = document.createElement('div');
  picWrap.className = 'hero-banner-pic';
  if (picture) picWrap.append(picture);
  imageSide.append(picWrap);

  const textSide = document.createElement('div');
  textSide.className = 'hero-banner-text';
  [...textContent.children].forEach((child) => textSide.append(child));

  // Imagen izquierda, texto derecha — orden visual del original Bankinter
  inner.append(imageSide, textSide);
  block.replaceChildren(inner);
}
