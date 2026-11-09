import type { AveragePriceResult, PriceQuoteRecord } from '@/types/market';

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function isRealRecord(record: PriceQuoteRecord): boolean {
  return record.dataStatus === 'live' || record.dataStatus === 'cached';
}

export function computeAveragePrice(records: PriceQuoteRecord[]): AveragePriceResult {
  const real = records.filter(isRealRecord);
  const computedAt = Date.now();

  if (real.length === 0) {
    return {
      weightedAverage: null,
      simpleAverage: null,
      min: null,
      max: null,
      median: null,
      quotationCount: 0,
      sourceCount: 0,
      confidence: 'none',
      computedAt,
    };
  }

  const prices = real.map((r) => r.price);
  const weightSum = real.reduce((sum, r) => sum + r.qualityScore, 0);
  const weightedAverage =
    weightSum > 0 ? real.reduce((sum, r) => sum + r.price * r.qualityScore, 0) / weightSum : null;
  const sourceCount = new Set(real.map((r) => r.sourceName)).size;
  const avgQuality = weightSum / real.length;

  let confidence: AveragePriceResult['confidence'];
  if (sourceCount >= 3 && avgQuality >= 0.85) confidence = 'high';
  else if (sourceCount >= 2 && avgQuality >= 0.75) confidence = 'medium';
  else confidence = 'low';

  return {
    weightedAverage,
    simpleAverage: prices.reduce((sum, p) => sum + p, 0) / prices.length,
    min: Math.min(...prices),
    max: Math.max(...prices),
    median: median(prices),
    quotationCount: real.length,
    sourceCount,
    confidence,
    computedAt,
  };
}

export interface RepresentativePrice {
  value: number;
  basis: 'real' | 'demo';
}

export function resolveRepresentativePrice(
  result: AveragePriceResult,
  simulatedPrice: number
): RepresentativePrice {
  if (result.weightedAverage !== null) {
    return { value: result.weightedAverage, basis: 'real' };
  }
  return { value: simulatedPrice, basis: 'demo' };
}

export const CONFIDENCE_LABELS: Record<AveragePriceResult['confidence'], string> = {
  high: 'Высокая',
  medium: 'Средняя',
  low: 'Низкая',
  none: 'Недостаточно данных',
};

export const CONFIDENCE_COLORS: Record<AveragePriceResult['confidence'], string> = {
  high: 'text-brand-500',
  medium: 'text-yellow-400',
  low: 'text-orange-400',
  none: 'text-ink-400',
};
