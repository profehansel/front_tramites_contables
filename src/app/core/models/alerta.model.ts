import { Tramite } from './tramite.model';

export interface Alerta {
  alertaId: number;
  alertaTipo: string;
  alertaFechaGenerada: string;
  alertaLeida: boolean;
  cliente: { clienteId: number; clienteNombre: string };
  tramite?: Tramite;
}
