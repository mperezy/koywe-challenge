import type { Decimal } from '@prisma/client/runtime/client.js';

export class QuoteInputDTO {
  readonly from: string;
  readonly to: string;
  readonly amount: Decimal.Value;
  readonly rate: Decimal.Value;
  readonly convertedAmount: Decimal.Value;

  constructor(quoteInput: T_QuoteInputDTO) {
    this.from = quoteInput.from;
    this.to = quoteInput.to;
    this.amount = quoteInput.amount as unknown as Decimal;
    this.rate = quoteInput.rate as unknown as Decimal;
    this.convertedAmount = quoteInput.convertedAmount as unknown as Decimal;
  }
}

export class QuoteOutputDTO extends QuoteInputDTO {
  readonly id: string;
  readonly timestamp: Date;
  readonly expiresAt: Date;
}
