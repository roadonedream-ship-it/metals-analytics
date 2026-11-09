export type PeriodKey = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

export type MetalCategoryId =
  | 'non-ferrous'
  | 'precious'
  | 'rare-strategic'
  | 'rare-earth'
  | 'ferrous'
  | 'ferroalloys'
  | 'scrap'
  | 'special-alloys';

export interface MetalCategory {
  id: MetalCategoryId;
  name: string;
  shortName: string;
  description: string;
}

export interface Metal {
  id: string;
  symbol: string;
  name: string;
  nameRu: string;
  aliases: string[];
  atomicNumber: number | null;
  categoryId: MetalCategoryId;
  basePrice: number;
  volatility: number;
  trend: number;
  unit: string;
  currency: CurrencyCode;
  description: string;
  applications: string[];
  quoteTypes: string[];
  regions: string[];
  marketTypes: string[];
  priceFactors: string[];
}

export interface PricePoint {
  date: number;
  price: number;
}

export interface MetalQuote {
  metal: Metal;
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  average: number;
  series: PricePoint[];
}

export interface PeriodConfig {
  key: PeriodKey;
  label: string;
  points: number;
  stepMs: number;
  volatilityScale: number;
}

export type MarketType =
  | 'exchange'
  | 'spot'
  | 'wholesale'
  | 'regional'
  | 'scrap'
  | 'raw'
  | 'alloy';

export type DataStatus = 'live' | 'cached' | 'demo' | 'unavailable';

export interface PriceSource {
  id: string;
  name: string;
  url: string;
  marketType: MarketType;
  region: string;
  qualityScore: number;
}

export interface PriceQuoteRecord {
  sourceName: string;
  sourceUrl: string;
  metalId: string;
  price: number;
  currency: string;
  unit: string;
  marketType: MarketType;
  region: string;
  timestamp: number;
  retrievedAt: number;
  dataStatus: DataStatus;
  qualityScore: number;
}

export type SourceStatus = 'pending' | 'connected' | 'error' | 'unavailable';

export interface AveragePriceResult {
  weightedAverage: number | null;
  simpleAverage: number | null;
  min: number | null;
  max: number | null;
  median: number | null;
  quotationCount: number;
  sourceCount: number;
  confidence: 'high' | 'medium' | 'low' | 'none';
  computedAt: number;
}

export type CurrencyCode = 'USD' | 'EUR' | 'RUB' | 'CNY' | 'SEK';

export type UnitCode = 'ton' | 'kg' | 'g' | 'ozt' | 'lb';

export interface ExchangeRate {
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
  updatedAt: number;
}

export type SortKey = 'name' | 'price' | 'change' | 'changePct';

export type TrendDirection = 'up' | 'down' | 'flat';

export interface MarketIndex {
  id: string;
  name: string;
  categoryId: MetalCategoryId | 'all';
  series: PricePoint[];
  changePct: number;
}
