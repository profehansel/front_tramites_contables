import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { CatalogoService } from '../../core/services/catalogo.service';
import { CatalogoItem } from '../../core/models/catalogo.model';

@Component({
  selector: 'app-catalogo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    Textarea,
    TooltipModule,
  ],
  templateUrl: './catalogo-list.html',
  styleUrl: './catalogo-list.scss',
})
export class CatalogoList implements OnInit {
  items = signal<CatalogoItem[]>([]);
  dialogoAbierto = signal(false);
  guardando = signal(false);
  editandoId = signal<number | null>(null);

  itemEliminar = signal<CatalogoItem | null>(null);
  eliminando = signal(false);

  form: Partial<CatalogoItem> = {};

  constructor(private catalogoService: CatalogoService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.catalogoService.listar().subscribe((items) => this.items.set(items));
  }

  abrirNuevo(): void {
    this.editandoId.set(null);
    this.form = {};
    this.dialogoAbierto.set(true);
  }

  abrirEditar(item: CatalogoItem): void {
    this.editandoId.set(item.catalogoId);
    this.form = { ...item };
    this.dialogoAbierto.set(true);
  }

  guardar(): void {
    this.guardando.set(true);
    const id = this.editandoId();
    const peticion = id
      ? this.catalogoService.actualizar(id, this.form)
      : this.catalogoService.crear(this.form);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.dialogoAbierto.set(false);
        this.cargar();
      },
      error: () => this.guardando.set(false),
    });
  }

  pedirEliminar(item: CatalogoItem): void {
    this.itemEliminar.set(item);
  }

  confirmarEliminar(): void {
    const item = this.itemEliminar();
    if (!item) return;

    this.eliminando.set(true);
    this.catalogoService.eliminar(item.catalogoId).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.itemEliminar.set(null);
        this.cargar();
      },
      error: () => this.eliminando.set(false),
    });
  }
}
