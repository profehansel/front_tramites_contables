import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { Textarea } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

import { TramiteService } from '../../core/services/tramite.service';
import { ClienteService } from '../../core/services/cliente.service';
import { CatalogoService } from '../../core/services/catalogo.service';
import { AuthService } from '../../core/services/auth.service';
import { nombreTramite, costoTramite } from '../../core/utils/tramite-display';

import { Tramite } from '../../core/models/tramite.model';
import { Cliente } from '../../core/models/cliente.model';
import { CatalogoItem } from '../../core/models/catalogo.model';

// Extiende Tramite con un campo de texto ya armado (nombre + cliente)
// para que el filtro global de la tabla pueda buscar sobre el, ya que
// "nombreTramite()" es un valor derivado y PrimeNG solo filtra
// propiedades reales del objeto.
type TramiteConBusqueda = Tramite & { _busqueda: string };

@Component({
  selector: 'app-tramites-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    Select,
    MultiSelectModule,
    TooltipModule,
    Textarea,
    InputTextModule,
  ],
  templateUrl: './tramites-list.html',
  styleUrl: './tramites-list.scss',
})
export class TramitesList implements OnInit {
  private tramiteService = inject(TramiteService);
  private clienteService = inject(ClienteService);
  private catalogoService = inject(CatalogoService);
  private authService = inject(AuthService);

  nombreTramite = nombreTramite;
  costoTramite = costoTramite;

  tramites = signal<TramiteConBusqueda[]>([]);
  clientes = signal<Cliente[]>([]);
  catalogoItems = signal<CatalogoItem[]>([]);

  // --- Crear / editar ---
  dialogoAbierto = signal(false);
  guardando = signal(false);
  editandoId = signal<number | null>(null);

  clienteSeleccionado: number | null = null;
  itemsSeleccionados: number[] = [];

  // --- Ver detalle ---
  tramiteDetalle = signal<Tramite | null>(null);

  // --- Cancelar (con observacion) ---
  tramiteCancelar = signal<Tramite | null>(null);
  observacionCancelar = '';
  cancelando = signal(false);

  // --- Eliminar ---
  tramiteEliminar = signal<Tramite | null>(null);
  eliminando = signal(false);

  finalizandoId = signal<number | null>(null);

  ngOnInit(): void {
    this.cargar();
    this.clienteService.listar().subscribe((c) => this.clientes.set(c));
    this.catalogoService.listar().subscribe((c) => this.catalogoItems.set(c));
  }

  cargar(): void {
    this.tramiteService.listar().subscribe((tramites) => {
      this.tramites.set(
        tramites.map((t) => ({ ...t, _busqueda: `${nombreTramite(t)} ${t.cliente.clienteNombre}` })),
      );
    });
  }

  // --- Crear ---
  abrirNuevo(): void {
    this.editandoId.set(null);
    this.clienteSeleccionado = null;
    this.itemsSeleccionados = [];
    this.dialogoAbierto.set(true);
  }

  // --- Editar (solo tramites en_proceso) ---
  abrirEditar(tramite: Tramite): void {
    this.editandoId.set(tramite.tramiteId);
    this.clienteSeleccionado = tramite.cliente.clienteId;
    this.itemsSeleccionados = tramite.detalles.map((d) => d.catalogo.catalogoId);
    this.dialogoAbierto.set(true);
  }

  guardar(): void {
    const usuarioId = this.authService.usuario()?.usuarioId;
    if (!this.clienteSeleccionado || !usuarioId || this.itemsSeleccionados.length === 0) return;

    const detalles = this.itemsSeleccionados.map((catalogoId) => ({ catalogoId }));
    const id = this.editandoId();

    this.guardando.set(true);
    const peticion = id
      ? this.tramiteService.actualizar(id, { detalles })
      : this.tramiteService.crear({ clienteId: this.clienteSeleccionado, usuarioId, detalles });

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.dialogoAbierto.set(false);
        this.cargar();
      },
      error: () => this.guardando.set(false),
    });
  }

  // --- Ver detalle ---
  verDetalle(tramite: Tramite): void {
    this.tramiteDetalle.set(tramite);
  }

  // --- Finalizar ---
  finalizar(tramiteId: number): void {
    this.finalizandoId.set(tramiteId);
    this.tramiteService.finalizar(tramiteId).subscribe({
      next: () => {
        this.finalizandoId.set(null);
        this.cargar();
      },
      error: () => this.finalizandoId.set(null),
    });
  }

  // --- Cancelar (pide observacion) ---
  pedirCancelar(tramite: Tramite): void {
    this.observacionCancelar = '';
    this.tramiteCancelar.set(tramite);
  }

  confirmarCancelar(): void {
    const tramite = this.tramiteCancelar();
    if (!tramite || this.observacionCancelar.trim().length < 3) return;

    this.cancelando.set(true);
    this.tramiteService.cancelar(tramite.tramiteId, this.observacionCancelar.trim()).subscribe({
      next: () => {
        this.cancelando.set(false);
        this.tramiteCancelar.set(null);
        this.cargar();
      },
      error: () => this.cancelando.set(false),
    });
  }

  // --- Eliminar (solo en_proceso) ---
  pedirEliminar(tramite: Tramite): void {
    this.tramiteEliminar.set(tramite);
  }

  confirmarEliminar(): void {
    const tramite = this.tramiteEliminar();
    if (!tramite) return;

    this.eliminando.set(true);
    this.tramiteService.eliminar(tramite.tramiteId).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.tramiteEliminar.set(null);
        this.cargar();
      },
      error: () => this.eliminando.set(false),
    });
  }
}
