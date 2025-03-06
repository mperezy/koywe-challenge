import axios, { isAxiosError } from 'axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QuoteService {
  private readonly cryptoMktAPIBaseURL: string;

  constructor(private readonly configService: ConfigService) {
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
}
