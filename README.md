# Frontend - Sistema de tramites (Angular 20 + PrimeNG 20)

## 1. Instalar e iniciar

```
npm install
npm start
```

Se abre en `http://localhost:4200`. Asegurate de que el backend
(NestJS) este corriendo en `http://localhost:3000/api` (o ajusta
`src/environments/environment.development.ts`).

## 2. Como esta armado

- **Standalone + signals**: no hay NgModules; cada pantalla es un
  componente standalone cargado por lazy loading en `app.routes.ts`.
- **Autenticacion**: `core/services/auth.service.ts` guarda el JWT y
  el usuario en `localStorage` y expone signals (`estaAutenticado`,
  `usuario`). `core/interceptors/auth.interceptor.ts` agrega el header
  `Authorization` a cada request y desloguea automaticamente si el
  backend responde 401. `core/guards/auth.guard.ts` protege las rutas
  privadas.
- **Tema PrimeNG propio**: en `app.config.ts` se define un preset
  (`definePreset(Aura, ...)`) con la paleta verde azulado de
  `styles.scss`, en vez de dejar el celeste por defecto de PrimeNG.
- **Servicios por dominio** en `core/services/`: uno por cada recurso
  del backend (clientes, catalogo, tramites, pagos, saldos, alertas),
  todos usando el mismo `environment.apiUrl`.

## 3. Flujo de negocio cubierto

- Alta de clientes, catalogo y tramites (con seleccion de servicios
  del catalogo al crear un tramite).
- Detalle de cliente: deuda pendiente, saldo a favor disponible,
  historial de tramites y de movimientos de saldo.
- Registrar abono (adelanto) de un cliente.
- Aplicar el saldo disponible del cliente a los tramites pendientes
  que elijas (llama a `POST /pagos/aplicar-saldo` del backend, que
  hace todo en una transaccion).
- Registrar un pago manual (efectivo/transferencia/tarjeta) repartido
  entre uno o varios tramites.
- Dashboard y pantalla de Alertas con los tramites en mora que genera
  el cron del backend.

## 4. Pendiente / siguientes pasos sugeridos

- Pantalla para subir el archivo del comprobante (hoy el backend crea
  el pago, pero el endpoint de subida de `comprobante_archivo` no
  esta implementado en el frontend todavia).
- Manejo de roles en el menu (ocultar "Usuarios" si no es admin, etc.)
  una vez agregues esa pantalla.
- Reemplazar el reparto "en partes iguales" del formulario de Pagos
  por edicion manual del monto por tramite si lo necesitas mas fino.
