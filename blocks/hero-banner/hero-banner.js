/**
 * hero-banner.js — Bloque AEM EDS: HeroBanner
 * Replica la estructura content-block del portal original de Bankinter IE:
 *   - Si el primer div contiene una imagen → layout 2 columnas (imagen + texto)
 *   - Si no hay imagen → layout texto centrado con fondo de color
 *   - Detecta variante de color desde el metadata de página o clase del section padre
 */
export default function decorate(block) {
  if (!block) return;

  // Detectar variante de color desde la URL o desde el padre
  const url = window.location.pathname;
  let variant = 'yellow'; // default para lending-products
  if (url.includes('save-and-invest')) variant = 'cyan';
  else if (url.includes('orange')) variant = 'orange';

  block.classList.add(variant);
  block.classList.add('hero-banner--initialized');

  // Obtener todas las filas del bloque (children directos del wrapper)
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Detectar si hay imagen en el contenido
  const allCells = [...block.querySelectorAll(':scope > div > div')];
  const imgCell = allCells.find(c => c.querySelector('img'));
  const hasImage = !!imgCell;

  if (hasImage) {
    // Layout dos columnas: imagen + texto
    const textCell = allCells.find(c => c !== imgCell);

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-banner__image';
    if (imgCell) imageWrapper.append(...imgCell.childNodes);

    const textWrapper = document.createElement('div');
    textWrapper.className = 'hero-banner__text';
    if (textCell) textWrapper.append(...textCell.childNodes);

    // Limpiar y reconstruir
    rows.forEach(r => r.remove());
    const inner = document.createElement('div');
    inner.append(imageWrapper, textWrapper);
    block.append(inner);
  } else {
    // Sin imagen: extraer todo el texto y mostrarlo con placeholder de imagen
    const allText = rows.map(r => r.innerHTML).join('');

    const placeholder = document.createElement('div');
    placeholder.className = 'hero-banner__image';
    const placeholderInner = document.createElement('div');
    placeholderInner.className = 'hero-banner__image-placeholder';
    placeholder.append(placeholderInner);

    const textWrapper = document.createElement('div');
    textWrapper.className = 'hero-banner__text';
    textWrapper.innerHTML = allText;

    rows.forEach(r => r.remove());
    const inner = document.createElement('div');
    inner.append(placeholder, textWrapper);
    block.append(inner);
  }

  // Accesibilidad: marcar el heading principal
  const heading = block.querySelector('h1, h2');
  if (heading && !heading.id) heading.id = 'hero-main-heading';
}
