/**
 * hero-banner.js — Bloque AEM EDS: HeroBanner
 * Maneja la estructura EDS block (div > div > div):
 *   - Si hay 2 columnas en la primera fila: imagen + texto (layout side-by-side)
 *   - Si hay 1 columna: texto centrado con color de fondo
 * 
 * El color de fondo se detecta por URL (cyan para save-and-invest, yellow por defecto).
 */
export default function decorate(block) {
  if (!block) return;

  // Color variant por URL
  const url = window.location.pathname;
  let variant = 'yellow';
  if (url.includes('save-and-invest')) variant = 'cyan';
  block.classList.add(variant, 'hero-banner--initialized');

  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // EDS convierte la tabla en filas de divs. Primera fila es el contenido.
  const firstRow = rows[0];
  const cols = [...firstRow.querySelectorAll(':scope > div')];

  if (cols.length >= 2) {
    // Layout 2 columnas: imagen + texto
    const imgCol = cols.find(c => c.querySelector('img, picture')) || cols[0];
    const textCol = cols.find(c => c !== imgCol) || cols[1];

    imgCol.className = 'hero-banner__image';
    textCol.className = 'hero-banner__text';

    // Añadir accesibilidad al heading
    const heading = textCol.querySelector('h1, h2, h3');
    if (heading && !heading.id) heading.id = 'hero-main-heading';

  } else if (cols.length === 1) {
    // Layout texto solo
    cols[0].className = 'hero-banner__text';
    const heading = cols[0].querySelector('h1, h2, h3');
    if (heading && !heading.id) heading.id = 'hero-main-heading';
  }

  // El primer row ya es el wrapper de la primera div del bloque
  // Asegurarse de que tenga la clase correcta de contenedor interno
  firstRow.className = 'hero-banner__inner';
}
