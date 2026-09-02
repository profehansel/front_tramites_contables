import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';

import { ClienteService } from '../../../core/services/cliente.service';
import { TramiteService } from '../../../core/services/tramite.service';
import { SaldoService } from '../../../core/services/saldo.service';
import { PagoService } from '../../../core/services/pago.service';

import { Cliente, DeudaCliente, SaldoDisponible } from '../../../core/models/cliente.model';
import { Tramite } from '../../../core/models/tramite.model';
import { MovimientoSaldo } from '../../../core/models/saldo.model';
import { Pago } from '../../../core/models/pago.model';
import { nombreTramite, costoTramite } from '../../../core/utils/tramite-display';

@Component({
  selector: 'app-cliente-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    CheckboxModule,
  ],
  templateUrl: './cliente-detalle.html',
  styleUrl: './cliente-detalle.scss',
})
export class ClienteDetalle implements OnInit {
  nombreTramite = nombreTramite;
  costoTramite = costoTramite;

  clienteId!: number;

  cliente = signal<Cliente | null>(null);
  deuda = signal<DeudaCliente | null>(null);
  saldo = signal<SaldoDisponible | null>(null);
  tramites = signal<Tramite[]>([]);
  movimientos = signal<MovimientoSaldo[]>([]);
  pagos = signal<Pago[]>([]);

  dialogoAbonoAbierto = signal(false);
  montoAbono = 0;
  guardandoAbono = signal(false);

  dialogoSaldoAbierto = signal(false);
  tramitesSeleccionados: number[] = [];
  aplicandoSaldo = signal(false);

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private tramiteService: TramiteService,
    private saldoService: SaldoService,
    private pagoService: PagoService,
  ) {}

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.clienteService.obtener(this.clienteId).subscribe((c) => this.cliente.set(c));
    this.clienteService.obtenerDeuda(this.clienteId).subscribe((d) => this.deuda.set(d));
    this.clienteService.obtenerSaldo(this.clienteId).subscribe((s) => this.saldo.set(s));
    this.tramiteService.listar(this.clienteId).subscribe((t) => this.tramites.set(t));
    this.saldoService.movimientosPorCliente(this.clienteId).subscribe((m) => this.movimientos.set(m));
    this.pagoService.listarPorCliente(this.clienteId).subscribe((p) => this.pagos.set(p));
  }

  // --- Abono / adelanto ---
  abrirDialogoAbono(): void {
    this.montoAbono = 0;
    this.dialogoAbonoAbierto.set(true);
  }

  guardarAbono(): void {
    this.guardandoAbono.set(true);
    this.saldoService
      .registrarAbono({ clienteId: this.clienteId, monto: this.montoAbono })
      .subscribe({
        next: () => {
          this.guardandoAbono.set(false);
          this.dialogoAbonoAbierto.set(false);
          this.cargarTodo();
        },
        error: () => this.guardandoAbono.set(false),
      });
  }

  // --- Aplicar saldo a tramites pendientes ---
  abrirDialogoSaldo(): void {
    this.tramitesSeleccionados = [];
    this.dialogoSaldoAbierto.set(true);
  }

  toggleTramiteSeleccionado(tramiteId: number, marcado: boolean): void {
    if (marcado) {
      this.tramitesSeleccionados = [...this.tramitesSeleccionados, tramiteId];
    } else {
      this.tramitesSeleccionados = this.tramitesSeleccionados.filter((id) => id !== tramiteId);
    }
  }

  aplicarSaldo(): void {
    if (this.tramitesSeleccionados.length === 0) return;

    this.aplicandoSaldo.set(true);
    this.pagoService
      .pagarConSaldo({ clienteId: this.clienteId, tramiteIds: this.tramitesSeleccionados })
      .subscribe({
        next: () => {
          this.aplicandoSaldo.set(false);
          this.dialogoSaldoAbierto.set(false);
          this.cargarTodo();
        },
        error: () => this.aplicandoSaldo.set(false),
      });
  }
}
