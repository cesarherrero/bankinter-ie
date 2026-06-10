/**
 * hero-banner.js — Bloque AEM EDS: HeroBanner para Bankinter IE
 * Estructura que llega del Content Bus:
 *   Row 0 > div: imageUrl — AEM convierte URLs planas en <a href="url">url</a>
 *   Row 1 > div: richtext con h1/h2 + p + ul
 */
export default function decorate(block) {
  if (!block) return;

  const url = window.location.pathname;
  const variant = url.includes('save-and-invest') ? 'cyan' : 'yellow';
  block.classList.add(variant, 'hero-banner--initialized');

  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  let imageContent = null; // <picture> o <img> ya construido por AEM
  let contentRow = null;

  if (rows.length >= 2) {
    const [firstRow, secondRow] = rows;
    const firstCell = firstRow.querySelector(':scope > div');

    // AEM EDS sirve imágenes DAM como <picture> en la primera celda
    const picture = firstCell?.querySelector('picture');
    const link = firstCell?.querySelector('a');
    const text = firstCell?.textContent?.trim();

    if (picture) {
      // Imagen DAM: usar el <picture> tal cual (srcset optimizado automático)
      imageContent = picture;
    } else if (link?.href) {
      // Compatibilidad: imageUrl almacenado como texto → construir <img>
      const img = document.createElement('img');
      img.src = link.href;
      img.alt = '';
      img.loading = 'lazy';
      imageContent = img;
    } else if (text && (text.startsWith('http') || text.startsWith('/'))) {
      const img = document.createElement('img');
      img.src = text;
      img.alt = '';
      img.loading = 'lazy';
      imageContent = img;
    }
    contentRow = secondRow;
  } else {
    [contentRow] = rows;
  }

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'hero-banner-image';

  if (imageContent) {
    imageWrapper.append(imageContent);
  }

  const textWrapper = document.createElement('div');
  textWrapper.className = 'hero-banner-text';
  if (contentRow) {
    const cell = contentRow.querySelector(':scope > div');
    if (cell) textWrapper.append(...cell.childNodes);
  }

  const heading = textWrapper.querySelector('h1, h2');
  if (heading && !heading.id) heading.id = 'hero-main-heading';

  block.innerHTML = '';
  const inner = document.createElement('div');
  inner.className = 'hero-banner-inner';
  if (imageContent) inner.append(imageWrapper);
  inner.append(textWrapper);
  block.append(inner);
}
