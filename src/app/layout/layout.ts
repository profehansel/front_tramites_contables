import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../core/services/auth.service';
import { AlertaService } from '../core/services/alerta.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, BadgeModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  // inject() en vez de inyeccion por constructor: los inicializadores de
  // campo corren antes que el cuerpo del constructor, asi que si otro
  // campo depende de un servicio inyectado por constructor, falla con
  // "used before initialization". Con inject() esto no pasa.
  private authService = inject(AuthService);
  private alertaService = inject(AlertaService);

  usuario = this.authService.usuario;

  // Cantidad de alertas pendientes, para el badge del menu lateral
  totalAlertas = toSignal(
    this.alertaService.listarPendientes().pipe(map((alertas) => alertas.length)),
    { initialValue: 0 },
  );

  cerrarSesion(): void {
    this.authService.logout();
  }
}
