import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovimientoSaldo, RegistrarAbono } from '../models/saldo.model';

@Injectable({ providedIn: 'root' })
export class SaldoService {
  private base = `${environment.apiUrl}/saldos`;

  constructor(private http: HttpClient) {}

  registrarAbono(dto: RegistrarAbono) {
    return this.http.post(`${this.base}/abono`, dto);
  }

  movimientosPorCliente(clienteId: number) {
    return this.http.get<MovimientoSaldo[]>(`${this.base}/cliente/${clienteId}`);
  }
}
