type PriceRate = {
  currency: string;
  price: string;
  timestamp: Date;
};

type PriceRateResponse = Record<string, PriceRate>;
