/**
 * Home Hero block — banner-wide con imagen a la izquierda y tarjeta de contenido a la derecha.
 * Replica el estilo .banner-wide--alt-full-img de la home de Bankinter.
 *
 * Estructura generada por AEM Author (4 filas):
 *   Fila 0: imagen — <a href="url-imagen"> o <picture>
 *   Fila 1: etiqueta de marca (label)
 *   Fila 2: richtext — h1, descripción, enlace CTA
 *   Fila 3: enlace AEM (campo link, ignorado si ya está en fila 2)
 */
export default function decorate(block) {
  const rows = [...block.children];
  const getCell = (row) => row?.querySelector('div') || row;

  // Fila 0: imagen de fondo (puede ser <picture> o <a href="url-img">)
  const imgCell = getCell(rows[0]);
  let bgEl = imgCell?.querySelector('picture');
  if (!bgEl) {
    const imgLink = imgCell?.querySelector('a');
    if (imgLink) {
      const img = document.createElement('img');
      img.src = imgLink.href || imgLink.textContent.trim();
      img.alt = '';
      img.loading = 'eager';
      bgEl = img;
    }
  }

  // Fila 1: etiqueta de marca
  const label = getCell(rows[1])?.textContent?.trim();

  // Fila 2: contenido principal (h1 + párrafos + CTA)
  const richCell = getCell(rows[2]);

  // Construir layout
  const inner = document.createElement('div');
  inner.className = 'home-hero-inner';

  // Imagen de fondo
  if (bgEl) {
    const bgWrap = document.createElement('div');
    bgWrap.className = 'home-hero-bg';
    bgWrap.append(bgEl);
    inner.append(bgWrap);
  }

  // Tarjeta de contenido (derecha)
  const card = document.createElement('div');
  card.className = 'home-hero-card';

  // Insertar etiqueta si existe
  if (label) {
    const labelEl = document.createElement('p');
    labelEl.className = 'home-hero-label';
    labelEl.textContent = label;
    card.append(labelEl);
  }

  // Insertar richtext
  if (richCell) {
    [...richCell.children].forEach((child) => {
      const anchors = child.querySelectorAll('a');
      anchors.forEach((a) => a.classList.add('btn', 'btn--primary'));
      card.append(child);
    });
  }

  inner.append(card);
  block.replaceChildren(inner);
}
