import { Module } from '@nestjs/common';
import { PrismaModule } from '_prisma/prisma.module';
import { QuoteController } from 'quote/quote.controller';
import { QuoteService } from 'quote/quote.service';

@Module({
  controllers: [QuoteController],
  providers: [QuoteService],
  imports: [PrismaModule],
})
export class QuoteModule {}
