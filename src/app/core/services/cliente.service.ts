import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Cliente, DeudaCliente, SaldoDisponible } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private base = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Cliente[]>(this.base);
  }

  obtener(clienteId: number) {
    return this.http.get<Cliente>(`${this.base}/${clienteId}`);
  }

  crear(cliente: Partial<Cliente>) {
    return this.http.post<Cliente>(this.base, cliente);
  }

  actualizar(clienteId: number, cliente: Partial<Cliente>) {
    return this.http.patch<Cliente>(`${this.base}/${clienteId}`, cliente);
  }

  eliminar(clienteId: number) {
    return this.http.delete<void>(`${this.base}/${clienteId}`);
  }

  obtenerDeuda(clienteId: number) {
    return this.http.get<DeudaCliente>(`${this.base}/${clienteId}/deuda`);
  }

  obtenerSaldo(clienteId: number) {
    return this.http.get<SaldoDisponible>(`${this.base}/${clienteId}/saldo`);
  }
}
