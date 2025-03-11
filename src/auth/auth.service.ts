import * as crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_LIFETIME: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET');
    this.JWT_LIFETIME = Number(this.configService.get<string>('JWT_LIFETIME'));
  }

  generateJWT = (username: string): Promise<string> => {
    const payload = {
      sub: username,
      id: crypto.randomBytes(16).toString('hex'),
    };

    return this.jwtService.signAsync(payload, {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_LIFETIME,
    });
  };

  verify = (jwt: string): Promise<boolean> =>
    this.jwtService
      .verifyAsync(jwt, {
        secret: this.JWT_SECRET,
      })
      .then(() => true)
      .catch(() => false);
}
