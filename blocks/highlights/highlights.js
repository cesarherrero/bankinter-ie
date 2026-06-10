/**
 * highlights.js — Bloque AEM EDS: Highlights
 * Parsea contenido AEM y construye la estructura DOM esperada por highlights.css:
 *   - Section heading (h2 + descripción)
 *   - Grid de cards (una por cada h3): icono, título, descripción, CTA
 */

const ICON_COLORS = ['yellow', 'cyan', 'orange'];

export default function decorate(block) {
  if (!block) return;

  // Obtener el nodo de contenido principal
  const contentCell = block.querySelector(':scope > div > div');
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

    // Section heading: h2 y párrafo previo al primer h3
    const firstH3 = h3s[0];
    const headingEls = [];
    let node = contentCell.firstElementChild;
    while (node && node !== firstH3) {
      headingEls.push(node);
      node = node.nextElementSibling;
    }
    if (headingEls.length > 0) {
      const headingDiv = document.createElement('div');
      headingDiv.className = 'highlights-section-heading';
      headingEls.forEach(el => headingDiv.appendChild(el.cloneNode(true)));
      block.appendChild(headingDiv);
    }

    // Grid
    const grid = document.createElement('div');
    grid.className = 'highlights-grid';

    h3s.forEach((h3, idx) => {
      const card = document.createElement('div');
      card.className = `highlights-card highlights-card-${ICON_COLORS[idx % ICON_COLORS.length]}`;

      // Icono (imagen si imageUrl disponible, sino emoji de fallback)
      const iconDiv = document.createElement('div');
      iconDiv.className = 'highlights-card-icon';
      // Intentar obtener imagen del bloque (imageUrl como atributo de datos)
      const imgEl = block.dataset?.imageUrl
        ? (() => { const i = document.createElement('img'); i.src = block.dataset.imageUrl; i.alt = ''; return i; })()
        : null;
      if (imgEl) {
        iconDiv.style.background = 'none';
        iconDiv.style.padding = '0';
        iconDiv.style.overflow = 'hidden';
        imgEl.style.width = '100%';
        imgEl.style.height = '100%';
        imgEl.style.objectFit = 'cover';
        iconDiv.appendChild(imgEl);
      } else {
        // Emoji de tarjeta de crédito como placeholder
        iconDiv.textContent = '💳';
      }
      card.appendChild(iconDiv);

      // Título h3
      card.appendChild(h3.cloneNode(true));

      // Descripción y CTA: elementos tras el h3 hasta el siguiente h3
      const descDiv = document.createElement('div');
      descDiv.className = 'highlights-card-desc';
      let sibling = h3.nextElementSibling;
      const nextH3 = h3s[idx + 1] || null;

      while (sibling && sibling !== nextH3) {
        const hasLink = sibling.querySelector('a') || sibling.tagName === 'A';
        if (hasLink) {
          const ctaDiv = document.createElement('div');
          ctaDiv.className = 'highlights-card-cta';
          ctaDiv.appendChild(sibling.cloneNode(true));
          card.appendChild(ctaDiv);
        } else {
          descDiv.appendChild(sibling.cloneNode(true));
        }
        sibling = sibling.nextElementSibling;
      }
      card.insertBefore(descDiv, card.querySelector('.highlights-card-cta'));
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
