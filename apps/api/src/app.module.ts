import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgendaModule } from './modules/agenda/agenda.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, AgendaModule],
})
export class AppModule {}