/**
 * Rate Highlight block — sección de producto con heading, descripción, CTA y caja de tasas.
 * Replica el componente .quality.quality--cyan de la home de Bankinter.
 *
 * Estructura generada por AEM Author (4 filas):
 *   Fila 0: richtext — h2, descripción, enlace CTA
 *   Fila 1: etiqueta de tasa (ej: "Great rate")
 *   Fila 2: valor de tasa (ej: "2.70% p.a")
 *   Fila 3: valor AER (ej: "2.72% AER")
 */
export default function decorate(block) {
  const rows = [...block.children];
  const getText = (row) => (row?.querySelector('div') || row)?.textContent?.trim();

  // Construir layout de dos columnas
  const inner = document.createElement('div');
  inner.className = 'rate-highlight-inner';

  // Columna izquierda: contenido richtext (h2 + descripción + CTA)
  const leftCol = document.createElement('div');
  leftCol.className = 'rate-highlight-content';

  if (rows[0]) {
    const contentDiv = rows[0].querySelector('div') || rows[0];
    [...contentDiv.children].forEach((child) => {
      const anchors = child.querySelectorAll('a');
      anchors.forEach((a) => a.classList.add('btn', 'btn--primary'));
      leftCol.append(child);
    });
  }

  // Divisor decorativo después del heading
  const heading = leftCol.querySelector('h2, h3');
  if (heading) {
    const divider = document.createElement('div');
    divider.className = 'rate-highlight-divider';
    heading.after(divider);
  }

  // Columna derecha: caja de tasas construida con filas 1, 2, 3
  const rightCol = document.createElement('div');
  rightCol.className = 'rate-highlight-rates';

  const rateLabel = getText(rows[1]);
  const rateValue = getText(rows[2]);
  const rateAer = getText(rows[3]);

  if (rateLabel) {
    const labelEl = document.createElement('p');
    labelEl.className = 'rate-highlight-rate-label';
    labelEl.textContent = rateLabel;
    rightCol.append(labelEl);
  }
  if (rateValue) {
    const valueEl = document.createElement('p');
    valueEl.className = 'rate-highlight-rate-value';
    valueEl.textContent = rateValue;
    rightCol.append(valueEl);
  }
  if (rateAer) {
    const aerEl = document.createElement('p');
    aerEl.className = 'rate-highlight-rate-aer';
    aerEl.textContent = rateAer;
    rightCol.append(aerEl);
  }

  inner.append(leftCol, rightCol);
  block.replaceChildren(inner);
}
