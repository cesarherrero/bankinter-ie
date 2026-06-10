/**
 * highlights.js — Bloque AEM EDS: Highlights (tarjetas de producto)
 * 
 * CSS espera:
 *   .highlights > div > .highlights__section-heading > h2
 *   .highlights > div > .highlights__grid > .highlights__card.card--{color}
 *     > .highlights__card-icon, h3, .highlights__card-desc, .highlights__card-cta > a
 */
export default function decorate(block) {
  if (!block) return;

  // Obtener el contenido: primer row > primera celda
  const firstCell = block.querySelector(':scope > div > div');
  if (!firstCell) return;

  const html = firstCell.innerHTML;
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const nodes = [...doc.querySelector('div').childNodes];

  let sectionTitle = '';
  const cards = [];
  let currentCard = null;

  const ICONS = ['💳', '🏦', '🏠', '⭐', '💡', '📈', '🌿'];
  const COLORS = ['yellow', 'cyan', 'orange', 'yellow', 'cyan', 'orange', 'yellow'];

  for (const node of nodes) {
    const tag = node.nodeName?.toLowerCase();
    if (!tag || tag === '#text') continue;

    if (tag === 'h2') {
      sectionTitle = node.textContent.trim();
    } else if (tag === 'h3') {
      if (currentCard) cards.push(currentCard);
      currentCard = { heading: node.textContent.trim(), body: '', link: '', linkText: '' };
    } else if (currentCard) {
      if (tag === 'p') {
        const a = node.querySelector('a');
        if (a && !currentCard.link) {
          currentCard.link = a.href;
          currentCard.linkText = a.textContent.trim();
        } else {
          currentCard.body += node.innerHTML;
        }
      } else if (tag === 'ul' || tag === 'ol') {
        currentCard.body += node.outerHTML;
      }
    }
  }
  if (currentCard) cards.push(currentCard);

  // Reconstruir el bloque — wrapper > div (para el max-width del CSS)
  block.innerHTML = '';
  const wrapper = document.createElement('div');

  if (sectionTitle) {
    const sectionHeading = document.createElement('div');
    sectionHeading.className = 'highlights__section-heading';
    const h2 = document.createElement('h2');
    h2.textContent = sectionTitle;
    sectionHeading.append(h2);
    wrapper.append(sectionHeading);
  }

  const grid = document.createElement('div');
  grid.className = 'highlights__grid';

  cards.forEach((card, i) => {
    const color = COLORS[i % COLORS.length];
    const el = document.createElement('div');
    // CSS espera: .highlights__card.card--yellow (no highlights__card--yellow)
    el.className = `highlights__card card--${color}`;

    const icon = document.createElement('div');
    icon.className = 'highlights__card-icon';
    icon.textContent = ICONS[i % ICONS.length];

    const heading = document.createElement('h3');
    heading.textContent = card.heading;

    const desc = document.createElement('div');
    desc.className = 'highlights__card-desc';
    desc.innerHTML = card.body;

    el.append(icon, heading, desc);

    if (card.link) {
      const cta = document.createElement('div');
      cta.className = 'highlights__card-cta';
      const a = document.createElement('a');
      a.href = card.link;
      a.textContent = card.linkText || 'Learn more';
      a.setAttribute('aria-label', card.linkText || card.heading);
      cta.append(a);
      el.append(cta);
    }

    grid.append(el);
  });

  wrapper.append(grid);
  block.append(wrapper);
}
