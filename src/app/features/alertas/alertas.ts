import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AlertaService } from '../../core/services/alerta.service';
import { Alerta } from '../../core/models/alerta.model';
import { nombreTramite } from '../../core/utils/tramite-display';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, ButtonModule, TagModule],
  templateUrl: './alertas.html',
  styleUrl: './alertas.scss',
})
export class Alertas implements OnInit {
  private alertaService = inject(AlertaService);

  nombreTramite = nombreTramite;

  alertas = signal<Alerta[]>([]);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.alertaService.listarPendientes().subscribe((a) => this.alertas.set(a));
  }

  marcarLeida(alertaId: number): void {
    this.alertaService.marcarLeida(alertaId).subscribe(() => this.cargar());
  }

  // Meses completos transcurridos desde que el tramite se marco como
  // finalizado.
  mesesAtraso(fechaFin?: string): number {
    if (!fechaFin) return 0;
    const fecha = new Date(fechaFin);
    const ahora = new Date();
    const diffDias = (ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.floor(diffDias / 30));
  }
}
