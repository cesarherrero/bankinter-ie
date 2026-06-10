/**
 * highlights.js — Bloque AEM EDS: Highlights (tarjetas de producto)
 *
 * CSS espera:
 *   .highlights > div > .highlights-section-heading > h2
 *   .highlights > div > .highlights-grid > .highlights-card.highlights-card-{color}
 *     > .highlights-card-icon, h3, .highlights-card-desc, .highlights-card-cta > a
 */
export default function decorate(block) {
  if (!block) return;

  const firstCell = block.querySelector(':scope > div > div');
  if (!firstCell) return;

  const { innerHTML: html } = firstCell;
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const nodes = [...doc.querySelector('div').childNodes];

  let sectionTitle = '';
  const cards = [];
  let currentCard = null;

  const ICONS = ['💳', '🏦', '🏠', '⭐', '💡', '📈', '🌿'];
  const COLORS = ['yellow', 'cyan', 'orange', 'yellow', 'cyan', 'orange', 'yellow'];

  nodes.forEach((node) => {
    const tag = node.nodeName?.toLowerCase();
    if (!tag || tag === '#text') return;

    if (tag === 'h2') {
      sectionTitle = node.textContent.trim();
    } else if (tag === 'h3') {
      if (currentCard) cards.push(currentCard);
      currentCard = {
        heading: node.textContent.trim(),
        body: '',
        link: '',
        linkText: '',
      };
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
  });
  if (currentCard) cards.push(currentCard);

  block.innerHTML = '';
  const wrapper = document.createElement('div');

  if (sectionTitle) {
    const sectionHeading = document.createElement('div');
    sectionHeading.className = 'highlights-section-heading';
    const h2 = document.createElement('h2');
    h2.textContent = sectionTitle;
    sectionHeading.append(h2);
    wrapper.append(sectionHeading);
  }

  const grid = document.createElement('div');
  grid.className = 'highlights-grid';

  cards.forEach((card, i) => {
    const color = COLORS[i % COLORS.length];
    const el = document.createElement('div');
    el.className = `highlights-card highlights-card-${color}`;

    const icon = document.createElement('div');
    icon.className = 'highlights-card-icon';
    icon.textContent = ICONS[i % ICONS.length];

    const heading = document.createElement('h3');
    heading.textContent = card.heading;

    const desc = document.createElement('div');
    desc.className = 'highlights-card-desc';
    desc.innerHTML = card.body;

    el.append(icon, heading, desc);

    if (card.link) {
      const cta = document.createElement('div');
      cta.className = 'highlights-card-cta';
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
