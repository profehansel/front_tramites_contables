import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Alerta } from '../models/alerta.model';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private base = `${environment.apiUrl}/alertas`;

  constructor(private http: HttpClient) {}

  listarPendientes() {
    return this.http.get<Alerta[]>(this.base);
  }

  marcarLeida(alertaId: number) {
    return this.http.patch(`${this.base}/${alertaId}/leida`, {});
  }
}
