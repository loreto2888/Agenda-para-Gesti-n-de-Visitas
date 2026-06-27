import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

type VisitStatus = 'AGENDADA' | 'CONFIRMADA' | 'REAGENDAR' | 'REALIZADA' | 'NO_ASISTIO' | 'CANCELADA';
type SlotStatus = 'DISPONIBLE' | 'OCUPADO' | 'BLOQUEADO';

interface Visit {
  id: string;
  op: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  tipoGestion: 'DACION' | 'VENTA_DIRECTA';
  empresa: string;
  ejecutivo: string;
  inicio: string;
  fin: string;
  estado: VisitStatus;
  resultado?: string;
}

const visits: Visit[] = [
  {
    id: 'vis_001',
    op: 'OP-24891',
    clienteNombre: 'Marcela Rojas',
    clienteEmail: 'marcela@example.cl',
    clienteTelefono: '+56 9 1111 2222',
    tipoGestion: 'DACION',
    empresa: 'Partner Norte',
    ejecutivo: 'J. Fuentes',
    inicio: '2026-06-29T10:00:00-04:00',
    fin: '2026-06-29T11:00:00-04:00',
    estado: 'CONFIRMADA',
    resultado: 'Pendiente visita',
  },
];

const blocks = [
  { id: 'blk_001', inicio: '2026-06-29T12:00:00-04:00', fin: '2026-06-29T13:00:00-04:00', motivo: 'Colacion' },
];

const companies = [
  { id: 'emp_001', nombre: 'Partner Norte', activa: true },
  { id: 'emp_002', nombre: 'Gestiones Sur', activa: true },
  { id: 'emp_003', nombre: 'Phoenix', activa: true },
];

const users: Array<{ id: string; nombre: string; email: string; rol: string; empresaId?: string; activo: boolean }> = [
  { id: 'usr_001', nombre: 'Administrador Phoenix', email: 'admin@phoenix.cl', rol: 'ADMINISTRADOR', empresaId: 'emp_003', activo: true },
  { id: 'usr_002', nombre: 'Paciente Demo', email: 'paciente@phoenix.cl', rol: 'PACIENTE', empresaId: 'emp_003', activo: true },
];

const outboundCalls: Array<{ id: string; cliente: string; telefono: string; estado: string; resultado?: string; visitaId?: string }> = [];

@Injectable()
export class AgendaService {
  getAvailability(diasHabiles = 5) {
    const base = new Date('2026-06-29T09:00:00-04:00');
    return Array.from({ length: diasHabiles }).map((_, dayIndex) => {
      const date = new Date(base);
      date.setDate(base.getDate() + dayIndex);
      return {
        fecha: date.toISOString().slice(0, 10),
        slots: [9, 10, 11, 12, 14, 15, 16].map((hour) => {
          const inicio = new Date(date);
          inicio.setHours(hour, 0, 0, 0);
          const fin = new Date(inicio);
          fin.setHours(hour + 1);
          return { inicio: inicio.toISOString(), fin: fin.toISOString(), estado: this.resolveSlotStatus(inicio, fin) };
        }),
      };
    });
  }

  listVisits() {
    return visits;
  }

  createVisit(payload: Omit<Visit, 'id' | 'estado'>) {
    this.assertSlotAvailable(payload.inicio, payload.fin);
    const visit = { ...payload, id: `vis_${Date.now()}`, estado: 'AGENDADA' as VisitStatus };
    visits.push(visit);
    return visit;
  }

  reschedule(id: string, inicio: string, fin: string) {
    const visit = this.findVisit(id);
    this.assertSlotAvailable(inicio, fin, id);
    visit.inicio = inicio;
    visit.fin = fin;
    visit.estado = 'REAGENDAR';
    return visit;
  }

  registerAttendance(id: string, asistio: boolean) {
    const visit = this.findVisit(id);
    visit.estado = asistio ? 'REALIZADA' : 'NO_ASISTIO';
    return visit;
  }

  registerResult(id: string, resultado: string) {
    const visit = this.findVisit(id);
    visit.resultado = resultado;
    return visit;
  }

  createBlock(payload: { inicio: string; fin: string; motivo: string }) {
    this.assertSlotAvailable(payload.inicio, payload.fin);
    const block = { ...payload, id: `blk_${Date.now()}` };
    blocks.push(block);
    return block;
  }

  listBlocks() {
    return blocks;
  }

  deleteBlock(id: string) {
    const index = blocks.findIndex((block) => block.id === id);
    if (index === -1) throw new NotFoundException('Bloqueo no encontrado');
    blocks.splice(index, 1);
    return { ok: true };
  }

  getTracking() {
    return {
      total: visits.length,
      agendadas: visits.filter((visit) => visit.estado === 'AGENDADA' || visit.estado === 'CONFIRMADA').length,
      realizadas: visits.filter((visit) => visit.estado === 'REALIZADA').length,
      noRealizadas: visits.filter((visit) => visit.estado === 'NO_ASISTIO').length,
      visitas: visits,
    };
  }

  listUsers() {
    return users;
  }

  createUser(payload: { nombre: string; email: string; rol: string; empresaId?: string }) {
    const user = { ...payload, id: `usr_${Date.now()}`, activo: true };
    users.push(user);
    return user;
  }

  listCompanies() {
    return companies;
  }

  createCompany(payload: { nombre: string }) {
    const company = { ...payload, id: `emp_${Date.now()}`, activa: true };
    companies.push(company);
    return company;
  }

  createOutboundCall(payload: { cliente: string; telefono: string; estado: string; resultado?: string; visitaId?: string }) {
    const call = { ...payload, id: `out_${Date.now()}` };
    outboundCalls.push(call);
    return call;
  }

  listOutboundCalls() {
    return outboundCalls;
  }

  private resolveSlotStatus(inicio: Date, fin: Date): SlotStatus {
    if (this.hasOverlap(blocks, inicio, fin)) return 'BLOQUEADO';
    if (this.hasOverlap(visits, inicio, fin)) return 'OCUPADO';
    return 'DISPONIBLE';
  }

  private assertSlotAvailable(inicioValue: string, finValue: string, ignoreVisitId?: string) {
    const inicio = new Date(inicioValue);
    const fin = new Date(finValue);
    const visitOverlap = visits.some((visit) => visit.id !== ignoreVisitId && this.overlaps(visit.inicio, visit.fin, inicio, fin));
    const blockOverlap = blocks.some((block) => this.overlaps(block.inicio, block.fin, inicio, fin));
    if (visitOverlap || blockOverlap) throw new ConflictException('El horario seleccionado ya no esta disponible');
  }

  private hasOverlap(items: Array<{ inicio: string; fin: string }>, inicio: Date, fin: Date) {
    return items.some((item) => this.overlaps(item.inicio, item.fin, inicio, fin));
  }

  private overlaps(itemStart: string, itemEnd: string, inicio: Date, fin: Date) {
    return new Date(itemStart) < fin && inicio < new Date(itemEnd);
  }

  private findVisit(id: string) {
    const visit = visits.find((item) => item.id === id);
    if (!visit) throw new NotFoundException('Visita no encontrada');
    return visit;
  }
}