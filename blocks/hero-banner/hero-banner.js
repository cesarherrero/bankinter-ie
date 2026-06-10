/**
 * hero-banner.js — Bloque AEM EDS: HeroBanner para Bankinter IE
 * Estructura EDS que llega del Franklin delivery:
 *   Row 0: imageUrl (texto plano con la URL)
 *   Row 1: text (richtext con h1/h2 + p + ul)
 * 
 * El JS crea la imagen a partir de la URL y construye layout 2 columnas.
 * Variante de color (yellow/cyan/orange) se detecta por URL de la página.
 */
export default function decorate(block) {
  if (!block) return;

  // Color variant por URL de la página
  const url = window.location.pathname;
  const variant = url.includes('save-and-invest') ? 'cyan' : 'yellow';
  block.classList.add(variant, 'hero-banner--initialized');

  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // EDS block: cada campo del modelo = un row
  // Row 0: imageUrl (text field) — contiene la URL como texto plano
  // Row 1: text (richtext field) — contiene heading + body

  let imageUrl = '';
  let contentRow = null;

  if (rows.length >= 2) {
    // Primer row: URL de imagen (texto plano)
    const firstCell = rows[0].querySelector(':scope > div');
    const candidateUrl = firstCell?.textContent?.trim() || '';
    if (candidateUrl && (candidateUrl.startsWith('http') || candidateUrl.startsWith('/'))) {
      imageUrl = candidateUrl;
    }
    contentRow = rows[1];
  } else {
    // Solo un row: todo es contenido (sin imagen)
    contentRow = rows[0];
  }

  // Construir la imagen
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'hero-banner__image';

  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = block.querySelector('h1, h2')?.textContent?.trim() || 'Bankinter';
    img.loading = 'lazy';
    imageWrapper.append(img);
  } else {
    // Placeholder decorativo
    const placeholder = document.createElement('div');
    placeholder.className = 'hero-banner__image-placeholder';
    imageWrapper.append(placeholder);
  }

  // Construir el wrapper de texto
  const textWrapper = document.createElement('div');
  textWrapper.className = 'hero-banner__text';
  if (contentRow) {
    const cell = contentRow.querySelector(':scope > div');
    if (cell) textWrapper.append(...cell.childNodes);
  }

  // Accesibilidad
  const heading = textWrapper.querySelector('h1, h2');
  if (heading && !heading.id) heading.id = 'hero-main-heading';

  // Reconstruir el bloque
  block.innerHTML = '';
  const inner = document.createElement('div');
  inner.className = 'hero-banner__inner';
  inner.append(imageWrapper, textWrapper);
  block.append(inner);
}
