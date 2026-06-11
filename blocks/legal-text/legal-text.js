/**
 * Legal Text block — sección de "Important information" con notas al pie numeradas.
 * Replica el componente .legal-text de Bankinter.
 *
 * Estructura de autoría: un único campo richtext "content" con el HTML completo
 * (h3 + ol/li). AEM lo entrega como <div><div>RICHTEXT</div></div>.
 */
export default function decorate(block) {
  // AEM entrega el campo richtext como el primer (y único) div > div
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  const inner = document.createElement('div');
  inner.className = 'legal-text-inner';
  // Mover los hijos del cell directamente (preserva h3 + ol con links)
  while (cell.firstChild) {
    inner.append(cell.firstChild);
  }
  block.replaceChildren(inner);
}
