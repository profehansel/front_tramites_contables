import { Tramite } from '../models/tramite.model';

// Un tramite puede incluir varios servicios del catalogo (varios
// "detalles"), asi que no tiene un nombre propio en la base de datos.
// Estas funciones derivan un nombre y un costo total legibles para
// mostrar en las tablas, a partir de sus detalles.

export function nombreTramite(tramite: Pick<Tramite, 'detalles'>): string {
  const nombres = tramite.detalles?.map((d) => d.catalogo?.catalogoNombre).filter(Boolean) ?? [];
  if (nombres.length === 0) return 'Sin servicios';
  if (nombres.length === 1) return nombres[0]!;
  if (nombres.length <= 2) return nombres.join(' + ');
  return `${nombres[0]} + ${nombres.length - 1} mas`;
}

export function costoTramite(tramite: Pick<Tramite, 'detalles'>): number {
  return (tramite.detalles ?? []).reduce((acc, d) => acc + Number(d.detalleCosto), 0);
}
