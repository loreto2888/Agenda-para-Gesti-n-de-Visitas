# Matriz RF y criterios de aceptacion

Esta matriz revisa la implementacion contra la propuesta tecnica y comercial original de Phoenix.

## Estados

- **Listo demo**: disponible en la aplicacion web actual para prueba funcional.
- **Parcial**: existe base funcional, endpoint, simulacion o preparacion tecnica, pero requiere integracion productiva.
- **Pendiente produccion**: requiere backend persistente, SMTP real, GCP, datos definitivos o reglas operativas Phoenix.

## Requerimientos funcionales

| Codigo | Requerimiento del documento | Cobertura actual | Estado |
| --- | --- | --- | --- |
| RF-01 | Inicio de sesion para usuarios autorizados con roles Ejecutivo externo, Administrador y Equipo interno / visor. | La demo permite registro e inicio de sesion con correo y clave. Hay perfiles Paciente/Ejecutivo equivalente, Medico/operador equivalente, Administrador. Backend incluye autenticacion demo con hash y token firmado. | Listo demo / Parcial produccion |
| RF-02 | Visualizacion de agenda disponible para los proximos 5 dias habiles sin exponer informacion sensible de otras citas. | La agenda muestra 5 dias habiles, slots libres, ocupados y seleccionados. Los slots ocupados muestran informacion resumida para revision demo. | Listo demo |
| RF-03 | Registro de visita con OP, nombre del cliente, correo, telefono y tipo de gestion Dacion/Venta directa. El sistema no solicita RUT. | Formulario disponible con OP, paciente/cliente, correo, telefono, tipo de gestion, fecha, hora y profesional/agenda. No solicita RUT. | Listo demo |
| RF-04 | Prevencion de doble reserva con validacion frontend, backend y restriccion transaccional PostgreSQL. | Frontend impide tomar un slot ocupado. Backend tiene validacion de solapamiento en memoria. Modelo Prisma deja base para PostgreSQL, pero falta restriccion/migracion productiva. | Parcial |
| RF-05 | Notificacion de visita al cliente por correo. | La UI confirma la notificacion de forma simulada. Variables SMTP estan preparadas. Falta envio real SMTP y plantillas. | Parcial |
| RF-06 | Visualizacion de visita por Administrador con fecha, empresa, ejecutivo, OP, cliente, correo, telefono, tipo, estado y resultado. | Vista de seguimiento consolidado muestra OP, cliente/paciente, agenda/profesional, fecha, tipo, estado y resultado. Falta completar empresa/ejecutivo segun datos definitivos. | Listo demo / Parcial datos |
| RF-07 | Bloqueo de horarios por Administrador para colacion, mecanico, inspector, grua u otros motivos. | La demo permite anular/liberar horas y la API incluye bloqueos de calendario. Falta interfaz dedicada de motivos operacionales. | Parcial |
| RF-08 | Reagendamiento de visita con validacion de disponibilidad, auditoria y notificacion. | La demo permite seleccionar nuevo slot, confirmar Si/No y cambiar horario validando disponibilidad. Resultado queda actualizado. Falta auditoria persistente y correo real. | Listo demo / Parcial produccion |
| RF-09 | Confirmacion o rechazo del cliente mediante enlaces unicos. | API incluye endpoints publicos base con token. La UI tiene confirmaciones Si/No internas. Falta correo con enlaces reales y expiracion productiva. | Parcial |
| RF-10 | Registro de asistencia o no asistencia. | Medico/administrador puede marcar realizada o no asistencia con confirmacion Si/No. | Listo demo |
| RF-11 | Registro de resultado de la visita. | El resultado cambia segun accion: tomada, reagendada, anulada, realizada o no asistencia. Falta campo libre editable/catalogo parametrizable. | Parcial |
| RF-12 | Vista de seguimiento interno con filtros sugeridos por fecha, empresa, estado, tipo, ejecutivo y resultado. | Existe seguimiento consolidado y Mi pagina por rol. Falta interfaz completa de filtros avanzados. | Parcial |
| RF-13 | Gestion outbound por Administrador como funcionalidad adicional evaluable. | Backend tiene endpoint base `GET/POST /outbound`. UI no prioriza modulo outbound completo. | Parcial / Evaluable |

## Criterios de aceptacion

| N | Criterio del documento | Cobertura actual | Estado |
| --- | --- | --- | --- |
| 1 | Un ejecutivo externo puede iniciar sesion. | Se permite iniciar sesion con correo/clave y crear cuenta. En demo el perfil paciente/usuario externo cumple el flujo equivalente. | Listo demo |
| 2 | Un ejecutivo externo puede ver disponibilidad para 5 dias habiles. | Agenda de 5 dias habiles visible por usuario autenticado. | Listo demo |
| 3 | Un ejecutivo externo puede registrar una visita en un slot libre. | Usuario puede seleccionar slot libre y tomar hora. | Listo demo |
| 4 | El sistema exige OP, nombre, correo, telefono y tipo de gestion. | Formulario contiene esos campos. | Listo demo |
| 5 | El sistema no solicita RUT. | No existe campo RUT. | Listo demo |
| 6 | El sistema impide reservar un slot ocupado. | UI valida slot ocupado y muestra mensaje. | Listo demo |
| 7 | El cliente recibe correo de notificacion de cita. | Simulado en UI; SMTP preparado, no enviado realmente. | Parcial |
| 8 | El Administrador puede ver las visitas registradas. | Administrador puede ver seguimiento consolidado. | Listo demo |
| 9 | El Administrador puede bloquear horarios. | Puede anular/liberar horas; API tiene bloqueos. Falta UI especifica de bloqueo con motivo. | Parcial |
| 10 | Los horarios bloqueados no aparecen disponibles para ejecutivos externos. | Los horarios ocupados/anulados cambian disponibilidad. Bloqueos operacionales dedicados faltan en UI. | Parcial |
| 11 | El Administrador puede reagendar una visita. | Puede cambiar a fecha/hora seleccionada con confirmacion. | Listo demo |
| 12 | El cliente recibe notificacion de cambio. | Simulado en UI; falta SMTP real. | Parcial |
| 13 | El cliente puede confirmar o rechazar nueva fecha mediante enlace, si se implementa. | Endpoints publicos base existen; falta flujo completo por correo. | Parcial |
| 14 | El Administrador puede marcar asistencia o no asistencia. | Acciones disponibles con modal Si/No. | Listo demo |
| 15 | El Administrador puede registrar resultado. | Resultado se actualiza por accion; falta campo libre/catalogo. | Parcial |
| 16 | El equipo interno puede revisar una vista de seguimiento. | Vista seguimiento consolidado disponible. | Listo demo |
| 17 | La aplicacion esta publicada en GCP. | Preparada para Cloud Run y Docker; demo publica puede salir por GitHub Pages si Pages se habilita. GCP no desplegado. | Pendiente produccion |
| 18 | El frontend puede comunicarse correctamente con el backend. | Monorepo incluye frontend y API; frontend actual usa estado local para demo. Falta conexion real API en UI productiva. | Parcial |
| 19 | La base de datos PostgreSQL se encuentra operativa. | Modelo Prisma y docker-compose PostgreSQL preparados. Falta migracion/conexion productiva. | Parcial |
| 20 | El pipeline o mecanismo de despliegue queda documentado. | README, workflow CI, workflow Pages y guia GCP documentados. | Listo demo |
| 21 | El codigo fuente queda disponible en la organizacion GitHub definida. | Codigo disponible en `https://github.com/loreto2888/Agenda-para-Gesti-n-de-Visitas`. La propuesta menciona `phigital-cl`; migracion a esa organizacion queda pendiente si Phoenix lo exige. | Parcial |

## Resumen ejecutivo de cumplimiento

- **Listo para prueba demo**: login/registro, agenda 5 dias, toma de hora, no RUT, doble reserva en UI, vista admin, reagendamiento, asistencia/no asistencia, seguimiento y confirmaciones Si/No.
- **Parcial tecnico**: SMTP real, enlaces publicos por correo, bloqueo operacional con motivo, resultado libre/catalogo, filtros avanzados, conexion frontend-backend productiva, PostgreSQL transaccional.
- **Pendiente de despliegue productivo**: Cloud Run/GCP, Cloud SQL, dominio/DNS, secretos, cuenta SMTP real y organizacion GitHub final si debe ser `phigital-cl`.