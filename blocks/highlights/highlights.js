// Mapa de título → cadena SVG (thin-line, viewBox 32x32)
const CARD_ICONS = new Map([
  ['Got a question?',
    '<svg viewBox="0 0 32 32" fill="none" stroke-width="1.5"'
    + ' stroke-linecap="round" stroke-linejoin="round">'
    + '<circle cx="16" cy="16" r="12"/>'
    + '<path d="M13 12.5a3.2 3.2 0 0 1 6.2.8c0 2.1-3 2.8-3 4.7"/>'
    + '<circle cx="16" cy="22.5" r="1" class="icon-dot"/>'
    + '</svg>'],
  ['Keeping you safe',
    '<svg viewBox="0 0 32 32" fill="none" stroke-width="1.5"'
    + ' stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M16 3.5 5 7.5v7c0 6.5 11 12 11 12s11-5.5 11-12v-7z"/>'
    + '<polyline points="11 16 14.5 19.5 21 13"/>'
    + '</svg>'],
  ['Enhanced support',
    '<svg viewBox="0 0 32 32" fill="none" stroke-width="1.5"'
    + ' stroke-linecap="round" stroke-linejoin="round">'
    + '<circle cx="13" cy="10" r="5"/>'
    + '<path d="M4 28v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2"/>'
    + '<path d="M27 28v-2a7 7 0 0 0-5-6.7"/>'
    + '<path d="M21 8a5 5 0 0 1 0 9.4"/>'
    + '</svg>'],
  ['Trusted contacts',
    '<svg viewBox="0 0 32 32" fill="none" stroke-width="1.5"'
    + ' stroke-linecap="round" stroke-linejoin="round">'
    + '<circle cx="12" cy="9" r="4"/>'
    + '<path d="M3 27v-2a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v2"/>'
    + '<circle cx="22" cy="9" r="4"/>'
    + '<path d="M29 27v-2a6 6 0 0 0-4.5-5.8"/>'
    + '</svg>'],
  ['Deceased accounts',
    '<svg viewBox="0 0 32 32" fill="none" stroke-width="1.5"'
    + ' stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M16 27S5 21 5 13a7.5 7.5 0 0 1 11-6.6A7.5 7.5 0 0 1 27 13c0 8-11 14-11 14z"/>'
    + '</svg>'],
  ['Get in touch',
    '<svg viewBox="0 0 32 32" fill="none" stroke-width="1.5"'
    + ' stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M24 17.4v3a2 2 0 0 1-2.1 2 20 20 0 0 1-8.6-3 20 20 0 0 1-6-6'
    + ' 20 20 0 0 1-3-8.6A2 2 0 0 1 6.3 3H9a2 2 0 0 1 2 1.8c.2 1 .4 2 .7 3a2'
    + ' 2 0 0 1-.5 2.1L10 11a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2'
    + ' .6 3 .7a2 2 0 0 1 1.7 2z"/>'
    + '</svg>'],
  ['Complaints',
    '<svg viewBox="0 0 32 32" fill="none" stroke-width="1.5"'
    + ' stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M28 5H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7l5 5 5-5h7a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>'
    + '<line x1="16" y1="10" x2="16" y2="16"/>'
    + '<line x1="16" y1="20" x2="16.01" y2="20"/>'
    + '</svg>'],
  ['Glossary of terms',
    '<svg viewBox="0 0 32 32" fill="none" stroke-width="1.5"'
    + ' stroke-linecap="round" stroke-linejoin="round">'
    + '<rect x="5" y="3" width="22" height="26" rx="2"/>'
    + '<line x1="10" y1="9" x2="22" y2="9"/>'
    + '<line x1="10" y1="13" x2="22" y2="13"/>'
    + '<line x1="10" y1="17" x2="18" y2="17"/>'
    + '</svg>'],
  ['Tax information reporting',
    '<svg viewBox="0 0 32 32" fill="none" stroke-width="1.5"'
    + ' stroke-linecap="round" stroke-linejoin="round">'
    + '<rect x="5" y="2" width="15" height="28" rx="2"/>'
    + '<path d="M20 8h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/>'
    + '<line x1="9" y1="9" x2="16" y2="9"/>'
    + '<line x1="9" y1="13" x2="16" y2="13"/>'
    + '</svg>'],
]);

const DEFAULT_ICON = '<svg viewBox="0 0 32 32" fill="none" stroke-width="1.5"'
  + ' stroke-linecap="round" stroke-linejoin="round">'
  + '<circle cx="16" cy="16" r="12"/>'
  + '<path d="M13 12.5a3.2 3.2 0 0 1 6.2.8c0 2.1-3 2.8-3 4.7"/>'
  + '</svg>';

// div.innerHTML crea elementos SVG con el namespace http://www.w3.org/2000/svg correcto.
// DOMParser('image/svg+xml') pierde el namespace al mover el elemento a un HTMLDocument.
function svgFromString(svgStr) {
  const wrap = document.createElement('div');
  // eslint-disable-next-line no-unsanitized/element
  wrap.innerHTML = svgStr;
  return wrap.firstElementChild;
}

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

  const accentKeys = ['yellow', 'cyan'];

  const ul = document.createElement('ul');
  ul.className = 'highlights-list';

  cards.forEach((card, i) => {
    const li = document.createElement('li');
    li.className = `highlights-card highlights-card-${accentKeys[i % 2]}`;

    const accent = document.createElement('div');
    accent.className = 'highlights-card-accent';
    accent.setAttribute('aria-hidden', 'true');

    const iconStr = CARD_ICONS.get(card.title) || DEFAULT_ICON;
    accent.append(svgFromString(iconStr));

    const body = document.createElement('div');
    body.className = 'highlights-card-body';

    const h3 = document.createElement('h3');
    h3.className = 'highlights-card-title';
    h3.textContent = card.title;

    const desc = document.createElement('p');
    desc.className = 'highlights-card-desc';
    desc.textContent = card.desc;

    body.append(h3, desc);

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
