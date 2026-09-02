import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CatalogoItem } from '../models/catalogo.model';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private base = `${environment.apiUrl}/catalogo`;

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<CatalogoItem[]>(this.base);
  }

  crear(item: Partial<CatalogoItem>) {
    return this.http.post<CatalogoItem>(this.base, item);
  }

  actualizar(catalogoId: number, item: Partial<CatalogoItem>) {
    return this.http.patch<CatalogoItem>(`${this.base}/${catalogoId}`, item);
  }

  eliminar(catalogoId: number) {
    return this.http.delete<void>(`${this.base}/${catalogoId}`);
  }
}
