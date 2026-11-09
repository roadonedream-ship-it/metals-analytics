import type { CurrencyCode, UnitCode } from '@/types/market';

export const CURRENCY_CODES: CurrencyCode[] = ['USD', 'EUR', 'RUB', 'CNY', 'SEK'];

// Indicative DEMO rates fixed inside the app. They are not live and must never be shown as market data.
const DEMO_RATES: Record<CurrencyCode, Record<CurrencyCode, number>> = {
  USD: { USD: 1, EUR: 0.92, RUB: 95, CNY: 7.25, SEK: 10.6 },
  EUR: { USD: 1.087, EUR: 1, RUB: 103.3, CNY: 7.88, SEK: 11.5 },
  RUB: { USD: 0.0105, EUR: 0.0097, RUB: 1, CNY: 0.076, SEK: 0.111 },
  CNY: { USD: 0.138, EUR: 0.127, RUB: 13.1, CNY: 1, SEK: 1.46 },
  SEK: { USD: 0.0943, EUR: 0.087, RUB: 9.0, CNY: 0.685, SEK: 1 },
};

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  USD: 'USD',
  EUR: 'EUR',
  RUB: 'RUB',
  CNY: 'CNY',
  SEK: 'SEK',
};

export const UNIT_LABELS: Record<UnitCode, string> = {
  ton: 'т',
  kg: 'кг',
  g: 'г',
  ozt: 'тр. унц.',
  lb: 'фунт',
};

const UNIT_TO_KG: Record<UnitCode, number> = {
  ton: 1000,
  kg: 1,
  g: 0.001,
  ozt: 0.0311035,
  lb: 0.453592,
};

export function getRate(base: CurrencyCode, quote: CurrencyCode): number {
  if (base === quote) return 1;
  return DEMO_RATES[base][quote];
}

export function convertPrice(
  price: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  fromUnit: UnitCode,
  toUnit: UnitCode
): number {
  const pricePerKg = price / UNIT_TO_KG[fromUnit];
  const convertedPerKg = pricePerKg * getRate(fromCurrency, toCurrency);
  return convertedPerKg * UNIT_TO_KG[toUnit];
}
