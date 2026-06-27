import type { LucideIcon } from 'lucide-react';
import { Ban, CalendarCheck, Clock3, FileCheck2, MailCheck, ShieldCheck, UsersRound } from 'lucide-react';

export type Role = 'ADMINISTRADOR' | 'MEDICO' | 'PACIENTE' | 'VISOR_INTERNO';
export type AppointmentStatus = 'Agendada' | 'Confirmada' | 'Reagendada' | 'Anulada' | 'Realizada' | 'No asistio';

export interface UserAccount {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: Role;
}

export interface Doctor {
  id: string;
  nombre: string;
  especialidad: string;
}

export interface Appointment {
  id: string;
  op: string;
  paciente: string;
  correo: string;
  telefono: string;
  gestion: 'Dacion' | 'Venta directa';
  empresa: string;
  ejecutivo: string;
  medicoId: string;
  fecha: string;
  hora: string;
  estado: AppointmentStatus;
  resultado: string;
  notas: string;
}

export const demoUsers: UserAccount[] = [
  { id: 'usr_admin', nombre: 'Administrador Phoenix', email: 'admin@phoenix.cl', password: 'Phoenix2026!', rol: 'ADMINISTRADOR' },
  { id: 'usr_medico', nombre: 'Dra. Valentina Rios', email: 'medico@phoenix.cl', password: 'Phoenix2026!', rol: 'MEDICO' },
  { id: 'usr_paciente', nombre: 'Paciente Demo', email: 'paciente@phoenix.cl', password: 'Phoenix2026!', rol: 'PACIENTE' },
];

export const doctors: Doctor[] = [
  { id: 'med_001', nombre: 'Dra. Valentina Rios', especialidad: 'Evaluacion Phoenix' },
  { id: 'med_002', nombre: 'Dr. Matias Herrera', especialidad: 'Revision documental' },
  { id: 'med_003', nombre: 'Dra. Camila Soto', especialidad: 'Gestion de visitas' },
];

export const workingDays = ['2026-06-29', '2026-06-30', '2026-07-01', '2026-07-02', '2026-07-03'];
export const workingHours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt_001',
    op: 'OP-24891',
    paciente: 'Marcela Rojas',
    correo: 'marcela.rojas@example.cl',
    telefono: '+56 9 1111 2222',
    gestion: 'Dacion',
    empresa: 'Partner Norte',
    ejecutivo: 'J. Fuentes',
    medicoId: 'med_001',
    fecha: '2026-06-29',
    hora: '10:00',
    estado: 'Confirmada',
    resultado: 'Pendiente visita',
    notas: 'Cliente confirma disponibilidad para visita presencial.',
  },
  {
    id: 'apt_002',
    op: 'OP-24902',
    paciente: 'Sergio Campos',
    correo: 'sergio.campos@example.cl',
    telefono: '+56 9 3333 4444',
    gestion: 'Venta directa',
    empresa: 'Gestiones Sur',
    ejecutivo: 'A. Morales',
    medicoId: 'med_002',
    fecha: '2026-06-30',
    hora: '09:00',
    estado: 'Agendada',
    resultado: 'Correo enviado',
    notas: 'Pendiente confirmacion del cliente.',
  },
  {
    id: 'apt_003',
    op: 'OP-24917',
    paciente: 'Paula Vera',
    correo: 'paula.vera@example.cl',
    telefono: '+56 9 5555 6666',
    gestion: 'Dacion',
    empresa: 'Phoenix',
    ejecutivo: 'Admin',
    medicoId: 'med_001',
    fecha: '2026-07-01',
    hora: '11:00',
    estado: 'Reagendada',
    resultado: 'Cliente solicita nuevo horario',
    notas: 'Contactar antes de reagendar nuevamente.',
  },
];

export const kpis = [
  { label: 'Horas activas', value: '38', trend: '+12 esta semana', icon: CalendarCheck },
  { label: 'Slots disponibles', value: '64', trend: '5 dias habiles', icon: Clock3 },
  { label: 'Clientes notificados', value: '31', trend: 'SMTP parametrizado', icon: MailCheck },
  { label: 'Reservas protegidas', value: '100%', trend: 'validacion transaccional', icon: ShieldCheck },
] satisfies Array<{ label: string; value: string; trend: string; icon: LucideIcon }>;

export const acceptanceItems = [
  { label: 'Login seguro por roles', icon: UsersRound },
  { label: 'Agenda medica visible', icon: CalendarCheck },
  { label: 'Anulacion y cambio de hora', icon: Ban },
  { label: 'Notificaciones por correo', icon: MailCheck },
  { label: 'Ficha de paciente y resultado', icon: FileCheck2 },
];