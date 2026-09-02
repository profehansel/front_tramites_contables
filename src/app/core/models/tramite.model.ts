import { Cliente } from './cliente.model';
import { CatalogoItem } from './catalogo.model';

export type TramiteStatus = 'en_proceso' | 'finalizado' | 'cancelado';

export interface DetalleTramite {
  detalleId: number;
  detalleCosto: number;
  detalleConcepto?: string;
  catalogo: CatalogoItem;
}

export interface Tramite {
  tramiteId: number;
  tramiteFechaInicio: string;
  tramiteFechaFin?: string;
  tramiteStatus: TramiteStatus;
  tramiteObservacion?: string;
  cliente: Cliente;
  detalles: DetalleTramite[];
}

export interface CrearDetalleTramite {
  catalogoId: number;
  detalleConcepto?: string;
}

export interface CrearTramite {
  clienteId: number;
  usuarioId: number;
  detalles: CrearDetalleTramite[];
}

export interface ActualizarTramite {
  detalles: CrearDetalleTramite[];
}
