import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageModule } from 'primeng/message';

import { ClienteService } from '../../core/services/cliente.service';
import { TramiteService } from '../../core/services/tramite.service';
import { PagoService } from '../../core/services/pago.service';
import { nombreTramite, costoTramite } from '../../core/utils/tramite-display';

import { Cliente } from '../../core/models/cliente.model';
import { Tramite } from '../../core/models/tramite.model';
import { PagoMetodo } from '../../core/models/pago.model';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    Select,
    InputNumberModule,
    MultiSelectModule,
    MessageModule,
  ],
  templateUrl: './pagos.html',
  styleUrl: './pagos.scss',
})
export class Pagos implements OnInit {
  clientes = signal<Cliente[]>([]);
  tramitesCliente = signal<Tramite[]>([]);

  // Opciones livianas para el multiSelect: le damos un "label" ya armado
  // (Nombre del servicio - Q150.00) para que optionLabel tenga un texto
  // que mostrar, tanto en la lista como en el chip seleccionado. Sin
  // esto, PrimeNG muestra el objeto Tramite completo como "[object Object]".
  opcionesTramites = signal<{ tramiteId: number; label: string }[]>([]);

  clienteSeleccionado: number | null = null;
  tramitesSeleccionados: number[] = [];
  pagoMonto = 0;
  pagoMetodo: PagoMetodo = 'efectivo';

  metodos: { label: string; value: PagoMetodo }[] = [
    { label: 'Efectivo', value: 'efectivo' },
    { label: 'Transferencia', value: 'transferencia' },
    { label: 'Tarjeta', value: 'tarjeta' },
  ];

  guardando = signal(false);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor(
    private clienteService: ClienteService,
    private tramiteService: TramiteService,
    private pagoService: PagoService,
  ) {}

  ngOnInit(): void {
    this.clienteService.listar().subscribe((c) => this.clientes.set(c));
  }

  onClienteChange(): void {
    this.tramitesSeleccionados = [];
    this.tramitesCliente.set([]);
    this.opcionesTramites.set([]);
    if (!this.clienteSeleccionado) return;

    this.tramiteService.listar(this.clienteSeleccionado).subscribe((tramites) => {
      this.tramitesCliente.set(tramites);
      this.opcionesTramites.set(
        tramites
          .filter((t) => t.tramiteStatus !== 'cancelado')
          .map((t) => ({
            tramiteId: t.tramiteId,
            label: `${nombreTramite(t)} - Q${costoTramite(t).toFixed(2)}`,
          })),
      );
    });
  }

  registrarPago(): void {
    this.mensaje.set(null);
    this.error.set(null);

    if (!this.clienteSeleccionado || this.tramitesSeleccionados.length === 0 || this.pagoMonto <= 0) {
      this.error.set('Completa cliente, tramites y monto');
      return;
    }

    // Reparte el monto en partes iguales entre los tramites seleccionados
    // como punto de partida simple; se puede ajustar manualmente despues.
    const montoPorTramite = Number((this.pagoMonto / this.tramitesSeleccionados.length).toFixed(2));

    this.guardando.set(true);
    this.pagoService
      .registrar({
        clienteId: this.clienteSeleccionado,
        pagoMonto: this.pagoMonto,
        pagoMetodo: this.pagoMetodo,
        aplicaciones: this.tramitesSeleccionados.map((tramiteId) => ({
          tramiteId,
          montoAplicado: montoPorTramite,
        })),
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.mensaje.set('Pago registrado correctamente');
          this.onClienteChange();
        },
        error: () => {
          this.guardando.set(false);
          this.error.set('No se pudo registrar el pago, revisa los montos');
        },
      });
  }
}
