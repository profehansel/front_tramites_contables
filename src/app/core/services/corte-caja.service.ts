import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CerrarCorte, CorteCaja, SaldoActual } from '../models/corte-caja.model';

@Injectable({ providedIn: 'root' })
export class CorteCajaService {
  private base = `${environment.apiUrl}/corte-caja`;

  constructor(private http: HttpClient) {}

  saldoActual() {
    return this.http.get<SaldoActual>(`${this.base}/actual`);
  }

  cerrarCorte(dto: CerrarCorte) {
    return this.http.post<CorteCaja>(this.base, dto);
  }

  listarHistorial() {
    return this.http.get<CorteCaja[]>(this.base);
  }
}
