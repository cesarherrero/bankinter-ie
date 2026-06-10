/**
 * highlights.js — Bloque AEM EDS: Highlights
 * Parsea contenido AEM y construye la estructura DOM esperada por highlights.css:
 *   - Modo simple (h1/h2 + descripción): renderizado como section heading con línea naranja
 *   - Modo grid (h3s presentes): construye cards en columnas. Si imageUrl existe,
 *     la primera columna muestra la imagen.
 *
 * Campos AEM → DOM:
 *   imageUrl  → columna imagen (primera columna antes de los h3)
 *   text      → richtext con h3s que se convierten en cards
 */

const ICON_COLORS = ['yellow', 'cyan', 'orange'];

export default function decorate(block) {
  if (!block) return;

  // Obtener el nodo de contenido principal (primera celda)
  const rows = block.querySelectorAll(':scope > div');
  const firstRow = rows[0];
  const contentCell = firstRow?.querySelector(':scope > div');

  if (!contentCell) {
    block.classList.add('highlights--initialized');
    return;
  }

  const children = Array.from(contentCell.childNodes).filter(
    n => n.nodeType === Node.ELEMENT_NODE,
  );
  if (children.length === 0) {
    block.classList.add('highlights--initialized');
    return;
  }

  const h3s = contentCell.querySelectorAll('h3');

  // Si hay h3s → modo grid de cards
  if (h3s.length > 0) {
    block.innerHTML = '';

    // Comprobar si existe una segunda fila con imageUrl (AEM lo convierte en <a href>)
    let imageEl = null;
    if (rows.length >= 2) {
      const imgCell = rows[1]?.querySelector(':scope > div');
      const link = imgCell?.querySelector('a');
      const text = imgCell?.textContent?.trim();
      if (link?.href) {
        imageEl = document.createElement('img');
        imageEl.src = link.href;
        imageEl.alt = 'FAQs illustration';
        imageEl.loading = 'lazy';
      } else if (text && (text.startsWith('http') || text.startsWith('/'))) {
        imageEl = document.createElement('img');
        imageEl.src = text;
        imageEl.alt = 'FAQs illustration';
        imageEl.loading = 'lazy';
      }
    }

    const grid = document.createElement('div');
    grid.className = 'highlights-grid';

    // Primera columna: imagen (si existe)
    if (imageEl) {
      const imgCard = document.createElement('div');
      imgCard.className = 'highlights-card highlights-card-image';
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'highlights-card-img-wrapper';
      imgWrapper.appendChild(imageEl);
      imgCard.appendChild(imgWrapper);
      grid.appendChild(imgCard);
    }

    // Cards por cada h3
    h3s.forEach((h3, idx) => {
      const card = document.createElement('div');
      card.className = `highlights-card highlights-card-${ICON_COLORS[idx % ICON_COLORS.length]}`;

      // Título h3
      card.appendChild(h3.cloneNode(true));

      // Descripción y CTA: elementos desde h3 hasta el siguiente h3
      const descDiv = document.createElement('div');
      descDiv.className = 'highlights-card-desc';
      let sibling = h3.nextElementSibling;
      const nextH3 = h3s[idx + 1] || null;
      const ctaDivs = [];

      while (sibling && sibling !== nextH3) {
        const hasLink = sibling.querySelector('a') || sibling.tagName === 'A';
        if (hasLink) {
          const ctaDiv = document.createElement('div');
          ctaDiv.className = 'highlights-card-cta';
          ctaDiv.appendChild(sibling.cloneNode(true));
          ctaDivs.push(ctaDiv);
        } else {
          descDiv.appendChild(sibling.cloneNode(true));
        }
        sibling = sibling.nextElementSibling;
      }

      card.appendChild(descDiv);
      ctaDivs.forEach(d => card.appendChild(d));
      grid.appendChild(card);
    });

    block.appendChild(grid);
  } else {
    // Sin h3 → renderizado simple de texto enriquecido (section heading solo)
    block.classList.add('highlights--simple');
    const wrapper = document.createElement('div');
    wrapper.className = 'highlights-section-heading';
    children.forEach(el => wrapper.appendChild(el.cloneNode(true)));
    block.innerHTML = '';
    block.appendChild(wrapper);
  }

  block.classList.add('highlights--initialized');
}
