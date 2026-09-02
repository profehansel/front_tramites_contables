export interface SaldoActual {
  ultimoCorteFecha: string | null;
  saldoAnterior: number;
  totalIngresos: number;
  totalGastos: number;
  saldoTeorico: number;
}

export interface Denominacion {
  valor: number;
  cantidad: number;
}

export interface DenominacionGuardada extends Denominacion {
  denominacionId: number;
  subtotal: number;
}

export interface CorteCaja {
  corteId: number;
  corteFecha: string;
  usuario: { usuarioId: number; usuarioNombre: string };
  saldoAnterior: number;
  totalIngresos: number;
  totalGastos: number;
  saldoTeorico: number;
  saldoContado: number;
  diferencia: number;
  observacion?: string;
  denominaciones: DenominacionGuardada[];
}

export interface CerrarCorte {
  saldoContado: number;
  usuarioId: number;
  observacion?: string;
  denominaciones?: Denominacion[];
}
