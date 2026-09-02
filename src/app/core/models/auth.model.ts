export type UsuarioRol = 'admin' | 'contador' | 'asistente';

export interface UsuarioSesion {
  usuarioId: number;
  usuarioNombre: string;
  rol: UsuarioRol;
}

export interface LoginResponse {
  accessToken: string;
  usuario: UsuarioSesion;
}
