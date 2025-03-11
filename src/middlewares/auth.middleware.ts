import type { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const { headers } = req;
    const { authorization } = headers;

    if (!authorization) {
      throw new HttpException('Unauthorized', 401);
    }

    const jwt = authorization.split(' ').pop();
    const isValid = await this.authService.verify(jwt);

    if (!isValid) {
      throw new HttpException('Session expired', 419);
    }

    next();
  }
}
