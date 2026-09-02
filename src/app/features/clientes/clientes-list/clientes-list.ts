import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.scss',
})
export class ClientesList implements OnInit {
  clientes = signal<Cliente[]>([]);
  dialogoAbierto = signal(false);
  guardando = signal(false);
  editandoId = signal<number | null>(null);

  clienteEliminar = signal<Cliente | null>(null);
  eliminando = signal(false);

  form: Partial<Cliente> = {};

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.clienteService.listar().subscribe((clientes) => this.clientes.set(clientes));
  }

  abrirNuevo(): void {
    this.editandoId.set(null);
    this.form = {};
    this.dialogoAbierto.set(true);
  }

  abrirEditar(cliente: Cliente): void {
    this.editandoId.set(cliente.clienteId);
    this.form = { ...cliente };
    this.dialogoAbierto.set(true);
  }

  guardar(): void {
    this.guardando.set(true);
    const id = this.editandoId();
    const peticion = id
      ? this.clienteService.actualizar(id, this.form)
      : this.clienteService.crear(this.form);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.dialogoAbierto.set(false);
        this.cargar();
      },
      error: () => this.guardando.set(false),
    });
  }

  pedirEliminar(cliente: Cliente): void {
    this.clienteEliminar.set(cliente);
  }

  confirmarEliminar(): void {
    const cliente = this.clienteEliminar();
    if (!cliente) return;

    this.eliminando.set(true);
    this.clienteService.eliminar(cliente.clienteId).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.clienteEliminar.set(null);
        this.cargar();
      },
      error: () => this.eliminando.set(false),
    });
  }
}
