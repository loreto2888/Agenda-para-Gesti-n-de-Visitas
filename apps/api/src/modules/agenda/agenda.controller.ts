import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsIn, IsISO8601, IsString } from 'class-validator';
import { AgendaService } from './agenda.service';

class CreateVisitDto {
  @IsString()
  op: string;

  @IsString()
  clienteNombre: string;

  @IsEmail()
  clienteEmail: string;

  @IsString()
  clienteTelefono: string;

  @IsIn(['DACION', 'VENTA_DIRECTA'])
  tipoGestion: 'DACION' | 'VENTA_DIRECTA';

  @IsString()
  empresa: string;

  @IsString()
  ejecutivo: string;

  @IsISO8601()
  inicio: string;

  @IsISO8601()
  fin: string;
}

class RescheduleDto {
  @IsISO8601()
  inicio: string;

  @IsISO8601()
  fin: string;
}

class AttendanceDto {
  @IsBoolean()
  asistio: boolean;
}

class ResultDto {
  @IsString()
  resultado: string;
}

class BlockDto {
  @IsISO8601()
  inicio: string;

  @IsISO8601()
  fin: string;

  @IsString()
  motivo: string;
}

class UserDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsIn(['PACIENTE', 'MEDICO', 'ADMINISTRADOR', 'VISOR_INTERNO'])
  rol: string;

  @IsString()
  empresaId?: string;
}

class CompanyDto {
  @IsString()
  nombre: string;
}

class OutboundDto {
  @IsString()
  cliente: string;

  @IsString()
  telefono: string;

  @IsString()
  estado: string;

  @IsString()
  resultado?: string;

  @IsString()
  visitaId?: string;
}

@ApiTags('agenda')
@Controller()
export class AgendaController {
  constructor(private readonly agenda: AgendaService) {}

  @Get('disponibilidad')
  getAvailability(@Query('diasHabiles') diasHabiles?: string) {
    return this.agenda.getAvailability(diasHabiles ? Number(diasHabiles) : 5);
  }

  @Get('visitas')
  listVisits() {
    return this.agenda.listVisits();
  }

  @Post('visitas')
  createVisit(@Body() dto: CreateVisitDto) {
    return this.agenda.createVisit(dto);
  }

  @Patch('visitas/:id/reagendar')
  reschedule(@Param('id') id: string, @Body() dto: RescheduleDto) {
    return this.agenda.reschedule(id, dto.inicio, dto.fin);
  }

  @Patch('visitas/:id/asistencia')
  attendance(@Param('id') id: string, @Body() dto: AttendanceDto) {
    return this.agenda.registerAttendance(id, dto.asistio);
  }

  @Patch('visitas/:id/resultado')
  result(@Param('id') id: string, @Body() dto: ResultDto) {
    return this.agenda.registerResult(id, dto.resultado);
  }

  @Patch('visitas/:id/cancelar')
  cancel(@Param('id') id: string, @Body() _dto?: Record<string, never>) {
    return this.agenda.registerResult(id, 'Cancelada por administrador');
  }

  @Get('bloqueos-calendario')
  listBlocks() {
    return this.agenda.listBlocks();
  }

  @Post('bloqueos-calendario')
  createBlock(@Body() dto: BlockDto) {
    return this.agenda.createBlock(dto);
  }

  @Delete('bloqueos-calendario/:id')
  deleteBlock(@Param('id') id: string) {
    return this.agenda.deleteBlock(id);
  }

  @Get('reportes/seguimiento-visitas')
  tracking(@Query('estado') _estado?: string) {
    return this.agenda.getTracking();
  }

  @Get('usuarios')
  listUsers() {
    return this.agenda.listUsers();
  }

  @Post('usuarios')
  createUser(@Body() dto: UserDto) {
    return this.agenda.createUser(dto);
  }

  @Get('empresas')
  listCompanies() {
    return this.agenda.listCompanies();
  }

  @Post('empresas')
  createCompany(@Body() dto: CompanyDto) {
    return this.agenda.createCompany(dto);
  }

  @Get('outbound')
  listOutboundCalls() {
    return this.agenda.listOutboundCalls();
  }

  @Get('outbound/notificaciones')
  listOutboundNotifications() {
    return this.agenda.listOutboundNotifications();
  }

  @Post('outbound')
  createOutboundCall(@Body() dto: OutboundDto) {
    return this.agenda.createOutboundCall(dto);
  }

  @Get('publico/visitas/:token')
  publicVisit(@Param('token') token: string) {
    return this.agenda.getPublicVisit(token);
  }

  @Post('publico/visitas/:token/confirmar')
  confirm(@Param('token') token: string) {
    return this.agenda.confirmPublicVisit(token);
  }

  @Post('publico/visitas/:token/rechazar')
  reject(@Param('token') token: string) {
    return this.agenda.rejectPublicVisit(token);
  }
}