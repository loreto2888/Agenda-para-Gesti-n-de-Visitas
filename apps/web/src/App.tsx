import { useMemo, useState } from 'react';
import { ArrowRight, Ban, Bell, CalendarClock, CheckCircle2, ClipboardList, Cloud, Container, Database, GitBranch, KeyRound, LockKeyhole, Mail, Network, RefreshCcw, Search, Server, Stethoscope, UserRound, UserRoundCheck } from 'lucide-react';
import { acceptanceItems, demoUsers, doctors, initialAppointments, kpis, workingDays, workingHours, type Appointment, type AppointmentStatus, type UserAccount } from './data';

const statusTone: Record<AppointmentStatus, string> = {
  Agendada: 'neutral',
  Confirmada: 'success',
  Reagendada: 'warning',
  Anulada: 'danger',
  Realizada: 'success',
  'No asistio': 'danger',
};

const initialForm = {
  op: 'OP-24931',
  paciente: 'Nombre paciente',
  correo: 'paciente@correo.cl',
  telefono: '+56 9 1234 5678',
  gestion: 'Dacion' as Appointment['gestion'],
  empresa: 'Partner Norte',
  medicoId: doctors[0].id,
  fecha: workingDays[0],
  hora: '09:00',
  notas: 'Primera visita coordinada con cliente.',
};

export function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loginEmail, setLoginEmail] = useState(demoUsers[0].email);
  const [loginPassword, setLoginPassword] = useState(demoUsers[0].password);
  const [loginError, setLoginError] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0].id);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(initialAppointments[0].id);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const visibleAppointments = useMemo(() => {
    if (currentUser?.rol === 'MEDICO') {
      const doctor = doctors.find((item) => item.nombre === currentUser.nombre);
      return appointments.filter((appointment) => appointment.medicoId === doctor?.id);
    }

    return appointments.filter((appointment) => appointment.medicoId === selectedDoctorId || currentUser?.rol === 'ADMINISTRADOR');
  }, [appointments, currentUser, selectedDoctorId]);

  const selectedAppointment = appointments.find((appointment) => appointment.id === selectedAppointmentId) ?? appointments[0];
  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) ?? doctors[0];
  const canBook = currentUser?.rol !== 'MEDICO';

  const activeAppointments = appointments.filter((appointment) => appointment.estado !== 'Anulada');
  const bookedSlots = new Set(activeAppointments.map((appointment) => `${appointment.medicoId}-${appointment.fecha}-${appointment.hora}`));

  function handleLogin() {
    const user = demoUsers.find((item) => item.email === loginEmail && item.password === loginPassword);
    if (!user) {
      setLoginError('Credenciales invalidas. Usa uno de los accesos demo o una cuenta cargada en backend.');
      return;
    }

    setCurrentUser(user);
    setLoginError('');
    setMessage(`Sesion iniciada como ${user.nombre}`);
  }

  function handleLogout() {
    setCurrentUser(null);
    setMessage('Sesion cerrada correctamente.');
  }

  function bookAppointment() {
    const slotKey = `${form.medicoId}-${form.fecha}-${form.hora}`;
    if (bookedSlots.has(slotKey)) {
      setMessage('Ese horario ya fue tomado. Selecciona otro slot disponible.');
      return;
    }

    const appointment: Appointment = {
      ...form,
      id: `apt_${Date.now()}`,
      ejecutivo: currentUser?.nombre ?? 'Usuario demo',
      estado: 'Agendada',
      resultado: 'Cita registrada y notificada',
    };

    setAppointments((items) => [appointment, ...items]);
    setSelectedAppointmentId(appointment.id);
    setMessage('Hora inscrita correctamente. Se genera notificacion al cliente.');
  }

  function cancelAppointment(id: string) {
    setAppointments((items) => items.map((appointment) => appointment.id === id ? { ...appointment, estado: 'Anulada', resultado: 'Anulada por usuario autorizado' } : appointment));
    setMessage('Hora anulada. El slot vuelve a quedar disponible para nuevas reservas.');
  }

  function rescheduleAppointment(id: string) {
    const slotKey = `${form.medicoId}-${form.fecha}-${form.hora}`;
    const isTaken = appointments.some((appointment) => appointment.id !== id && appointment.estado !== 'Anulada' && `${appointment.medicoId}-${appointment.fecha}-${appointment.hora}` === slotKey);
    if (isTaken) {
      setMessage('No se puede cambiar: el nuevo horario ya esta reservado.');
      return;
    }

    setAppointments((items) => items.map((appointment) => appointment.id === id ? { ...appointment, medicoId: form.medicoId, fecha: form.fecha, hora: form.hora, estado: 'Reagendada', resultado: 'Cambio de hora informado al cliente' } : appointment));
    setMessage('Hora cambiada correctamente. Se registra auditoria y notificacion.');
  }

  function markAttendance(id: string, status: 'Realizada' | 'No asistio') {
    setAppointments((items) => items.map((appointment) => appointment.id === id ? { ...appointment, estado: status, resultado: status === 'Realizada' ? 'Gestion realizada' : 'Cliente no asistio' } : appointment));
    setMessage('Estado de asistencia actualizado.');
  }

  if (!currentUser) {
    return (
      <main className="login-shell">
        <section className="login-panel">
          <div>
            <span className="eyebrow">Acceso seguro</span>
            <div className="temporary-logo">PX</div>
            <h1>Agenda Visitas Phoenix</h1>
            <p>Ingresa como paciente, medico o administrador. La API queda preparada para JWT firmado, expiracion y roles.</p>
          </div>

          <div className="demo-users">
            {demoUsers.map((user) => (
              <button type="button" key={user.id} onClick={() => { setLoginEmail(user.email); setLoginPassword(user.password); }}>
                <UserRoundCheck size={18} />
                <span>{user.nombre}</span>
                <small>{user.email}</small>
              </button>
            ))}
          </div>

          <form className="login-form" onSubmit={(event) => { event.preventDefault(); handleLogin(); }}>
            <label>Correo<input value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} /></label>
            <label>Clave<input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} /></label>
            {loginError && <p className="form-error">{loginError}</p>}
            <button type="submit"><KeyRound size={18} />Entrar</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Navegacion principal">
        <div className="brand">
          <div className="brand-mark">PX</div>
          <div>
            <strong>Agenda Visitas Phoenix</strong>
            <span>Clinica y visitas</span>
          </div>
        </div>

        <nav className="nav-list">
          <a className="active" href="#agenda"><CalendarClock size={18} />Agenda</a>
          <a href="#registro"><ClipboardList size={18} />Tomar hora</a>
          <a href="#paciente"><UserRound size={18} />Paciente</a>
          <a href="#seguimiento"><Search size={18} />Seguimiento</a>
          <a href="#arquitectura"><Cloud size={18} />Arquitectura</a>
          <a href="#seguridad"><LockKeyhole size={18} />Seguridad</a>
        </nav>

        <div className="release-card">
          <span>Sesion activa</span>
          <strong>{currentUser.rol}</strong>
          <p>{currentUser.nombre}</p>
          <button className="ghost-button" type="button" onClick={handleLogout}>Cerrar sesion</button>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Agenda Visitas Phoenix</span>
            <h1>Portal clinico para horas y visitas</h1>
          </div>
          <button className="primary-action" type="button" onClick={() => canBook ? bookAppointment() : selectedAppointment && cancelAppointment(selectedAppointment.id)}>
            {canBook ? 'Tomar hora' : 'Liberar horario'} <ArrowRight size={18} />
          </button>
        </header>

        {message && <div className="toast"><CheckCircle2 size={18} />{message}</div>}

        <section className="hero-panel">
          <div className="hero-copy">
            <span className="status-dot"><Stethoscope size={16} />Operacion funcional</span>
            <h2>Login, agenda por medico, ficha de paciente, inscripcion, anulacion y cambio de hora.</h2>
            <p>La pantalla opera con estado real en el navegador y el backend expone la base para seguridad JWT, roles y validacion de disponibilidad.</p>
          </div>
          <div className="hero-metrics" aria-label="Indicadores principales">
            {kpis.map((item) => (
              <article className="metric-card" key={item.label}>
                <item.icon size={22} />
                <span>{item.label}</span>
                <strong>{item.label === 'Horas activas' ? activeAppointments.length : item.value}</strong>
                <small>{item.trend}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-grid" id="agenda">
          <article className="panel agenda-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Agenda del medico</span>
                <h3>{selectedDoctor.nombre}</h3>
              </div>
              <select className="compact-select" value={selectedDoctorId} onChange={(event) => setSelectedDoctorId(event.target.value)} disabled={currentUser.rol === 'MEDICO'}>
                {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.nombre}</option>)}
              </select>
            </div>

            <div className="agenda-grid calendar-board">
              {workingDays.map((day) => (
                <div className="day-column" key={day}>
                  <strong>{day}</strong>
                  {workingHours.map((hour) => {
                    const appointment = appointments.find((item) => item.medicoId === selectedDoctorId && item.fecha === day && item.hora === hour && item.estado !== 'Anulada');
                    return (
                      <button className={`slot ${appointment ? 'ocupado' : 'disponible'}`} type="button" key={`${day}-${hour}`} onClick={() => {
                        setForm((value) => ({ ...value, medicoId: selectedDoctorId, fecha: day, hora: hour }));
                        if (appointment) setSelectedAppointmentId(appointment.id);
                      }}>
                        <span>{hour}</span>
                        <small>{appointment ? appointment.paciente : 'Libre'}</small>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </article>

          <article className="panel form-panel" id="registro">
            <div className="panel-heading compact">
              <div>
                <span className="eyebrow">Paciente</span>
                <h3>{canBook ? 'Tomar nueva hora' : 'Agenda del medico'}</h3>
              </div>
            </div>
            {canBook ? <form className="visit-form">
              <label>OP<input value={form.op} onChange={(event) => setForm({ ...form, op: event.target.value })} /></label>
              <label>Paciente<input value={form.paciente} onChange={(event) => setForm({ ...form, paciente: event.target.value })} /></label>
              <label>Correo<input value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} /></label>
              <label>Telefono<input value={form.telefono} onChange={(event) => setForm({ ...form, telefono: event.target.value })} /></label>
              <label>Medico<select value={form.medicoId} onChange={(event) => setForm({ ...form, medicoId: event.target.value })}>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.nombre}</option>)}</select></label>
              <label>Fecha<select value={form.fecha} onChange={(event) => setForm({ ...form, fecha: event.target.value })}>{workingDays.map((day) => <option key={day}>{day}</option>)}</select></label>
              <label>Hora<select value={form.hora} onChange={(event) => setForm({ ...form, hora: event.target.value })}>{workingHours.map((hour) => <option key={hour}>{hour}</option>)}</select></label>
              <label>Tipo de gestion<select value={form.gestion} onChange={(event) => setForm({ ...form, gestion: event.target.value as Appointment['gestion'] })}><option>Dacion</option><option>Venta directa</option></select></label>
              <button type="button" onClick={bookAppointment}>Tomar hora y notificar <Mail size={17} /></button>
            </form> : <div className="doctor-note"><Stethoscope size={26} /><strong>Modo medico</strong><p>Tu agenda es solo para revisar pacientes, anular atenciones y liberar horarios disponibles. Los pacientes deben iniciar sesion para tomar o cambiar horas.</p></div>}
          </article>
        </section>

        <section className="workspace-grid follow-up" id="paciente">
          <article className="panel patient-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Ficha paciente</span>
                <h3>{selectedAppointment?.paciente}</h3>
              </div>
              {selectedAppointment && <span className={`status ${statusTone[selectedAppointment.estado]}`}>{selectedAppointment.estado}</span>}
            </div>

            {selectedAppointment && (
              <div className="patient-grid">
                <div><span>OP</span><strong>{selectedAppointment.op}</strong></div>
                <div><span>Correo</span><strong>{selectedAppointment.correo}</strong></div>
                <div><span>Telefono</span><strong>{selectedAppointment.telefono}</strong></div>
                <div><span>Medico</span><strong>{doctors.find((doctor) => doctor.id === selectedAppointment.medicoId)?.nombre}</strong></div>
                <div><span>Fecha</span><strong>{selectedAppointment.fecha} {selectedAppointment.hora}</strong></div>
                <div><span>Resultado</span><strong>{selectedAppointment.resultado}</strong></div>
                <div className="wide"><span>Notas</span><strong>{selectedAppointment.notas}</strong></div>
              </div>
            )}
          </article>

          <article className="panel assurance-panel" id="seguridad">
            <span className="eyebrow">Acciones</span>
            <h3>{currentUser.rol === 'MEDICO' ? 'Ver, anular y liberar horarios' : 'Cambiar, anular y registrar asistencia'}</h3>
            <div className="action-stack">
              <button type="button" onClick={() => selectedAppointment && rescheduleAppointment(selectedAppointment.id)}><RefreshCcw size={17} />Cambiar a fecha/hora del formulario</button>
              <button type="button" onClick={() => selectedAppointment && cancelAppointment(selectedAppointment.id)}><Ban size={17} />Anular hora</button>
              <button type="button" onClick={() => selectedAppointment && markAttendance(selectedAppointment.id, 'Realizada')}><CheckCircle2 size={17} />Marcar realizada</button>
              <button type="button" onClick={() => selectedAppointment && markAttendance(selectedAppointment.id, 'No asistio')}><UserRoundCheck size={17} />Marcar no asistencia</button>
            </div>
            <div className="notification-preview">
              <Bell size={20} />
              <div>
                <strong>Seguridad de login</strong>
                <p>Backend preparado con hash de clave, token firmado y expiracion de sesion.</p>
              </div>
            </div>
          </article>
        </section>

        <section className="panel table-panel" id="seguimiento">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Administrador Phoenix</span>
              <h3>Seguimiento consolidado</h3>
            </div>
          </div>

          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>OP</th>
                  <th>Paciente</th>
                  <th>Medico</th>
                  <th>Fecha</th>
                  <th>Gestion</th>
                  <th>Estado</th>
                  <th>Resultado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleAppointments.map((appointment) => (
                  <tr key={appointment.id} onClick={() => setSelectedAppointmentId(appointment.id)}>
                    <td>{appointment.op}</td>
                    <td>{appointment.paciente}</td>
                    <td>{doctors.find((doctor) => doctor.id === appointment.medicoId)?.nombre}</td>
                    <td>{appointment.fecha} {appointment.hora}</td>
                    <td>{appointment.gestion}</td>
                    <td><span className={`status ${statusTone[appointment.estado]}`}>{appointment.estado}</span></td>
                    <td>{appointment.resultado}</td>
                    <td><button className="inline-button" type="button">Ver ficha</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel architecture-panel" id="arquitectura">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Arquitectura propuesta</span>
              <h3>Google Cloud Platform</h3>
            </div>
            <span className="pill success"><Cloud size={16} />Cloud Run + Cloud SQL</span>
          </div>

          <div className="architecture-canvas" aria-label="Diagrama de arquitectura GCP">
            <div className="arch-node users-node"><UserRound size={30} /><strong>Usuarios</strong></div>
            <div className="arch-line line-users-lb" />
            <div className="gcp-boundary">
              <span className="gcp-label">Google Cloud Platform</span>
              <div className="arch-node lb-node"><Network size={28} /><div><strong>Balanceador + DNS</strong><span>Cloud Load Balancing</span></div></div>
              <div className="arch-node web-node"><Server size={28} /><div><strong>Web / Frontend</strong><span>Cloud Run</span></div><small>React</small></div>
              <div className="arch-node api-node"><Server size={28} /><div><strong>API / Backend</strong><span>Cloud Run</span></div><small>Nest.js</small></div>
              <div className="arch-node db-node"><Database size={28} /><div><strong>BD</strong><span>Cloud SQL</span></div><small>PostgreSQL</small></div>
              <div className="arch-node registry-node"><GitBranch size={28} /><div><strong>Artifact Registry</strong><span>Imagenes Docker</span></div><small><Container size={16} />Docker</small></div>
              <div className="arch-line line-lb-web" />
              <div className="arch-line line-lb-api" />
              <div className="arch-line line-api-db" />
              <div className="arch-line line-web-registry" />
              <div className="arch-line line-api-registry" />
            </div>
          </div>
        </section>

        <section className="panel assurance-panel">
          <span className="eyebrow">Cumplimiento solicitado</span>
          <h3>Funciones cubiertas</h3>
          <div className="assurance-list horizontal">
            {acceptanceItems.map((item) => (
              <div className="assurance-item" key={item.label}>
                <item.icon size={18} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
