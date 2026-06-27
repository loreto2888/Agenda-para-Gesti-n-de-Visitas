# Alcance funcional Phoenix

> La revision formal contra RF-01 a RF-13 y los 21 criterios de aceptacion esta en `docs/matriz-rf-criterios-aceptacion.md`.

## Resumen ejecutivo

Phoenix requiere una plataforma web para gestionar el agendamiento de visitas asociadas a gestiones de dacion y venta directa. En la version demo implementada, los usuarios pueden registrarse con sus datos, iniciar sesion, revisar agenda y operar las horas segun su perfil.

La plataforma permite visualizar disponibilidad para los proximos 5 dias habiles, registrar visitas con datos minimos, impedir reservas duplicadas, simular notificaciones al cliente, anular horas, cambiar horarios, registrar asistencia/no asistencia y documentar resultados.

## Perfiles

- Ejecutivo externo / usuario externo: registro con nombre, correo y clave; login; agenda disponible; seleccion de slot libre; toma de hora/visita; revision en Mi pagina; cambio o anulacion de hora.
- Operador interno / medico demo: registro con correo, clave y agenda asociada; login; revision de agenda; ficha de cliente; anulacion/liberacion de horarios; asistencia/no asistencia.
- Administrador: registro con correo y clave; vista total de horas/visitas; seguimiento consolidado; acciones sobre agenda, anulacion, cambio de horario y asistencia.
- Equipo interno Phoenix: seguimiento de visitas realizadas, no realizadas, medico, estado, resultado y agenda general.

## Requerimientos funcionales

| Codigo | Requerimiento | Estado en version demo |
| --- | --- | --- |
| RF-01 | Inicio de sesion | Listo. Login con correo y clave, registro por rol Paciente/Medico/Administrador y sesion local. Backend incluye token firmado demo. |
| RF-02 | Visualizacion de agenda disponible | Listo. Agenda por medico para 5 dias habiles, con horas libres, ocupadas y seleccionadas. |
| RF-03 | Registro de visita | Listo. Paciente puede tomar hora con OP, nombre, correo, telefono, medico, fecha, hora y tipo de gestion. No solicita RUT. |
| RF-04 | Prevencion de doble reserva | Listo en demo. La UI impide tomar un slot ocupado y libera el slot al anular. Backend incluye validacion de solapamiento en memoria. |
| RF-05 | Notificacion de visita al cliente | Parcial listo. El flujo muestra confirmacion/notificacion simulada. Variables SMTP quedan preparadas para produccion. |
| RF-06 | Visualizacion de visita por Administrador | Listo. Administrador ve seguimiento consolidado y horas registradas. |
| RF-07 | Bloqueo/anulacion de horarios | Listo en demo como anulacion/liberacion de hora por medico/admin. Bloqueos operacionales quedan modelados en API. |
| RF-08 | Reagendamiento de visita | Listo. Usuario puede seleccionar nuevo slot y confirmar cambio con modal Si/No. |
| RF-09 | Confirmacion o rechazo del cliente | Parcial listo. Existen endpoints publicos base; la UI incluye confirmaciones Si/No para acciones internas. Enlaces de correo reales quedan para SMTP/backend productivo. |
| RF-10 | Registro de asistencia | Listo. Medico/admin puede marcar realizada o no asistencia con confirmacion. |
| RF-11 | Registro de resultado | Listo en demo. El resultado se actualiza segun acciones: tomada, anulada, reagendada, realizada o no asistencia. |
| RF-12 | Vista de seguimiento interno | Listo. Seguimiento consolidado y Mi pagina filtran segun rol. |
| RF-13 | Gestion outbound por Administrador | Parcial listo. API tiene endpoint base de outbound; UI principal prioriza agenda clinica MVP. |

## Criterios de salida MVP

1. Registro e inicio de sesion por correo y clave.
2. Roles Paciente, Medico y Administrador.
3. Agenda de 5 dias habiles por medico.
4. Toma de hora con OP, nombre, correo, telefono y tipo de gestion.
5. Sin solicitud de RUT.
6. Prevencion de doble reserva en la experiencia demo.
7. Mi pagina para ver, cambiar y anular horas.
8. Vista medico para revisar pacientes, anular/liberar horarios y registrar asistencia.
9. Vista administrador y seguimiento interno basico.
10. Confirmacion Si/No antes de acciones criticas.
11. Base tecnica preparada para backend, PostgreSQL, SMTP y despliegue.

## Pendientes para produccion real

- Conectar persistencia real con Prisma Client y migraciones. La demo usa localStorage en frontend y memoria en API.
- Implementar guards por rol y sesiones productivas completas.
- Implementar servicio SMTP real con plantillas y enlaces confirmacion/rechazo enviados por correo.
- Agregar pruebas automatizadas de doble reserva.
- Definir dominio, usuarios, empresas, horarios, feriados, textos de correo y reglas finales con Phoenix.