/**
 * Legal Text block — sección de "Important information" con notas al pie numeradas.
 * Replica el componente .legal-text de Bankinter.
 *
 * Estructura de autoría esperada:
 *   Fila 1: título de la sección (h3 o p en negrita)
 *   Fila 2+: cada nota al pie como un párrafo (con número superíndice incluido o sin él)
 */
export default function decorate(block) {
  const rows = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'legal-text-inner';

  // Primera fila: título
  if (rows[0]) {
    const titleDiv = rows[0].querySelector('div') || rows[0];
    const titleEl = document.createElement('h3');
    titleEl.className = 'legal-text-title';
    titleEl.textContent = titleDiv.textContent.trim();
    wrapper.append(titleEl);
  }

  // Filas siguientes: cada nota al pie
  const list = document.createElement('ol');
  list.className = 'legal-text-list';

  rows.slice(1).forEach((row) => {
    const contentDiv = row.querySelector('div') || row;
    const item = document.createElement('li');
    item.className = 'legal-text-item';
    // Preservar HTML enriquecido (links, strong, etc.) — el contenido proviene del CMS (AEM)
    item.innerHTML = contentDiv.innerHTML;
    list.append(item);
  });

  if (list.children.length > 0) wrapper.append(list);

  block.replaceChildren(wrapper);
}
