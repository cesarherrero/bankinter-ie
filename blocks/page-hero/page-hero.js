/**
 * Page Hero block — hero de páginas interiores con texto a la izquierda e imagen a la derecha.
 * Replica el layout .content-block.content-block_cyan de Bankinter IE.
 *
 * Estructura de autor AEM (3 filas):
 *   Fila 0: etiqueta de categoría (texto corto, ej: "save and invest")
 *   Fila 1: richtext — h2, descripción, lista de beneficios, enlace CTA
 *   Fila 2: imagen lateral (picture)
 */
export default function decorate(block) {
  const rows = [...block.children];
  const getCell = (row) => row?.querySelector('div') || row;

  // Fila 0: etiqueta de categoría (pequeña, uppercase)
  const labelCell = getCell(rows[0]);
  const label = labelCell?.textContent?.trim();

  // Fila 1: contenido principal (heading + descripción + bullets + CTA)
  const contentCell = getCell(rows[1]);

  // Fila 2: imagen lateral
  const imgCell = getCell(rows[2]);
  const picture = imgCell?.querySelector('picture');

  const inner = document.createElement('div');
  inner.className = 'page-hero-inner';

  // Lado texto (izquierdo)
  const textSide = document.createElement('div');
  textSide.className = 'page-hero-text';

  if (label) {
    const labelEl = document.createElement('p');
    labelEl.className = 'page-hero-label';
    labelEl.textContent = label;
    textSide.append(labelEl);
  }

  if (contentCell) {
    [...contentCell.children].forEach((child) => {
      // Convertir enlaces en botones primarios si hay un <a> directo (CTA)
      const anchors = [...child.querySelectorAll('a')];
      anchors.forEach((a) => {
        // Solo el CTA principal (no los enlaces dentro de <li>)
        if (!a.closest('li')) {
          a.classList.add('btn', 'btn--primary');
        }
      });
      textSide.append(child);
    });
  }

  // Lado imagen (derecho)
  const imageSide = document.createElement('div');
  imageSide.className = 'page-hero-image';

  if (picture) {
    imageSide.append(picture);
  } else if (imgCell) {
    // AEM renderiza campos reference externos como <a href="url">url</a>
    // en lugar de <picture>. Convertir el enlace en un <img> directamente.
    const link = imgCell.querySelector('a');
    const src = link?.href || link?.textContent?.trim();
    if (src && /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(src)) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      imageSide.append(img);
    }
  }

  inner.append(textSide, imageSide);
  block.replaceChildren(inner);
}
