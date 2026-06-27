import type { LucideIcon } from 'lucide-react';
import { Ban, CalendarCheck, Clock3, FileCheck2, MailCheck, ShieldCheck, UsersRound } from 'lucide-react';

export type SlotState = 'disponible' | 'ocupado' | 'bloqueado';
export type VisitStatus = 'Agendada' | 'Confirmada' | 'Reagendar' | 'Realizada' | 'No asistio';

export const kpis = [
  { label: 'Visitas agendadas', value: '38', trend: '+12 esta semana', icon: CalendarCheck },
  { label: 'Slots disponibles', value: '64', trend: '5 dias habiles', icon: Clock3 },
  { label: 'Clientes notificados', value: '31', trend: 'SMTP activo', icon: MailCheck },
  { label: 'Reservas protegidas', value: '100%', trend: 'validacion transaccional', icon: ShieldCheck },
] satisfies Array<{ label: string; value: string; trend: string; icon: LucideIcon }>;

export const agendaDays = [
  {
    date: 'Lun 29 Jun',
    slots: [
      { time: '09:00', state: 'disponible' },
      { time: '10:00', state: 'ocupado' },
      { time: '11:00', state: 'disponible' },
      { time: '12:00', state: 'bloqueado' },
      { time: '15:00', state: 'disponible' },
    ],
  },
  {
    date: 'Mar 30 Jun',
    slots: [
      { time: '09:00', state: 'ocupado' },
      { time: '10:00', state: 'disponible' },
      { time: '11:00', state: 'disponible' },
      { time: '12:00', state: 'bloqueado' },
      { time: '16:00', state: 'disponible' },
    ],
  },
  {
    date: 'Mie 01 Jul',
    slots: [
      { time: '09:00', state: 'disponible' },
      { time: '10:00', state: 'disponible' },
      { time: '11:00', state: 'ocupado' },
      { time: '14:00', state: 'disponible' },
      { time: '16:00', state: 'disponible' },
    ],
  },
  {
    date: 'Jue 02 Jul',
    slots: [
      { time: '09:00', state: 'ocupado' },
      { time: '10:00', state: 'ocupado' },
      { time: '11:00', state: 'disponible' },
      { time: '14:00', state: 'disponible' },
      { time: '16:00', state: 'bloqueado' },
    ],
  },
  {
    date: 'Vie 03 Jul',
    slots: [
      { time: '09:00', state: 'disponible' },
      { time: '10:00', state: 'disponible' },
      { time: '11:00', state: 'disponible' },
      { time: '14:00', state: 'ocupado' },
      { time: '16:00', state: 'disponible' },
    ],
  },
] satisfies Array<{ date: string; slots: Array<{ time: string; state: SlotState }> }>;

export const visits = [
  {
    op: 'OP-24891',
    cliente: 'Marcela Rojas',
    empresa: 'Partner Norte',
    ejecutivo: 'J. Fuentes',
    fecha: '29 Jun 10:00',
    gestion: 'Dacion',
    estado: 'Confirmada',
    resultado: 'Pendiente visita',
  },
  {
    op: 'OP-24902',
    cliente: 'Sergio Campos',
    empresa: 'Gestiones Sur',
    ejecutivo: 'A. Morales',
    fecha: '30 Jun 09:00',
    gestion: 'Venta directa',
    estado: 'Agendada',
    resultado: 'Correo enviado',
  },
  {
    op: 'OP-24917',
    cliente: 'Paula Vera',
    empresa: 'Phoenix',
    ejecutivo: 'Admin',
    fecha: '01 Jul 11:00',
    gestion: 'Dacion',
    estado: 'Reagendar',
    resultado: 'Cliente solicita nuevo horario',
  },
] satisfies Array<{
  op: string;
  cliente: string;
  empresa: string;
  ejecutivo: string;
  fecha: string;
  gestion: string;
  estado: VisitStatus;
  resultado: string;
}>;

export const acceptanceItems = [
  { label: 'Login por roles', icon: UsersRound },
  { label: 'Agenda 5 dias habiles', icon: CalendarCheck },
  { label: 'Bloqueos operacionales', icon: Ban },
  { label: 'Notificaciones por correo', icon: MailCheck },
  { label: 'Asistencia y resultado', icon: FileCheck2 },
];