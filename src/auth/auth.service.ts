import * as crypto from 'node:crypto';
import * as dayjs from 'dayjs';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthSessionInputDTO, AuthSessionOutputDTO } from 'models/dtos/auth-session.dto';
import { PrismaService } from '_prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_LIFETIME: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET');
    this.JWT_LIFETIME = Number(this.configService.get<string>('JWT_LIFETIME'));
  }

  private getAuthSession = async ({
    username,
    expiresAt,
  }: T_AuthSessionDTO): Promise<AuthSessionOutputDTO> => {
    try {
      return this.prismaService.auth_session.findFirst({
        where: {
          username,
          expiresAt: {
            gte: expiresAt,
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        `**** Error trying to get token for user '${username}': ${error}`,
        500
      );
    }
  };

  private createAuthSession = async ({
    username,
    token,
    expiresAt,
  }: AuthSessionInputDTO): Promise<AuthSessionOutputDTO> => {
    try {
      return this.prismaService.auth_session.create({
        data: {
          username,
          token,
          expiresAt,
        },
      });
    } catch (error) {
      throw new HttpException(
        `**** Error trying to create token for user ${username}: ${error}`,
        500
      );
    }
  };

  generateJWT = async (
    username: string
  ): Promise<{
    isNew: boolean;
    jwt: string;
    minutesLeft?: number;
  }> => {
    const now = new Date();
    const userToken = await this.getAuthSession({
      username,
      expiresAt: now,
    });

    if (userToken) {
      const _now = dayjs(now);
      const _expiresAt = dayjs(userToken.expiresAt);
      const minutesLeft = _expiresAt.diff(_now, 'minutes');

      return { jwt: userToken.token, isNew: false, minutesLeft };
    }

    const payload = {
      sub: username,
      id: crypto.randomBytes(16).toString('hex'),
    };

    const expiresAt = dayjs().add(this.JWT_LIFETIME, 'seconds').toDate();
    const token = await this.jwtService.signAsync(payload, {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_LIFETIME,
    });

    const sessionCreated = await this.createAuthSession({
      username,
      token,
      expiresAt,
    });

    // This is just for ensuring the session token was created in DB
    return { jwt: sessionCreated.token, isNew: true };
  };

  verify = (jwt: string): Promise<boolean> =>
    this.jwtService
      .verifyAsync(jwt, {
        secret: this.JWT_SECRET,
      })
      .then(() => true)
      .catch(() => false);
}
