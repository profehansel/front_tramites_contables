import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActualizarGasto, CrearGasto, Gasto } from '../models/gasto.model';

@Injectable({ providedIn: 'root' })
export class GastoService {
  private base = `${environment.apiUrl}/gastos`;

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Gasto[]>(this.base);
  }

  crear(dto: CrearGasto) {
    return this.http.post<Gasto>(this.base, dto);
  }

  actualizar(gastoId: number, dto: ActualizarGasto) {
    return this.http.patch<Gasto>(`${this.base}/${gastoId}`, dto);
  }

  eliminar(gastoId: number) {
    return this.http.delete<void>(`${this.base}/${gastoId}`);
  }
}
