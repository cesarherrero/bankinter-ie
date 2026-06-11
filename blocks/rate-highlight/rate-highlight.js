/**
 * Rate Highlight block — sección de producto con heading, descripción, CTA y caja de tasas.
 * Replica el componente .quality.quality--cyan de la home de Bankinter.
 *
 * Estructura de autoría esperada (2 filas):
 *   Fila 1: título (h2), texto descriptivo, enlace CTA
 *   Fila 2: etiqueta de tasa, valor tasa (h3), valor AER (h3)
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Construir layout de dos columnas
  const inner = document.createElement('div');
  inner.className = 'rate-highlight-inner';

  // Columna izquierda: contenido (heading + texto + CTA)
  const leftCol = document.createElement('div');
  leftCol.className = 'rate-highlight-content';

  if (rows[0]) {
    const contentDiv = rows[0].querySelector('div') || rows[0];
    [...contentDiv.children].forEach((child) => {
      // Los enlaces se convierten en botón primario
      const anchors = child.querySelectorAll('a');
      anchors.forEach((a) => a.classList.add('btn', 'btn--primary'));
      leftCol.append(child);
    });
  }

  // Añadir divisor decorativo antes del primer párrafo (si hay h2)
  const heading = leftCol.querySelector('h2, h3');
  if (heading) {
    const divider = document.createElement('div');
    divider.className = 'rate-highlight-divider';
    heading.after(divider);
  }

  // Columna derecha: caja de tasas
  const rightCol = document.createElement('div');
  rightCol.className = 'rate-highlight-rates';

  if (rows[1]) {
    const ratesDiv = rows[1].querySelector('div') || rows[1];
    [...ratesDiv.children].forEach((child) => rightCol.append(child));
  }

  inner.append(leftCol, rightCol);
  block.replaceChildren(inner);
}
