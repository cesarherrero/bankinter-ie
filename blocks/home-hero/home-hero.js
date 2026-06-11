/**
 * Home Hero block — banner-wide con imagen a la izquierda y tarjeta de contenido a la derecha.
 * Replica el estilo .banner-wide--alt-full-img de la home de Bankinter.
 *
 * Estructura de autoría esperada (2 filas en el bloque):
 *   Fila 1: imagen de fondo (picture)
 *   Fila 2: etiqueta, título, texto descriptivo, enlace/botón CTA
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Fila 0: imagen de fondo
  const bgPicture = rows[0]?.querySelector('picture');

  // Fila 1: contenido del card (label p, h1, p de texto, a de CTA)
  const contentRow = rows[1] || rows[0];
  const contentDiv = contentRow?.querySelector('div') || contentRow;

  // Construir el layout
  const inner = document.createElement('div');
  inner.className = 'home-hero-inner';

  // Imagen de fondo a pantalla completa
  if (bgPicture) {
    bgPicture.classList.add('home-hero-bg');
    inner.append(bgPicture);
  }

  // Tarjeta de contenido (lado derecho)
  const card = document.createElement('div');
  card.className = 'home-hero-card';

  if (contentDiv) {
    [...contentDiv.children].forEach((child) => {
      // Los enlaces se convierten en botones primarios
      const anchors = child.querySelectorAll('a');
      anchors.forEach((a) => a.classList.add('btn', 'btn--primary'));
      card.append(child);
    });
  }

  inner.append(card);
  block.replaceChildren(inner);
}
