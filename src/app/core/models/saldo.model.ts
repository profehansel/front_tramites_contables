export type SaldoTipoMovimiento = 'abono' | 'cargo';

export interface MovimientoSaldo {
  saldoId: number;
  saldoMonto: number;
  saldoTipoMovimiento: SaldoTipoMovimiento;
  saldoDescripcion?: string;
  saldoFecha: string;
}

export interface RegistrarAbono {
  clienteId: number;
  monto: number;
  descripcion?: string;
}
