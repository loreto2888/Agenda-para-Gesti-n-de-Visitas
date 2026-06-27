# Despliegue GCP

## Servicios objetivo

- `agenda-phoenix-web`: frontend React servido como contenedor.
- `agenda-phoenix-api`: API Nest.js.
- Cloud SQL PostgreSQL para persistencia.
- Artifact Registry para imagenes Docker.
- Load Balancer para dominio publico.

## Variables requeridas

- `DATABASE_URL`
- `JWT_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `PUBLIC_WEB_URL`
- `PUBLIC_API_URL`

## Pipeline sugerido

1. Instalar dependencias con `npm ci`.
2. Ejecutar `npm run build`.
3. Construir imagenes Docker por aplicacion.
4. Publicar imagenes en Artifact Registry.
5. Desplegar servicios en Cloud Run.
6. Configurar variables y secretos por ambiente.
7. Validar login, agenda, reserva, bloqueo, reagendamiento y correo.

## Checklist salida piloto

- Usuarios y empresas iniciales cargadas.
- Horarios, duracion de slot y feriados definidos.
- SMTP validado desde GCP.
- Dominio temporal o Phoenix resuelto.
- Prueba de doble reserva completada.
- Administrador capacitado para seguimiento y cambios.