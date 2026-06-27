# Plataforma de Agenda para Gestion de Visitas Phoenix

Implementacion base profesional para el piloto Phoenix: agenda de visitas, control de disponibilidad, registro de citas, seguimiento administrativo y API backend preparada para despliegue en GCP.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Nest.js + TypeScript
- Base de datos objetivo: PostgreSQL
- Infraestructura objetivo: Cloud Run, Artifact Registry, Cloud SQL y Load Balancer

## Accesos

- Local frontend: http://localhost:5173/
- Local API: http://localhost:3000/api
- Documentacion API local: http://localhost:3000/api/docs
- Repositorio web: https://github.com/loreto2888/Agenda-para-Gesti-n-de-Visitas

## Estructura

```text
apps/
  web/    Aplicacion web UX/UI
  api/    API Nest.js
docs/     Documentacion tecnica y despliegue
```

## Inicio rapido

```bash
npm install
npm run dev:web
npm run dev:api
```

La web queda disponible en `http://localhost:5173/` y la API en `http://localhost:3000/api`.

## Scripts

- `npm run dev:web`: levanta el frontend.
- `npm run dev:api`: levanta la API Nest.
- `npm run build`: compila frontend y backend.
- `npm run typecheck`: valida TypeScript.

## Variables

Copiar `.env.example` a `.env` y completar credenciales reales para base de datos, JWT y SMTP.

## Alcance implementado

- Experiencia web profesional para ejecutivo, administrador y seguimiento interno.
- Mock funcional de disponibilidad, visitas, bloqueos, KPIs y actividad reciente.
- API Nest con endpoints base para autenticacion, disponibilidad, visitas, bloqueos y seguimiento.
- Endpoints base para usuarios, empresas y gestion outbound separable del MVP.
- Modelo Prisma documentado para PostgreSQL y control de doble reserva.
- Guia de despliegue para Cloud Run y Artifact Registry.

Ver detalle funcional en `docs/alcance-funcional.md`.

La persistencia real queda preparada en el modelo de datos y puede conectarse como siguiente paso con Prisma o TypeORM segun preferencia de Phoenix.