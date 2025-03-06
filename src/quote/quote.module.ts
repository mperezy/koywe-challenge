import { Module } from '@nestjs/common';
import { QuoteController } from 'quote/quote.controller';
import { QuoteService } from 'quote/quote.service';

@Module({
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
