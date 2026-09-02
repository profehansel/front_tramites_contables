import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CrearPago, PagarConSaldo, Pago } from '../models/pago.model';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private base = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  registrar(dto: CrearPago) {
    return this.http.post(this.base, dto);
  }

  pagarConSaldo(dto: PagarConSaldo) {
    return this.http.post(`${this.base}/aplicar-saldo`, dto);
  }

  listarPorCliente(clienteId: number) {
    return this.http.get<Pago[]>(`${this.base}/cliente/${clienteId}`);
  }
}
