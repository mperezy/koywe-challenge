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

    const jwt = await this.authService.generateJWT(username);

    return {
      jwt,
      message: 'This token will last ONLY for 15 minutes.',
    };
  }
}
