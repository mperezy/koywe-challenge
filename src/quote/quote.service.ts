import axios, { isAxiosError } from 'axios';
import * as dayjs from 'dayjs';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '_prisma/prisma.service';
import { QuoteInputDTO, QuoteOutputDTO } from 'models/dtos/quote.dto';

@Injectable()
export class QuoteService {
  private readonly cryptoMktAPIBaseURL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {
    const CRYPTO_MKT_API_BASE_URL = this.configService.get<string>('CRYPTO_MKT_API_BASE_URL');
    const CRYPTO_MKT_API_VERSION = this.configService.get<string>('CRYPTO_MKT_API_VERSION');
    const CRYPTO_MKT_API_LAYER = this.configService.get<string>('CRYPTO_MKT_API_LAYER');

    // eslint-disable-next-line max-len
    this.cryptoMktAPIBaseURL = `${CRYPTO_MKT_API_BASE_URL}/${CRYPTO_MKT_API_VERSION}/${CRYPTO_MKT_API_LAYER}`;
  }

  getPriceRate = async (
    sourceCurrency: string,
    targetCurrency: string
  ): Promise<PriceRate> => {
    try {
      const url = `${this.cryptoMktAPIBaseURL}/price/rate`;

      const response = await axios.get<PriceRateResponse>(url, {
        params: {
          from: sourceCurrency,
          to: targetCurrency,
        },
      });

      return Object.values(response.data)[0];
    } catch (error) {
      if (isAxiosError(error)) {
        throw new HttpException(error.message, error.status ?? 500);
      }

      throw new HttpException(
        `**** Error trying to get price rate from Crypto MKT API: ${error}`,
        500
      );
    }
  };

  getAllQuotes = (): Promise<QuoteOutputDTO[]> => this.prismaService.quote.findMany();

  getQuoteById = async (id: string): Promise<QuoteOutputDTO> => {
    try {
      const now = new Date();

      const quote = await this.prismaService.quote.findFirst({
        where: {
          id,
          expiresAt: {
            gte: now,
          },
        },
      });

      if (!quote) {
        throw new HttpException('Not found', 404);
      }

      return quote;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.message && error.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        throw new HttpException(error.message, error.status);
      }

      throw new HttpException(`**** Error trying to get quote with id '${id}': ${error}`, 500);
    }
  };

  createQuote = async (quote: QuoteInputDTO): Promise<QuoteOutputDTO> => {
    const _expiresAt = dayjs().add(5, 'minutes').toISOString();

    const quoteCreated = await this.prismaService.quote.create({
      data: { ...quote, expiresAt: _expiresAt },
    });

    const { id, from, to, amount, rate, convertedAmount, timestamp, expiresAt } = quoteCreated;

    return {
      id,
      from,
      to,
      amount: Number(amount),
      rate: Number(rate),
      convertedAmount: Number(convertedAmount),
      timestamp,
      expiresAt,
    };
  };
}
