/**
 * Features Grid block — cuadrícula de tarjetas de características con cuadrado de color.
 * Replica el componente .product-features / .content-box de Bankinter IE.
 *
 * Estructura de autor AEM (container + items):
 *   Cada features-grid-item es una fila con 2 celdas:
 *     Celda 0: título de la tarjeta
 *     Celda 1: descripción (richtext) + enlace opcional
 *
 * Los colores cyan/yellow alternan automáticamente por posición (impar=cyan, par=yellow).
 */

const VARIANTS = ['cyan', 'yellow'];

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const grid = document.createElement('div');
  grid.className = 'features-grid-cards';

  rows.forEach((row, idx) => {
    const cells = [...row.children];
    const variant = VARIANTS[idx % 2];

    const card = document.createElement('div');
    card.className = `features-grid-card features-grid-card-${variant}`;

    // Cuadrado decorativo de color (cyan o yellow)
    const square = document.createElement('div');
    square.className = 'features-grid-square';
    card.append(square);

    // Celda 0: título de la tarjeta
    const titleCell = cells[0]?.querySelector('div') || cells[0];
    if (titleCell) {
      // Reutilizar heading existente o crear h3
      const existingHeading = titleCell.querySelector('h1, h2, h3, h4');
      if (existingHeading) {
        existingHeading.className = 'features-grid-card-title';
        card.append(existingHeading);
      } else {
        const h3 = document.createElement('h3');
        h3.className = 'features-grid-card-title';
        h3.textContent = titleCell.textContent.trim();
        card.append(h3);
      }
    }

    // Celda 1: descripción richtext + enlace CTA opcional
    const descCell = cells[1]?.querySelector('div') || cells[1];
    if (descCell) {
      const body = document.createElement('div');
      body.className = 'features-grid-card-body';
      [...descCell.children].forEach((child) => {
        // Los enlaces sueltos (no en lista) se estilizan como text-link con flecha
        const links = child.querySelectorAll('a');
        links.forEach((a) => {
          if (!a.closest('li')) a.classList.add('features-grid-link');
        });
        body.append(child);
      });
      card.append(body);
    }

    grid.append(card);
  });

  block.replaceChildren(grid);
}
