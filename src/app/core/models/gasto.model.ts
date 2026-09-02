export interface Gasto {
  gastoId: number;
  gastoMonto: number;
  gastoDescripcion: string;
  gastoFecha: string;
  usuario: { usuarioId: number; usuarioNombre: string };
}

export interface CrearGasto {
  gastoMonto: number;
  gastoDescripcion: string;
  usuarioId: number;
}

export interface ActualizarGasto {
  gastoMonto?: number;
  gastoDescripcion?: string;
}
