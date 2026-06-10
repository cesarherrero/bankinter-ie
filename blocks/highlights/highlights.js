/**
 * highlights.js — Bloque AEM EDS: Product Highlights para Bankinter IE
 * 
 * Estructura del bloque que llega de Franklin delivery:
 *   Row 0 > div: richtext con h2 (título de sección) + grupos h3/p/p
 * 
 * El JS parsea ese richtext y construye una grid de tarjetas.
 * Cada h3 + p/p siguientes = una tarjeta.
 */
export default function decorate(block) {
  if (!block) return;

  // Obtener el contenido: primer (y único) row > primera celda
  const firstCell = block.querySelector(':scope > div > div');
  if (!firstCell) return;

  const html = firstCell.innerHTML;

  // Parsear: h2 es el título de la sección, cada h3 empieza una tarjeta
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const container = doc.querySelector('div');
  const nodes = [...container.childNodes];

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
        if (a) {
          currentCard.link = a.href;
          currentCard.linkText = a.textContent.trim();
        } else {
          const pText = node.innerHTML;
          currentCard.body += (currentCard.body ? '<br>' : '') + pText;
        }
      } else if (tag === 'ul') {
        currentCard.body += node.outerHTML;
      }
    }
  }
  if (currentCard) cards.push(currentCard);

  // Construir markup
  block.innerHTML = '';

  if (sectionTitle) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'highlights__title';
    titleEl.textContent = sectionTitle;
    block.append(titleEl);
  }

  const grid = document.createElement('div');
  grid.className = 'highlights__grid';

  cards.forEach((card, i) => {
    const el = document.createElement('div');
    const color = COLORS[i % COLORS.length];
    el.className = `highlights__card highlights__card--${color}`;

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

  block.append(grid);
}
