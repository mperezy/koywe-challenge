import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'auth/auth.controller';
import { AuthService } from 'auth/auth.service';

@Module({
  controllers: [AuthController],
  imports: [JwtModule.register({ global: true })],
  providers: [AuthService],
})
export class AuthModule {}
