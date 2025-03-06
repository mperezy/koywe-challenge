import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuoteService } from 'quote/quote.service';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get('/')
  getHandler() {
    return {
      message: 'This is GET /quote',
    };
  }

  @Post('/')
  async postHandler(
    @Body('amount') amount: number,
    @Body('from') from: string,
    @Body('to') to: string
  ) {
    const priceRateResponse = await this.quoteService.getPriceRate(from, to);
    const rate = Number(priceRateResponse.price);

    // This payload must be saved in a DB in order to get a generated ID and timestamps
    const payload = {
      from,
      to,
      amount,
      rate,
      convertedAmount: amount * rate,
    };

    return {
      id: new Date().getTime(),
      ...payload,
      timestamp: new Date().toISOString(),
      expiresAt: 'TO-BE-IMPLEMENTED',
    };
  }
}
