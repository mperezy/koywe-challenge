/* eslint-disable max-len */

import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async handleLogin(@Body('username') username: string, @Body('password') password: string) {
    if (!username || !password) {
      throw new BadRequestException({ message: 'Username or password is missing.' });
    }

    const { jwt, isNew, minutesLeft } = await this.authService.generateJWT(username);

    return {
      jwt,
      message: isNew
        ? 'This new token will last ONLY for 15 minutes.'
        : `This token was previously created and it is still valid for ${minutesLeft === 0 ? `a few seconds` : minutesLeft === 1 ? '1 minute' : `${minutesLeft} minutes`}.`,
    };
  }
}
