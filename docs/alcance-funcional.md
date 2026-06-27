# Alcance funcional Phoenix

## Resumen ejecutivo

Phoenix requiere una plataforma web para gestionar el agendamiento de visitas asociadas a gestiones de dacion y venta directa. Ejecutivos externos de empresas asociadas podran registrar citas en una agenda controlada, visible y administrada por usuarios internos Phoenix.

La plataforma permite visualizar disponibilidad para los proximos 5 dias habiles, registrar visitas con datos minimos, impedir reservas duplicadas, notificar por correo al cliente, bloquear horarios, reagendar, registrar asistencia y documentar resultados.

## Perfiles

- Ejecutivo externo: login, agenda disponible, seleccion de slot libre, registro de visita y visualizacion restringida.
- Administrador: vista total de visitas, bloqueos, reagendamiento, asistencia, resultados y agenda consolidada.
- Equipo interno Phoenix: seguimiento de visitas realizadas, no realizadas, empresa origen, resultado y estado general.

## Requerimientos funcionales

| Codigo | Requerimiento | Estado base |
| --- | --- | --- |
| RF-01 | Inicio de sesion con roles | Endpoint demo y modelo preparado |
| RF-02 | Agenda disponible 5 dias habiles | Implementado en UI y API mock |
| RF-03 | Registro de visita sin RUT | Implementado en UI y API |
| RF-04 | Prevencion de doble reserva | Validacion backend y modelo PostgreSQL preparado |
| RF-05 | Notificacion al cliente | Variables SMTP y flujo documentado |
| RF-06 | Vista administrador | Implementado en UI y API |
| RF-07 | Bloqueo de horarios | Implementado en UI y API |
| RF-08 | Reagendamiento | Implementado en API y accion UI |
| RF-09 | Confirmacion o rechazo cliente | Endpoints publicos tokenizados base |
| RF-10 | Registro de asistencia | Implementado en API |
| RF-11 | Registro de resultado | Implementado en API |
| RF-12 | Vista seguimiento interno | Implementado en UI y API |
| RF-13 | Gestion outbound administrador | Endpoint base separable del MVP |

## Criterios de salida MVP

1. Login de ejecutivo externo.
2. Agenda de 5 dias habiles.
3. Registro de visita con OP, nombre, correo, telefono y tipo de gestion.
4. Sin solicitud de RUT.
5. Prevencion de doble reserva.
6. Correo de cita y reagendamiento.
7. Vista administrador, bloqueo, reagendamiento, asistencia y resultado.
8. Seguimiento interno basico.
9. Publicacion en GCP con frontend, backend, PostgreSQL y pipeline documentado.

## Pendientes para produccion real

- Conectar persistencia real con Prisma Client y migraciones.
- Implementar JWT firmado y guards por rol.
- Implementar servicio SMTP real con plantillas.
- Agregar pruebas automatizadas de doble reserva.
- Definir dominio, usuarios, empresas, horarios, feriados y textos de correo con Phoenix.