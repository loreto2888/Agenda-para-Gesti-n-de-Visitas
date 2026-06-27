import { useMemo, useState } from 'react';
import { ArrowRight, Ban, Bell, CalendarClock, CheckCircle2, ClipboardList, Cloud, Container, Database, GitBranch, KeyRound, LockKeyhole, Mail, Network, RefreshCcw, Search, Server, Stethoscope, UserRound, UserRoundCheck } from 'lucide-react';
import { acceptanceItems, demoUsers, doctors, initialAppointments, kpis, workingDays, workingHours, type Appointment, type AppointmentStatus, type UserAccount } from './data';

type PendingAction = {
  title: string;
  detail: string;
  confirmLabel: string;
  run: () => void;
};

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
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    const storedUsers = window.localStorage.getItem('phoenix-users');
    return storedUsers ? JSON.parse(storedUsers) as UserAccount[] : [];
  });
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const storedUser = window.localStorage.getItem('phoenix-user');
    return storedUser ? JSON.parse(storedUser) as UserAccount : null;
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('paciente@correo.cl');
  const [loginPassword, setLoginPassword] = useState('Phoenix2026!');
  const [loginError, setLoginError] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<UserAccount['rol']>('PACIENTE');
  const [registerDoctorId, setRegisterDoctorId] = useState(doctors[0].id);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const storedAppointments = window.localStorage.getItem('phoenix-appointments');
    return storedAppointments ? JSON.parse(storedAppointments) as Appointment[] : initialAppointments;
  });
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

  const myAppointments = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.rol === 'ADMINISTRADOR') return appointments;
    if (currentUser.rol === 'MEDICO') {
      const doctor = doctors.find((item) => item.nombre === currentUser.nombre);
      return appointments.filter((appointment) => appointment.medicoId === doctor?.id);
    }

    return appointments.filter((appointment) => appointment.correo.toLowerCase() === currentUser.email.toLowerCase());
  }, [appointments, currentUser]);

  const selectedAppointment = appointments.find((appointment) => appointment.id === selectedAppointmentId) ?? appointments[0];
  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) ?? doctors[0];
  const canBook = currentUser?.rol !== 'MEDICO';
  const selectedSlotKey = `${form.medicoId}-${form.fecha}-${form.hora}`;

  const activeAppointments = appointments.filter((appointment) => appointment.estado !== 'Anulada');
  const bookedSlots = new Set(activeAppointments.map((appointment) => `${appointment.medicoId}-${appointment.fecha}-${appointment.hora}`));
  const authUsers = [...demoUsers, ...registeredUsers];

  function handleLogin() {
    const normalizedEmail = loginEmail.trim().toLowerCase();
    const user = authUsers.find((item) => item.email === normalizedEmail && item.password === loginPassword);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!user && (!isValidEmail || loginPassword.length < 6)) {
      setLoginError('Ingresa un correo valido y una clave de al menos 6 caracteres.');
      return;
    }

    const sessionUser: UserAccount = user ?? {
      id: `usr_${normalizedEmail}`,
      nombre: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password: loginPassword,
      rol: 'PACIENTE',
    };

    setCurrentUser(sessionUser);
    window.localStorage.setItem('phoenix-user', JSON.stringify(sessionUser));
    setForm((value) => ({
      ...value,
      correo: sessionUser.email,
      paciente: sessionUser.rol === 'PACIENTE' ? sessionUser.nombre : value.paciente,
    }));
    setLoginError('');
    setMessage(`Sesion iniciada como ${sessionUser.nombre}. Ya puedes tomar, revisar, cambiar o anular horas.`);
  }

  function registerAccount() {
    const normalizedEmail = registerEmail.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isValidEmail || registerPassword.length < 6) {
      setLoginError('Para registrar, ingresa un correo valido y una clave de al menos 6 caracteres.');
      return;
    }

    if (authUsers.some((user) => user.email === normalizedEmail)) {
      setLoginError('Ese correo ya tiene cuenta. Ingresa con tu clave.');
      setAuthMode('login');
      setLoginEmail(normalizedEmail);
      return;
    }

    const selectedDoctorForRegister = doctors.find((doctor) => doctor.id === registerDoctorId) ?? doctors[0];
    const user: UserAccount = {
      id: `usr_${Date.now()}`,
      nombre: registerRole === 'MEDICO' ? selectedDoctorForRegister.nombre : registerName.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password: registerPassword,
      rol: registerRole,
    };

    const nextUsers = [...registeredUsers, user];
    setRegisteredUsers(nextUsers);
    window.localStorage.setItem('phoenix-users', JSON.stringify(nextUsers));
    setCurrentUser(user);
    window.localStorage.setItem('phoenix-user', JSON.stringify(user));
    setForm((value) => ({
      ...value,
      correo: user.email,
      paciente: user.rol === 'PACIENTE' ? user.nombre : value.paciente,
      medicoId: user.rol === 'MEDICO' ? registerDoctorId : value.medicoId,
    }));
    setSelectedDoctorId(user.rol === 'MEDICO' ? registerDoctorId : selectedDoctorId);
    setLoginError('');
    setMessage(`Cuenta creada para ${user.nombre}. Ya puedes usar tu pagina.`);
  }

  function handleLogout() {
    setCurrentUser(null);
    window.localStorage.removeItem('phoenix-user');
    setMessage('Sesion cerrada correctamente.');
  }

  function persistAppointments(nextAppointments: Appointment[]) {
    setAppointments(nextAppointments);
    window.localStorage.setItem('phoenix-appointments', JSON.stringify(nextAppointments));
  }

  function bookAppointment() {
    if (!currentUser) return;
    const slotKey = `${form.medicoId}-${form.fecha}-${form.hora}`;
    if (bookedSlots.has(slotKey)) {
      setMessage('Ese horario ya fue tomado. Selecciona otro slot disponible.');
      return;
    }

    const appointment: Appointment = {
      ...form,
      correo: currentUser.rol === 'PACIENTE' ? currentUser.email : form.correo,
      paciente: currentUser.rol === 'PACIENTE' && form.paciente === 'Nombre paciente' ? currentUser.nombre : form.paciente,
      id: `apt_${Date.now()}`,
      ejecutivo: currentUser?.nombre ?? 'Usuario demo',
      estado: 'Agendada',
      resultado: 'Cita registrada y notificada',
    };

    persistAppointments([appointment, ...appointments]);
    setSelectedAppointmentId(appointment.id);
    setMessage('Hora tomada correctamente. La puedes ver en Mi pagina y cambiar o anular cuando lo necesites.');
  }

  function cancelAppointment(id: string) {
    persistAppointments(appointments.map((appointment) => appointment.id === id ? { ...appointment, estado: 'Anulada', resultado: 'Anulada por usuario autorizado' } : appointment));
    setMessage('Hora anulada. El slot vuelve a quedar disponible para nuevas reservas.');
  }

  function rescheduleAppointment(id: string) {
    const slotKey = `${form.medicoId}-${form.fecha}-${form.hora}`;
    const isTaken = appointments.some((appointment) => appointment.id !== id && appointment.estado !== 'Anulada' && `${appointment.medicoId}-${appointment.fecha}-${appointment.hora}` === slotKey);
    if (isTaken) {
      setMessage('No se puede cambiar: el nuevo horario ya esta reservado.');
      return;
    }

    persistAppointments(appointments.map((appointment) => appointment.id === id ? { ...appointment, medicoId: form.medicoId, fecha: form.fecha, hora: form.hora, estado: 'Reagendada', resultado: 'Cambio de hora informado al cliente' } : appointment));
    setMessage('Hora cambiada correctamente. Se registra auditoria y notificacion.');
  }

  function markAttendance(id: string, status: 'Realizada' | 'No asistio') {
    persistAppointments(appointments.map((appointment) => appointment.id === id ? { ...appointment, estado: status, resultado: status === 'Realizada' ? 'Gestion realizada' : 'Cliente no asistio' } : appointment));
    setMessage('Estado de asistencia actualizado.');
  }

  function askConfirmation(action: PendingAction) {
    setPendingAction(action);
  }

  function confirmPendingAction() {
    pendingAction?.run();
    setPendingAction(null);
  }

  function selectDoctor(doctorId: string) {
    setSelectedDoctorId(doctorId);
    setForm((value) => ({ ...value, medicoId: doctorId }));
    setMessage('Agenda actualizada para revisar las horas del medico seleccionado.');
  }

  function reviewSlot(day: string, hour: string, appointment?: Appointment) {
    setForm((value) => ({ ...value, medicoId: selectedDoctorId, fecha: day, hora: hour }));
    if (appointment) {
      setSelectedAppointmentId(appointment.id);
      setMessage(`Hora ocupada: ${appointment.paciente} el ${day} a las ${hour}. Revisa la ficha y acciones disponibles.`);
      return;
    }

    setMessage(`Horario libre seleccionado: ${day} a las ${hour}. Completa tus datos y presiona Tomar hora.`);
  }

  if (!currentUser) {
    return (
      <main className="login-shell">
        <section className="login-panel">
          <div>
            <span className="eyebrow">Acceso seguro</span>
            <div className="temporary-logo">PX</div>
            <h1>Agenda Visitas Phoenix</h1>
            <p>{authMode === 'login' ? 'Ingresa con tu correo y clave para gestionar tus horas.' : 'Crea tu cuenta como paciente, medico o administrador.'}</p>
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

          <div className="auth-switch" role="tablist" aria-label="Acceso o registro">
            <button className={authMode === 'login' ? 'active' : ''} type="button" onClick={() => { setAuthMode('login'); setLoginError(''); }}>Ingresar</button>
            <button className={authMode === 'register' ? 'active' : ''} type="button" onClick={() => { setAuthMode('register'); setLoginError(''); }}>Registrarme</button>
          </div>

          {authMode === 'login' ? <form className="login-form" onSubmit={(event) => { event.preventDefault(); handleLogin(); }}>
            <label>Correo<input type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} /></label>
            <label>Clave<input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} /></label>
            {loginError && <p className="form-error">{loginError}</p>}
            <button type="submit"><KeyRound size={18} />Entrar</button>
          </form> : <form className="login-form" onSubmit={(event) => { event.preventDefault(); registerAccount(); }}>
            <label>Tipo de cuenta<select value={registerRole} onChange={(event) => setRegisterRole(event.target.value as UserAccount['rol'])}><option value="PACIENTE">Paciente</option><option value="MEDICO">Medico</option><option value="ADMINISTRADOR">Administrador</option></select></label>
            {registerRole === 'MEDICO' ? <label>Agenda medica<select value={registerDoctorId} onChange={(event) => setRegisterDoctorId(event.target.value)}>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.nombre}</option>)}</select></label> : <label>Nombre<input value={registerName} onChange={(event) => setRegisterName(event.target.value)} placeholder="Nombre completo" /></label>}
            <label>Correo<input type="email" value={registerEmail} onChange={(event) => setRegisterEmail(event.target.value)} placeholder="tu.correo@dominio.cl" /></label>
            <label>Clave<input type="password" value={registerPassword} onChange={(event) => setRegisterPassword(event.target.value)} placeholder="Minimo 6 caracteres" /></label>
            {loginError && <p className="form-error">{loginError}</p>}
            <button type="submit"><UserRoundCheck size={18} />Crear cuenta y entrar</button>
          </form>}
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
          <a href="#mi-pagina"><UserRoundCheck size={18} />Mi pagina</a>
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
        {pendingAction && (
          <div className="confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className="confirm-dialog">
              <span className="eyebrow">Confirmacion requerida</span>
              <h3 id="confirm-title">{pendingAction.title}</h3>
              <p>{pendingAction.detail}</p>
              <div className="confirm-actions">
                <button className="secondary-confirm" type="button" onClick={() => setPendingAction(null)}>No, volver</button>
                <button className="primary-confirm" type="button" onClick={confirmPendingAction}>{pendingAction.confirmLabel}</button>
              </div>
            </div>
          </div>
        )}

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

        <section className="panel table-panel" id="mi-pagina">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Mi pagina</span>
              <h3>{currentUser.rol === 'PACIENTE' ? 'Mis horas tomadas' : 'Horas bajo mi gestion'}</h3>
            </div>
            <span className="pill success"><CheckCircle2 size={16} />{myAppointments.length} registros</span>
          </div>

          {myAppointments.length === 0 ? (
            <div className="empty-state">
              <CalendarClock size={28} />
              <strong>No tienes horas tomadas</strong>
              <p>Selecciona un horario libre en la agenda, completa tus datos y presiona Tomar hora.</p>
            </div>
          ) : (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Medico</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {myAppointments.map((appointment) => (
                    <tr key={appointment.id} onClick={() => setSelectedAppointmentId(appointment.id)}>
                      <td>{appointment.paciente}</td>
                      <td>{doctors.find((doctor) => doctor.id === appointment.medicoId)?.nombre}</td>
                      <td>{appointment.fecha} {appointment.hora}</td>
                      <td><span className={`status ${statusTone[appointment.estado]}`}>{appointment.estado}</span></td>
                      <td>
                        <div className="row-actions">
                          <button className="inline-button" type="button" onClick={(event) => { event.stopPropagation(); setSelectedAppointmentId(appointment.id); }}>Ver</button>
                          <button className="inline-button" type="button" onClick={(event) => { event.stopPropagation(); askConfirmation({ title: 'Cambiar esta hora', detail: `Se cambiara la hora de ${appointment.paciente} a ${form.fecha} ${form.hora}.`, confirmLabel: 'Si, cambiar', run: () => rescheduleAppointment(appointment.id) }); }}>Cambiar</button>
                          <button className="inline-button danger" type="button" onClick={(event) => { event.stopPropagation(); askConfirmation({ title: 'Anular esta hora', detail: `Se anulara la hora de ${appointment.paciente} y el horario quedara disponible.`, confirmLabel: 'Si, anular', run: () => cancelAppointment(appointment.id) }); }}>Anular</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="workspace-grid" id="agenda">
          <article className="panel agenda-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Agenda del medico</span>
                <h3>{selectedDoctor.nombre}</h3>
              </div>
              <select className="compact-select" value={selectedDoctorId} onChange={(event) => selectDoctor(event.target.value)} disabled={currentUser.rol === 'MEDICO'}>
                {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.nombre}</option>)}
              </select>
            </div>

            <div className="slot-legend">
              <span><i className="legend-free" />Libre para tomar hora</span>
              <span><i className="legend-busy" />Ocupada, tocar para revisar ficha</span>
              <span><i className="legend-selected" />Seleccionada</span>
            </div>

            <div className="agenda-grid calendar-board">
              {workingDays.map((day) => (
                <div className="day-column" key={day}>
                  <strong>{day}</strong>
                  {workingHours.map((hour) => {
                    const appointment = appointments.find((item) => item.medicoId === selectedDoctorId && item.fecha === day && item.hora === hour && item.estado !== 'Anulada');
                    const isSelected = selectedSlotKey === `${selectedDoctorId}-${day}-${hour}`;
                    return (
                      <button className={`slot ${appointment ? 'ocupado' : 'disponible'} ${isSelected ? 'selected' : ''}`} type="button" key={`${day}-${hour}`} onClick={() => reviewSlot(day, hour, appointment)}>
                        <span>{hour}</span>
                        <small>{appointment ? `Ver ${appointment.paciente}` : 'Libre'}</small>
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
            <div className="selected-slot-card">
              <span>Hora seleccionada</span>
              <strong>{doctors.find((doctor) => doctor.id === form.medicoId)?.nombre}</strong>
              <p>{form.fecha} a las {form.hora}</p>
            </div>
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
              <button type="button" onClick={() => selectedAppointment && askConfirmation({ title: 'Cambiar horario', detail: `Se cambiara la hora de ${selectedAppointment.paciente} a ${form.fecha} ${form.hora}.`, confirmLabel: 'Si, cambiar', run: () => rescheduleAppointment(selectedAppointment.id) })}><RefreshCcw size={17} />Cambiar a fecha/hora del formulario</button>
              <button type="button" onClick={() => selectedAppointment && askConfirmation({ title: 'Anular hora', detail: `Se anulara la hora de ${selectedAppointment.paciente}. El horario quedara libre.`, confirmLabel: 'Si, anular', run: () => cancelAppointment(selectedAppointment.id) })}><Ban size={17} />Anular hora</button>
              <button type="button" onClick={() => selectedAppointment && askConfirmation({ title: 'Marcar realizada', detail: `Se marcara como realizada la atencion de ${selectedAppointment.paciente}.`, confirmLabel: 'Si, marcar realizada', run: () => markAttendance(selectedAppointment.id, 'Realizada') })}><CheckCircle2 size={17} />Marcar realizada</button>
              <button type="button" onClick={() => selectedAppointment && askConfirmation({ title: 'Marcar no asistencia', detail: `Se marcara no asistencia para ${selectedAppointment.paciente}.`, confirmLabel: 'Si, marcar no asistencia', run: () => markAttendance(selectedAppointment.id, 'No asistio') })}><UserRoundCheck size={17} />Marcar no asistencia</button>
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
