/**
 * highlights.js — Bloque AEM EDS: Highlights (tarjetas de producto)
 * Maneja dos estructuras de entrada:
 *   A) EDS block format: rows con columnas (div > div > div)
 *      - Row 1: 1 columna con h2 (section heading)
 *      - Row 2: N columnas (una por tarjeta)
 *   B) Rich-text format: h2 + h3/p/p grupos en un solo contenedor
 */

const CARD_COLORS = ['yellow', 'cyan', 'orange', 'yellow', 'cyan', 'orange'];

export default function decorate(block) {
  if (!block) return;
  block.classList.add('highlights--initialized');

  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Detectar si es EDS block format (alguna fila tiene múltiples columnas)
  const hasMultiColRow = rows.some(r => r.querySelectorAll(':scope > div').length > 1);

  if (hasMultiColRow) {
    buildFromEdsStructure(block, rows);
  } else {
    // Rich-text format: unir todo el HTML y parsear h2/h3 grupos
    const allContent = rows.map(r => r.innerHTML).join('');
    block.innerHTML = '';
    buildCardsFromRichText(block, allContent);
  }
}

// ── Caso A: EDS block format ──────────────────────────────────
function buildFromEdsStructure(block, rows) {
  const container = document.createElement('div');

  // Fila de heading: 1 sola columna con h2
  const headingRow = rows.find(r => {
    const cols = r.querySelectorAll(':scope > div');
    return cols.length === 1 && cols[0].querySelector('h2');
  });

  if (headingRow) {
    const sh = document.createElement('div');
    sh.className = 'highlights__section-heading';
    const h2 = headingRow.querySelector('h2');
    sh.append(h2.cloneNode(true));
    container.append(sh);
  }

  // Fila de tarjetas: N columnas
  const cardRow = rows.find(r => r.querySelectorAll(':scope > div').length > 1);
  if (cardRow) {
    const grid = document.createElement('div');
    grid.className = 'highlights__grid';

    [...cardRow.querySelectorAll(':scope > div')].forEach((cell, idx) => {
      const h3 = cell.querySelector('h3');
      const allPs = [...cell.querySelectorAll('p')];
      // Último <p> que contiene solo un enlace = CTA
      const ctaP = allPs.reverse().find(p => {
        const links = p.querySelectorAll('a');
        return links.length === 1 && p.textContent.trim() === links[0].textContent.trim();
      });
      allPs.reverse(); // restaurar orden

      const descParts = [...cell.children]
        .filter(c => c !== h3 && c !== ctaP)
        .map(c => c.outerHTML)
        .join('');

      const card = createCard(
        h3 ? h3.innerHTML : '',
        descParts,
        ctaP ? ctaP.innerHTML : '',
        CARD_COLORS[idx % CARD_COLORS.length]
      );
      grid.append(card);
    });

    container.append(grid);
  }

  block.innerHTML = '';
  block.append(container);
}

// ── Caso B: Rich-text con h2/h3 grupos ───────────────────────
function buildCardsFromRichText(block, html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const container = document.createElement('div');

  const h2 = tmp.querySelector('h2');
  if (h2) {
    const sh = document.createElement('div');
    sh.className = 'highlights__section-heading';
    sh.append(h2.cloneNode(true));
    container.append(sh);
  }

  const grid = document.createElement('div');
  grid.className = 'highlights__grid';

  const children = [...tmp.children];
  let cardIdx = 0;
  let i = 0;

  while (i < children.length) {
    const el = children[i];
    if (el.tagName === 'H2') { i++; continue; }

    if (el.tagName === 'H3') {
      const title = el.innerHTML;
      const descParts = [];
      let ctaHtml = '';
      i++;

      while (i < children.length && !['H2','H3'].includes(children[i].tagName)) {
        const next = children[i];
        const isLast = i + 1 >= children.length || ['H2','H3'].includes(children[i + 1]?.tagName);
        const isCtaP = next.tagName === 'P'
          && next.querySelectorAll('a').length === 1
          && next.textContent.trim() === next.querySelector('a')?.textContent?.trim();

        if (isCtaP && isLast) {
          ctaHtml = next.innerHTML;
        } else {
          descParts.push(next.outerHTML);
        }
        i++;
      }

      grid.append(createCard(title, descParts.join(''), ctaHtml, CARD_COLORS[cardIdx % CARD_COLORS.length]));
      cardIdx++;
    } else {
      i++;
    }
  }

  container.append(grid);
  block.append(container);
}

// ── Factory de tarjeta ───────────────────────────────────────
const ICONS = { yellow: '💳', cyan: '💰', orange: '🏠', default: '✦' };

function createCard(titleHtml, descHtml, ctaHtml, color) {
  const card = document.createElement('div');
  card.className = `highlights__card card--${color}`;

  const icon = document.createElement('div');
  icon.className = 'highlights__card-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = ICONS[color] || ICONS.default;
  card.append(icon);

  const h3 = document.createElement('h3');
  h3.innerHTML = titleHtml;
  card.append(h3);

  if (descHtml) {
    const desc = document.createElement('div');
    desc.className = 'highlights__card-desc';
    desc.innerHTML = descHtml;
    card.append(desc);
  }

  if (ctaHtml) {
    const cta = document.createElement('div');
    cta.className = 'highlights__card-cta';
    cta.innerHTML = ctaHtml;
    const link = cta.querySelector('a');
    if (link?.href && !link.href.includes(window?.location?.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
    card.append(cta);
  }

  return card;
}
