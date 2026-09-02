import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, UsuarioSesion } from '../models/auth.model';

const TOKEN_KEY = 'tramites_token';
const USUARIO_KEY = 'tramites_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal con el usuario actual (o null si no hay sesion), para que
  // el layout/menu reaccione automaticamente sin suscripciones manuales.
  private usuarioSignal = signal<UsuarioSesion | null>(this.leerUsuarioGuardado());
  usuario = computed(() => this.usuarioSignal());
  estaAutenticado = computed(() => !!this.usuarioSignal());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(usuarioNombre: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { usuarioNombre, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.accessToken);
          localStorage.setItem(USUARIO_KEY, JSON.stringify(res.usuario));
          this.usuarioSignal.set(res.usuario);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.usuarioSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private leerUsuarioGuardado(): UsuarioSesion | null {
    const crudo = localStorage.getItem(USUARIO_KEY);
    return crudo ? JSON.parse(crudo) : null;
  }
}
