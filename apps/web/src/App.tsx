import { ArrowRight, Ban, Bell, CalendarClock, CheckCircle2, CircleDot, ClipboardList, Cloud, Container, Database, GitBranch, LockKeyhole, Mail, Network, RefreshCcw, Search, Server, UserRound, UserRoundCheck } from 'lucide-react';
import { acceptanceItems, agendaDays, kpis, visits, type SlotState, type VisitStatus } from './data';

const stateLabel: Record<SlotState, string> = {
  disponible: 'Libre',
  ocupado: 'Ocupado',
  bloqueado: 'Bloqueado',
};

const statusTone: Record<VisitStatus, string> = {
  Agendada: 'neutral',
  Confirmada: 'success',
  Reagendar: 'warning',
  Realizada: 'success',
  'No asistio': 'danger',
};

export function App() {
  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Navegacion principal">
        <div className="brand">
          <div className="brand-mark">CW</div>
          <div>
            <strong>Coworlabs</strong>
            <span>Agenda Phoenix</span>
          </div>
        </div>

        <nav className="nav-list">
          <a className="active" href="#agenda"><CalendarClock size={18} />Agenda</a>
          <a href="#registro"><ClipboardList size={18} />Registro</a>
          <a href="#seguimiento"><Search size={18} />Seguimiento</a>
          <a href="#arquitectura"><Cloud size={18} />Arquitectura</a>
          <a href="#seguridad"><LockKeyhole size={18} />Seguridad</a>
        </nav>

        <div className="release-card">
          <span>Salida objetivo</span>
          <strong>02 Jul 2026</strong>
          <p>MVP operativo para capacitacion masiva al dia siguiente.</p>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Piloto Phoenix</span>
            <h1>Plataforma de agenda para gestion de visitas</h1>
          </div>
          <button className="primary-action" type="button">
            Nueva visita <ArrowRight size={18} />
          </button>
        </header>

        <section className="hero-panel">
          <div className="hero-copy">
            <span className="status-dot"><CircleDot size={16} />Operacion controlada</span>
            <h2>Agenda visible, reservas sin duplicidad y seguimiento interno en una sola experiencia.</h2>
            <p>
              Disenada para ejecutivos externos, administradores Phoenix y equipos de seguimiento, con foco en rapidez operativa,
              trazabilidad y despliegue cloud.
            </p>
          </div>
          <div className="hero-metrics" aria-label="Indicadores principales">
            {kpis.map((item) => (
              <article className="metric-card" key={item.label}>
                <item.icon size={22} />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.trend}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-grid" id="agenda">
          <article className="panel agenda-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Ejecutivo externo</span>
                <h3>Disponibilidad proximos 5 dias habiles</h3>
              </div>
              <span className="pill success"><CheckCircle2 size={16} />Actualizado</span>
            </div>

            <div className="agenda-grid">
              {agendaDays.map((day) => (
                <div className="day-column" key={day.date}>
                  <strong>{day.date}</strong>
                  {day.slots.map((slot) => (
                    <button className={`slot ${slot.state}`} type="button" key={`${day.date}-${slot.time}`} disabled={slot.state !== 'disponible'}>
                      <span>{slot.time}</span>
                      <small>{stateLabel[slot.state]}</small>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </article>

          <article className="panel form-panel" id="registro">
            <div className="panel-heading compact">
              <div>
                <span className="eyebrow">Registro rapido</span>
                <h3>Nueva visita</h3>
              </div>
            </div>
            <form className="visit-form">
              <label>OP<input defaultValue="OP-24931" /></label>
              <label>Cliente<input defaultValue="Nombre cliente" /></label>
              <label>Correo<input defaultValue="cliente@correo.cl" /></label>
              <label>Telefono<input defaultValue="+56 9 1234 5678" /></label>
              <label>Tipo de gestion<select defaultValue="Dacion"><option>Dacion</option><option>Venta directa</option></select></label>
              <button type="button">Registrar y notificar <Mail size={17} /></button>
            </form>
          </article>
        </section>

        <section className="workspace-grid follow-up" id="seguimiento">
          <article className="panel table-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Administrador Phoenix</span>
                <h3>Seguimiento consolidado</h3>
              </div>
              <div className="toolbar">
                <button type="button"><Ban size={16} />Bloquear</button>
                <button type="button"><RefreshCcw size={16} />Reagendar</button>
              </div>
            </div>

            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>OP</th>
                    <th>Cliente</th>
                    <th>Empresa</th>
                    <th>Fecha</th>
                    <th>Gestion</th>
                    <th>Estado</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((visit) => (
                    <tr key={visit.op}>
                      <td>{visit.op}</td>
                      <td>{visit.cliente}</td>
                      <td>{visit.empresa}</td>
                      <td>{visit.fecha}</td>
                      <td>{visit.gestion}</td>
                      <td><span className={`status ${statusTone[visit.estado]}`}>{visit.estado}</span></td>
                      <td>{visit.resultado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel assurance-panel" id="seguridad">
            <span className="eyebrow">Criterios MVP</span>
            <h3>Controles listos para salida piloto</h3>
            <div className="assurance-list">
              {acceptanceItems.map((item) => (
                <div className="assurance-item" key={item.label}>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="notification-preview">
              <Bell size={20} />
              <div>
                <strong>Correo al cliente</strong>
                <p>Incluye fecha, hora, confirmacion y rechazo con token seguro.</p>
              </div>
            </div>
            <div className="notification-preview muted">
              <UserRoundCheck size={20} />
              <div>
                <strong>Roles separados</strong>
                <p>Ejecutivo, administrador y visor interno con permisos diferenciados.</p>
              </div>
            </div>
          </article>
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
            <div className="arch-node users-node">
              <UserRound size={30} />
              <strong>Usuarios</strong>
            </div>
            <div className="arch-line line-users-lb" />

            <div className="gcp-boundary">
              <span className="gcp-label">Google Cloud Platform</span>

              <div className="arch-node lb-node">
                <Network size={28} />
                <div>
                  <strong>Balanceador + DNS</strong>
                  <span>Cloud Load Balancing</span>
                </div>
              </div>

              <div className="arch-node web-node">
                <Server size={28} />
                <div>
                  <strong>Web / Frontend</strong>
                  <span>Cloud Run</span>
                </div>
                <small>React</small>
              </div>

              <div className="arch-node api-node">
                <Server size={28} />
                <div>
                  <strong>API / Backend</strong>
                  <span>Cloud Run</span>
                </div>
                <small>Nest.js</small>
              </div>

              <div className="arch-node db-node">
                <Database size={28} />
                <div>
                  <strong>BD</strong>
                  <span>Cloud SQL</span>
                </div>
                <small>PostgreSQL</small>
              </div>

              <div className="arch-node registry-node">
                <GitBranch size={28} />
                <div>
                  <strong>Artifact Registry</strong>
                  <span>Imagenes Docker</span>
                </div>
                <small><Container size={16} />Docker</small>
              </div>

              <div className="arch-line line-lb-web" />
              <div className="arch-line line-lb-api" />
              <div className="arch-line line-api-db" />
              <div className="arch-line line-web-registry" />
              <div className="arch-line line-api-registry" />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}