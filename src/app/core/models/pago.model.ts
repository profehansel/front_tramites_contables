import { Tramite } from './tramite.model';

export type PagoMetodo = 'efectivo' | 'transferencia' | 'tarjeta' | 'saldo_adelanto' | 'otro';
export type PagoEstado = 'completado' | 'anulado';

export interface AplicacionPago {
  tramiteId: number;
  montoAplicado: number;
}

export interface CrearPago {
  clienteId: number;
  pagoMonto: number;
  pagoMetodo: PagoMetodo;
  aplicaciones: AplicacionPago[];
}

export interface PagarConSaldo {
  clienteId: number;
  tramiteIds: number[];
}

export interface AplicacionPagoDetalle {
  aplicacionId: number;
  montoAplicado: number;
  tramite: Tramite;
}

export interface Pago {
  pagoId: number;
  pagoFecha: string;
  pagoMonto: number;
  pagoMetodo: PagoMetodo;
  pagoEstado: PagoEstado;
  aplicaciones: AplicacionPagoDetalle[];
}
