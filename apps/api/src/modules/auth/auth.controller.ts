import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

@ApiTags('autenticacion')
@Controller('autenticacion')
export class AuthController {
  @Post('login')
  login(@Body() dto: LoginDto) {
    return {
      accessToken: 'demo-token-firmado-en-produccion',
      user: {
        id: 'usr_admin',
        email: dto.email,
        nombre: 'Administrador Phoenix',
        rol: 'ADMINISTRADOR',
      },
    };
  }

  @Post('logout')
  logout() {
    return { ok: true };
  }

  @Get('yo')
  me() {
    return {
      id: 'usr_admin',
      email: 'admin@phoenix.cl',
      nombre: 'Administrador Phoenix',
      rol: 'ADMINISTRADOR',
    };
  }
}