import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { AlertaService } from '../../core/services/alerta.service';
import { Alerta } from '../../core/models/alerta.model';
import { nombreTramite } from '../../core/utils/tramite-display';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, TagModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private alertaService = inject(AlertaService);

  nombreTramite = nombreTramite;

  alertas = toSignal(this.alertaService.listarPendientes(), { initialValue: [] as Alerta[] });
}
