export interface CatalogoItem {
  catalogoId: number;
  catalogoNombre: string;
  catalogoDescripcion?: string;
  catalogoCosto: number;
  catalogoTipo?: string;
  catalogoEstado: 'activo' | 'inactivo';
}
