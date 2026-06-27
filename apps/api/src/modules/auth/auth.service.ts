import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, pbkdf2Sync, timingSafeEqual } from 'node:crypto';

type Role = 'ADMINISTRADOR' | 'MEDICO' | 'PACIENTE' | 'VISOR_INTERNO';

interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol: Role;
  passwordHash: string;
}

const salt = 'agenda-phoenix-demo-salt';
const demoPassword = 'Phoenix2026!';

@Injectable()
export class AuthService {
  private readonly users: AuthUser[] = [
    { id: 'usr_admin', email: 'admin@phoenix.cl', nombre: 'Administrador Phoenix', rol: 'ADMINISTRADOR', passwordHash: this.hashPassword(demoPassword) },
    { id: 'usr_medico', email: 'medico@phoenix.cl', nombre: 'Dra. Valentina Rios', rol: 'MEDICO', passwordHash: this.hashPassword(demoPassword) },
    { id: 'usr_paciente', email: 'paciente@phoenix.cl', nombre: 'Paciente Demo', rol: 'PACIENTE', passwordHash: this.hashPassword(demoPassword) },
  ];

  login(email: string, password: string) {
    const user = this.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user || !this.verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const publicUser = this.toPublicUser(user);
    return {
      accessToken: this.signToken(publicUser),
      user: publicUser,
    };
  }

  me(authorization?: string) {
    const token = authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('Token requerido');
    return this.verifyToken(token);
  }

  private hashPassword(password: string) {
    return pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
  }

  private verifyPassword(password: string, expectedHash: string) {
    const received = Buffer.from(this.hashPassword(password), 'hex');
    const expected = Buffer.from(expectedHash, 'hex');
    return received.length === expected.length && timingSafeEqual(received, expected);
  }

  private signToken(payload: { id: string; email: string; nombre: string; rol: Role }) {
    const secret = process.env.JWT_SECRET ?? 'cambiar-en-produccion';
    const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
    const body = Buffer.from(JSON.stringify({ ...payload, exp: expiresAt })).toString('base64url');
    const signature = createHmac('sha256', secret).update(body).digest('base64url');
    return `${body}.${signature}`;
  }

  private verifyToken(token: string) {
    const secret = process.env.JWT_SECRET ?? 'cambiar-en-produccion';
    const [body, signature] = token.split('.');
    if (!body || !signature) throw new UnauthorizedException('Token invalido');

    const expectedSignature = createHmac('sha256', secret).update(body).digest('base64url');
    if (signature !== expectedSignature) throw new UnauthorizedException('Token invalido');

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { exp: number; id: string; email: string; nombre: string; rol: Role };
    if (payload.exp < Date.now()) throw new UnauthorizedException('Token expirado');

    return { id: payload.id, email: payload.email, nombre: payload.nombre, rol: payload.rol };
  }

  private toPublicUser(user: AuthUser) {
    return { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol };
  }
}