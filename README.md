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
- Web publica: https://loreto2888.github.io/Agenda-para-Gesti-n-de-Visitas/

## Usuarios demo

Todos usan la clave `Phoenix2026!`.

- Administrador: `admin@phoenix.cl`
- Medico: `medico@phoenix.cl`
- Paciente: `paciente@phoenix.cl`

Tambien se puede crear una cuenta desde la pantalla inicial con correo y clave, eligiendo perfil Paciente, Medico o Administrador. Las cuentas y horas creadas quedan guardadas localmente en el navegador para la demo.

## Flujo disponible en la demo

- Registro con datos propios para paciente, medico o administrador.
- Login con correo y clave.
- Agenda por medico para revisar horas libres y ocupadas.
- Toma de hora por paciente.
- Mi pagina para ver, cambiar horario y anular horas.
- Vista medico para revisar pacientes, anular/liberar horarios y marcar asistencia/no asistencia.
- Vista administrador con seguimiento consolidado.
- Confirmacion Si/No antes de acciones criticas.
- Bloqueo/desbloqueo de horarios con motivo operacional.
- Registro de resultado libre.
- Simulacion de confirmacion o rechazo del cliente.
- Gestion outbound basica del administrador.
- Seguimiento con filtros por texto, fecha, estado, tipo y medico.
- API con token publico para consultar, confirmar o rechazar visitas.

El detalle RF-01 a RF-13 esta documentado en `docs/alcance-funcional.md` y la matriz formal contra los 21 criterios de aceptacion esta en `docs/matriz-rf-criterios-aceptacion.md`.

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

- Experiencia web profesional para paciente, medico, administrador y seguimiento interno.
- Mock funcional de disponibilidad, visitas, bloqueos, KPIs y actividad reciente.
- API Nest con endpoints para autenticacion, disponibilidad, visitas, bloqueos, seguimiento y confirmacion/rechazo por token publico.
- Endpoints base para usuarios, empresas y gestion outbound separable del MVP.
- Modelo Prisma documentado para PostgreSQL y control de doble reserva.
- Guia de despliegue para Cloud Run y Artifact Registry.

Ver detalle funcional en `docs/alcance-funcional.md`.

La persistencia real queda preparada en el modelo de datos y puede conectarse como siguiente paso con Prisma o TypeORM segun preferencia de Phoenix.