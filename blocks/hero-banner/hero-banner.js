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

  let imageUrl = '';
  let contentRow = null;

  if (rows.length >= 2) {
    // Row 0: AEM convierte la URL plana en <a href="url"> — extraer href
    const [firstRow, secondRow] = rows;
    const firstCell = firstRow.querySelector(':scope > div');
    const link = firstCell?.querySelector('a');
    const text = firstCell?.textContent?.trim();
    if (link?.href) {
      imageUrl = link.href;
    } else if (text && (text.startsWith('http') || text.startsWith('/'))) {
      imageUrl = text;
    }
    contentRow = secondRow;
  } else {
    [contentRow] = rows;
  }

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'hero-banner-image';

  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = block.querySelector('h1, h2')?.textContent?.trim() || 'Bankinter';
    img.loading = 'lazy';
    imageWrapper.append(img);
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
  if (imageUrl) inner.append(imageWrapper);
  inner.append(textWrapper);
  block.append(inner);
}
