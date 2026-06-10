/**
 * highlights.js — Bloque AEM EDS: Highlights
 * Transforma el contenido de la sección de productos en un grid de tarjetas.
 * 
 * Estructura esperada del bloque (opciones):
 *   A) Cada fila del bloque = una tarjeta (title | desc | ctaURL|ctaText)
 *   B) Contenido como rich-text con h2 (section heading) + h3/p/p grupos (tarjetas)
 *
 * El bloque detecta automáticamente cuál de las dos estructuras usar.
 */

const CARD_COLORS = ['yellow', 'cyan', 'orange', 'yellow', 'cyan', 'orange'];

export default function decorate(block) {
  if (!block) return;

  block.classList.add('highlights--initialized');
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // ── Caso A: múltiples filas = una tarjeta por fila ──
  // Cada fila tiene dos o más celdas: [título, descripción, (cta)]
  const firstRowCells = rows[0].querySelectorAll(':scope > div');
  const isTableFormat = rows.length > 1 && firstRowCells.length >= 2 && !firstRowCells[0].querySelector('h2');

  if (isTableFormat) {
    buildCardsFromRows(block, rows);
  } else {
    // ── Caso B: rich-text con h2 + h3/p grupos ──
    const allContent = rows.map(r => r.innerHTML).join('');
    block.innerHTML = '';
    buildCardsFromRichText(block, allContent);
  }
}

function buildCardsFromRows(block, rows) {
  const container = document.createElement('div');

  // Buscar si la primera fila es un heading suelto (sin celdas múltiples)
  const firstCells = rows[0].querySelectorAll(':scope > div');
  let headingEl = null;
  let cardRows = rows;

  if (firstCells.length === 1 && firstCells[0].querySelector('h2')) {
    headingEl = firstCells[0];
    cardRows = rows.slice(1);
  }

  if (headingEl) {
    const heading = document.createElement('div');
    heading.className = 'highlights__section-heading';
    heading.append(...headingEl.childNodes);
    container.append(heading);
  }

  const grid = document.createElement('div');
  grid.className = 'highlights__grid';

  cardRows.forEach((row, idx) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const card = createCard(
      cells[0]?.innerHTML || '',
      cells[1]?.innerHTML || '',
      cells[2]?.textContent?.trim() || '',
      CARD_COLORS[idx % CARD_COLORS.length]
    );
    grid.append(card);
  });

  container.append(grid);
  block.append(container);
}

function buildCardsFromRichText(block, html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const container = document.createElement('div');

  // Separar h2 (heading de sección) de los h3 (tarjetas)
  const h2 = tmp.querySelector('h2');
  if (h2) {
    const sectionHeading = document.createElement('div');
    sectionHeading.className = 'highlights__section-heading';
    sectionHeading.append(h2.cloneNode(true));
    container.append(sectionHeading);
  }

  // Agrupar h3 con su contenido siguiente hasta el próximo h3
  const grid = document.createElement('div');
  grid.className = 'highlights__grid';

  const children = [...tmp.children];
  let cardIdx = 0;
  let i = 0;

  while (i < children.length) {
    const el = children[i];

    if (el.tagName === 'H2') {
      i++;
      continue;
    }

    if (el.tagName === 'H3') {
      const title = el.innerHTML;
      const descParts = [];
      let ctaHtml = '';
      i++;

      // Recoger todo hasta el siguiente h3 o fin
      while (i < children.length && children[i].tagName !== 'H3' && children[i].tagName !== 'H2') {
        const next = children[i];
        // El último p antes del siguiente h3 que contiene solo un enlace es el CTA
        const isCtaP = next.tagName === 'P' && next.querySelectorAll('a').length === 1 && next.textContent.trim() === next.querySelector('a')?.textContent?.trim();
        // Check if it's the last paragraph before next H3
        const isLastP = i + 1 >= children.length || children[i + 1].tagName === 'H3';

        if (isCtaP && isLastP) {
          ctaHtml = next.innerHTML;
        } else {
          descParts.push(next.outerHTML);
        }
        i++;
      }

      const card = createCard(
        title,
        descParts.join(''),
        ctaHtml,
        CARD_COLORS[cardIdx % CARD_COLORS.length]
      );
      grid.append(card);
      cardIdx++;
    } else {
      i++;
    }
  }

  container.append(grid);
  block.append(container);
}

function createCard(titleHtml, descHtml, ctaHtml, colorVariant) {
  const card = document.createElement('div');
  card.className = `highlights__card card--${colorVariant}`;

  // Icono decorativo
  const icon = document.createElement('div');
  icon.className = 'highlights__card-icon';
  icon.setAttribute('aria-hidden', 'true');
  const icons = { yellow: '💳', cyan: '💰', orange: '🏠' };
  icon.textContent = icons[colorVariant] || '✦';
  card.append(icon);

  // Título
  const heading = document.createElement('h3');
  heading.innerHTML = titleHtml;
  card.append(heading);

  // Descripción
  if (descHtml) {
    const desc = document.createElement('div');
    desc.className = 'highlights__card-desc';
    desc.innerHTML = descHtml;
    card.append(desc);
  }

  // CTA
  if (ctaHtml) {
    const cta = document.createElement('div');
    cta.className = 'highlights__card-cta';
    cta.innerHTML = ctaHtml;
    // Asegurar que el enlace tiene target="_blank" si es externo
    const link = cta.querySelector('a');
    if (link && link.href && !link.href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
    card.append(cta);
  }

  return card;
}
