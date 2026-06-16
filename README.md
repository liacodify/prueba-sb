# Gestor de Solicitudes

Sistema web para gestionar solicitudes internas con tablero Kanban visual.

## Demo

- **App**: https://prueba-sb.vercel.app/
- **Figma**: https://www.figma.com/design/EKc8yfBmBXWM7ugA0aS5HM/gestion-de-solicitudes

<a href="https://www.figma.com/design/EKc8yfBmBXWM7ugA0aS5HM/gestion-de-solicitudes?node-id=0-1&t=N3IIqtet26S1x4v7-1"><img src="./public/img/figma.png" width="400"/></a>
<img src="./public/img/mimirr-gestor-de-solicitudes-2026-06-16T13-25-49.png" width="400"/>
<img src="./public/img/mimirr-gestor-de-solicitudes-2026-06-16T13-26-13.png" width="400"/>
<img src="./public/img/mimirr-gestor-de-solicitudes-2026-06-16T13-26-26.png" width="400"/>

## Stack

Next.js 16 + React 19 + TypeScript + Tailwind CSS + TanStack Query + shadcn/ui

## Setup

```bash
npm install
npm run dev
```

## Docker

### Rápido (recomendado)
```bash
docker-compose up --build -d
```

### Paso a paso
```bash
docker build -t gestor-solicitudes .
docker run -p 3000:3000 gestor-solicitudes
```

Disponible en http://localhost:3000

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |
| `npm run build` | Build producción |
| `npm start` | Producción |
| `npm run lint` | Lint con Biome |
| `npm run typecheck` | Tipos TypeScript |
| `npm test` | Tests unitarios |
| `npm run cypress` | Tests E2E (Cypress) |
| `npm run ci` | Lint + typecheck + test + build |

## API

Base: `/api/v1/solicitudes`

- `GET /solicitudes` - Lista con paginado
- `GET /solicitudes/:id` - Detalle
- `POST /solicitudes` - Crear
- `PUT /solicitudes/:id` - Actualizar
- `PATCH /solicitudes/:id` - Cambiar estado/prioridad
- `DELETE /solicitudes/:id` - Eliminar

## Estados

```
Pendiente → En Revisión → Aprobada → Cerrada
                   ↓
              Rechazada → En Revisión
```

## Estructura

```
src/
├── app/              # Next.js App Router
├── components/        # Componentes React
├── features/          # Lógica por dominio
├── hooks/             # Custom hooks
├── lib/               # Utilidades
├── services/          # Cliente API
└── types/             # Tipos TypeScript
```
