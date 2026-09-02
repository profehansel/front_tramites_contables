import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';

import { GastoService } from '../../core/services/gasto.service';
import { AuthService } from '../../core/services/auth.service';
import { Gasto } from '../../core/models/gasto.model';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TooltipModule,
    MessageModule,
  ],
  templateUrl: './gastos.html',
  styleUrl: './gastos.scss',
})
export class Gastos implements OnInit {
  private gastoService = inject(GastoService);
  private authService = inject(AuthService);

  gastos = signal<Gasto[]>([]);

  dialogoAbierto = signal(false);
  guardando = signal(false);
  editandoId = signal<number | null>(null);
  errorGuardar = signal<string | null>(null);

  gastoEliminar = signal<Gasto | null>(null);
  eliminando = signal(false);
  errorEliminar = signal<string | null>(null);

  form: { gastoMonto: number | null; gastoDescripcion: string } = {
    gastoMonto: null,
    gastoDescripcion: '',
  };

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.gastoService.listar().subscribe((g) => this.gastos.set(g));
  }

  totalGastos(): number {
    return this.gastos().reduce((acc, g) => acc + Number(g.gastoMonto), 0);
  }

  abrirNuevo(): void {
    this.editandoId.set(null);
    this.errorGuardar.set(null);
    this.form = { gastoMonto: null, gastoDescripcion: '' };
    this.dialogoAbierto.set(true);
  }

  abrirEditar(gasto: Gasto): void {
    this.editandoId.set(gasto.gastoId);
    this.errorGuardar.set(null);
    this.form = { gastoMonto: gasto.gastoMonto, gastoDescripcion: gasto.gastoDescripcion };
    this.dialogoAbierto.set(true);
  }

  guardar(): void {
    if (!this.form.gastoMonto || this.form.gastoDescripcion.trim().length < 3) return;

    this.errorGuardar.set(null);
    this.guardando.set(true);

    const id = this.editandoId();
    const peticion = id
      ? this.gastoService.actualizar(id, {
          gastoMonto: this.form.gastoMonto,
          gastoDescripcion: this.form.gastoDescripcion,
        })
      : this.gastoService.crear({
          gastoMonto: this.form.gastoMonto,
          gastoDescripcion: this.form.gastoDescripcion,
          usuarioId: this.authService.usuario()!.usuarioId,
        });

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.dialogoAbierto.set(false);
        this.cargar();
      },
      error: (err) => {
        this.guardando.set(false);
        this.errorGuardar.set(err?.error?.message ?? 'No se pudo guardar el gasto');
      },
    });
  }

  pedirEliminar(gasto: Gasto): void {
    this.errorEliminar.set(null);
    this.gastoEliminar.set(gasto);
  }

  confirmarEliminar(): void {
    const gasto = this.gastoEliminar();
    if (!gasto) return;

    this.errorEliminar.set(null);
    this.eliminando.set(true);
    this.gastoService.eliminar(gasto.gastoId).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.gastoEliminar.set(null);
        this.cargar();
      },
      error: (err) => {
        this.eliminando.set(false);
        this.errorEliminar.set(err?.error?.message ?? 'No se pudo eliminar el gasto');
      },
    });
  }
}
