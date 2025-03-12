import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { AuthModule } from 'auth/auth.module';
import { AuthService } from 'auth/auth.service';
import { AuthMiddleware } from 'middlewares/auth.middleware';
import { QuoteModule } from 'quote/quote.module';
import { PrismaService } from '_prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QuoteModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'quote',
        method: RequestMethod.ALL,
      },
      {
        path: 'quote/*',
        method: RequestMethod.ALL,
      }
    );
  }
}
