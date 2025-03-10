import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuoteInputDTO, QuoteOutputDTO } from 'models/dtos/quote.dto';
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
  ): Promise<QuoteOutputDTO> {
    const priceRateResponse = await this.quoteService.getPriceRate(from, to);
    const rate = Number(priceRateResponse.price);

    const quoteDTO = new QuoteInputDTO({
      from,
      to,
      amount,
      rate,
      convertedAmount: amount * rate,
    });

    return await this.quoteService.createQuote(quoteDTO);
  }
}
