import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActualizarTramite, CrearTramite, Tramite } from '../models/tramite.model';

@Injectable({ providedIn: 'root' })
export class TramiteService {
  private base = `${environment.apiUrl}/tramites`;

  constructor(private http: HttpClient) {}

  listar(clienteId?: number) {
    let params = new HttpParams();
    if (clienteId) {
      params = params.set('clienteId', String(clienteId));
    }
    return this.http.get<Tramite[]>(this.base, { params });
  }

  obtener(tramiteId: number) {
    return this.http.get<Tramite>(`${this.base}/${tramiteId}`);
  }

  crear(dto: CrearTramite) {
    return this.http.post<Tramite>(this.base, dto);
  }

  actualizar(tramiteId: number, dto: ActualizarTramite) {
    return this.http.patch<Tramite>(`${this.base}/${tramiteId}`, dto);
  }

  finalizar(tramiteId: number) {
    return this.http.patch<Tramite>(`${this.base}/${tramiteId}/finalizar`, {});
  }

  cancelar(tramiteId: number, observacion: string) {
    return this.http.patch<Tramite>(`${this.base}/${tramiteId}/cancelar`, { observacion });
  }

  eliminar(tramiteId: number) {
    return this.http.delete<void>(`${this.base}/${tramiteId}`);
  }
}
