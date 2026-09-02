export interface Cliente {
  clienteId: number;
  clienteNombre: string;
  clienteCui?: string;
  clienteNit?: string;
  clienteTelefonoPrincipal?: string;
  clienteTelefonoSecundario?: string;
  clienteCorreo?: string;
  clienteDireccion?: string;
  clienteActive: boolean;
}

export interface DeudaCliente {
  cliente_id: number;
  cliente_nombre: string;
  total_tramites: number;
  total_pagado: number;
  deuda_pendiente: number;
}

export interface SaldoDisponible {
  cliente_id: number;
  cliente_nombre: string;
  saldo_disponible: number;
}
