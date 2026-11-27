/**
 * Resuelve el identificador del albergue a partir de su nombre.
 * Regla compartida por registro, wizard y servicios para que no existan
 * dos fuentes distintas de verdad.
 */
export function resolverAlbergueId(nombre: string | undefined): string {
  const texto = (nombre ?? '').toLowerCase();
  if (texto.includes('4 patas') || texto.includes('chilca')) return 'alb-2';
  return 'alb-1';
}
