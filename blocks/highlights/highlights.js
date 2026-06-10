export default function decorate(block) {
  const contentCell = block.querySelector(':scope > div > div');
  if (!contentCell) return;

  const elements = [...contentCell.children];
  const cards = [];
  let current = null;

  for (const el of elements) {
    if (el.tagName === 'H3') {
      if (current) cards.push(current);
      current = { title: el.textContent.trim(), desc: '', href: '', ctaText: '' };
    } else if (current && el.tagName === 'P') {
      const link = el.querySelector('a');
      if (link) {
        current.href = link.getAttribute('href') || '';
        current.ctaText = link.textContent.trim();
      } else if (!current.desc) {
        current.desc = el.textContent.trim();
      }
    }
  }
  if (current) cards.push(current);

  // Colores Bankinter: amarillo #fed430 (odd) y cian #b5f0ef (even)
  const accentKeys = ['yellow', 'cyan'];

  const ul = document.createElement('ul');
  ul.className = 'highlights-list';

  cards.forEach((card, i) => {
    const li = document.createElement('li');
    li.className = `highlights-card highlights-card-${accentKeys[i % 2]}`;

    // Cuadro de acento pequeño (icono placeholder)
    const accent = document.createElement('div');
    accent.className = 'highlights-card-accent';
    accent.setAttribute('aria-hidden', 'true');

    const body = document.createElement('div');
    body.className = 'highlights-card-body';

    const h3 = document.createElement('h3');
    h3.className = 'highlights-card-title';
    h3.textContent = card.title;

    const desc = document.createElement('p');
    desc.className = 'highlights-card-desc';
    desc.textContent = card.desc;

    body.append(h3, desc);

    // Línea separadora de color (entre descripción y CTA)
    const sep = document.createElement('div');
    sep.className = 'highlights-card-sep';
    sep.setAttribute('aria-hidden', 'true');

    li.append(accent, body, sep);

    if (card.href) {
      const footer = document.createElement('div');
      footer.className = 'highlights-card-footer';
      const a = document.createElement('a');
      a.href = card.href;
      a.textContent = card.ctaText;
      a.className = 'highlights-card-link';
      footer.append(a);
      li.append(footer);
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
