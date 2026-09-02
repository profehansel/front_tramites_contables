import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { Textarea } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';

import { CorteCajaService } from '../../core/services/corte-caja.service';
import { AuthService } from '../../core/services/auth.service';
import { CorteCaja, Denominacion, SaldoActual } from '../../core/models/corte-caja.model';

// Denominaciones estandar de quetzales que se ofrecen para el conteo
// detallado (opcional).
const DENOMINACIONES_BASE = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05];

@Component({
  selector: 'app-corte-caja',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule,
    Textarea,
    MessageModule,
    TagModule,
  ],
  templateUrl: './corte-caja.html',
  styleUrl: './corte-caja.scss',
})
export class CorteCajaPage implements OnInit {
  private corteCajaService = inject(CorteCajaService);
  private authService = inject(AuthService);

  saldoActual = signal<SaldoActual | null>(null);
  historial = signal<CorteCaja[]>([]);

  dialogoAbierto = signal(false);
  guardando = signal(false);
  errorGuardar = signal<string | null>(null);

  usarDesglose = false;
  saldoContadoManual: number | null = null;
  observacion = '';

  filasDenominacion: { valor: number; cantidad: number }[] = DENOMINACIONES_BASE.map((valor) => ({
    valor,
    cantidad: 0,
  }));

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.corteCajaService.saldoActual().subscribe((s) => this.saldoActual.set(s));
    this.corteCajaService.listarHistorial().subscribe((h) => this.historial.set(h));
  }

  totalDesglose(): number {
    return this.filasDenominacion.reduce((acc, f) => acc + f.valor * f.cantidad, 0);
  }

  saldoContadoFinal(): number {
    return this.usarDesglose ? this.totalDesglose() : this.saldoContadoManual ?? 0;
  }

  diferenciaPrevia(): number {
    const teorico = this.saldoActual()?.saldoTeorico ?? 0;
    return Number((this.saldoContadoFinal() - teorico).toFixed(2));
  }

  abrirCierre(): void {
    this.usarDesglose = false;
    this.saldoContadoManual = null;
    this.observacion = '';
    this.filasDenominacion = DENOMINACIONES_BASE.map((valor) => ({ valor, cantidad: 0 }));
    this.errorGuardar.set(null);
    this.dialogoAbierto.set(true);
  }

  cerrarCorte(): void {
    const usuarioId = this.authService.usuario()?.usuarioId;
    if (!usuarioId) return;

    const saldoContado = this.saldoContadoFinal();
    const hayDiferencia = Math.abs(this.diferenciaPrevia()) > 0.01;
    if (hayDiferencia && this.observacion.trim().length < 3) {
      this.errorGuardar.set('Hay una diferencia: agrega una observacion antes de cerrar el corte');
      return;
    }

    const denominaciones: Denominacion[] | undefined = this.usarDesglose
      ? this.filasDenominacion.filter((f) => f.cantidad > 0).map((f) => ({ valor: f.valor, cantidad: f.cantidad }))
      : undefined;

    this.errorGuardar.set(null);
    this.guardando.set(true);
    this.corteCajaService
      .cerrarCorte({ saldoContado, usuarioId, observacion: this.observacion.trim() || undefined, denominaciones })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.dialogoAbierto.set(false);
          this.cargar();
        },
        error: (err) => {
          this.guardando.set(false);
          this.errorGuardar.set(err?.error?.message ?? 'No se pudo cerrar el corte');
        },
      });
  }
}
