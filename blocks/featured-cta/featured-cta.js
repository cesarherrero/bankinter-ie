/**
 * Featured CTA block — banner destacado con texto y botón CTA.
 * Replica el componente .featured-box--yellow de Bankinter IE.
 *
 * Estructura de autor AEM (2 filas):
 *   Fila 0: texto del titular (heading — richtext o texto plano)
 *   Fila 1: enlace CTA (texto del botón + URL)
 */
export default function decorate(block) {
  const rows = [...block.children];
  const getCell = (row) => row?.querySelector('div') || row;

  // Fila 0: heading / texto principal
  const headingCell = getCell(rows[0]);

  // Fila 1: enlace CTA
  const linkCell = getCell(rows[1]);

  const inner = document.createElement('div');
  inner.className = 'featured-cta-inner';

  // Texto del titular (izquierda)
  const textSide = document.createElement('div');
  textSide.className = 'featured-cta-text';

  if (headingCell) {
    const existing = headingCell.querySelector('h1, h2, h3, h4');
    if (existing) {
      existing.className = 'featured-cta-heading';
      textSide.append(existing);
    } else {
      const h2 = document.createElement('h2');
      h2.className = 'featured-cta-heading';
      h2.textContent = headingCell.textContent.trim();
      textSide.append(h2);
    }
  }

  // Botón CTA (derecha)
  const actionSide = document.createElement('div');
  actionSide.className = 'featured-cta-action';

  if (linkCell) {
    const anchor = linkCell.querySelector('a');
    if (anchor) {
      anchor.classList.add('btn', 'btn--primary');
      actionSide.append(anchor);
    } else {
      // Texto sin href — botón placeholder
      const btn = document.createElement('span');
      btn.className = 'btn btn--primary';
      btn.textContent = linkCell.textContent.trim();
      actionSide.append(btn);
    }
  }

  inner.append(textSide, actionSide);
  block.replaceChildren(inner);
}
