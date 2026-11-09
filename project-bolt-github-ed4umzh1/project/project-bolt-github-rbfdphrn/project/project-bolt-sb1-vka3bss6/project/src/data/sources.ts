import type { PriceSource, MarketType } from '@/types/market';

export const PRICE_SOURCES: PriceSource[] = [
  { id: 'lme', name: 'London Metal Exchange', url: 'https://www.lme.com', marketType: 'exchange', region: 'Глобальный', qualityScore: 0.95 },
  { id: 'comex', name: 'COMEX / CME', url: 'https://www.cmegroup.com', marketType: 'exchange', region: 'США', qualityScore: 0.94 },
  { id: 'shfe', name: 'Shanghai Futures Exchange', url: 'https://www.shfe.com.cn', marketType: 'exchange', region: 'Китай', qualityScore: 0.92 },
  { id: 'lbma', name: 'London Bullion Market Association', url: 'https://www.lbma.org.uk', marketType: 'spot', region: 'Глобальный', qualityScore: 0.96 },
  { id: 'kitco', name: 'Kitco Metals', url: 'https://www.kitco.com', marketType: 'spot', region: 'Глобальный', qualityScore: 0.88 },
  { id: 'fastmarkets', name: 'Fastmarkets MB', url: 'https://www.fastmarkets.com', marketType: 'wholesale', region: 'Глобальный', qualityScore: 0.90 },
  { id: 'asian-metal', name: 'Asian Metal', url: 'https://www.asianmetal.com', marketType: 'regional', region: 'Азия', qualityScore: 0.85 },
  { id: 'metals-api', name: 'MetalsAPI (commercial)', url: 'https://metalsapi.com', marketType: 'spot', region: 'Глобальный', qualityScore: 0.87 },
  { id: 'scrap-sources', name: 'Региональные источники лома', url: '', marketType: 'scrap', region: 'Региональный', qualityScore: 0.75 },
  { id: 'raw-sources', name: 'Источники цен на сырье', url: '', marketType: 'raw', region: 'Региональный', qualityScore: 0.78 },
  { id: 'ferroalloy-sources', name: 'Источники цен на ферросплавы', url: '', marketType: 'wholesale', region: 'Региональный', qualityScore: 0.80 },
];

export const MARKET_TYPE_LABELS: Record<MarketType, string> = {
  exchange: 'Биржевая',
  spot: 'Спотовая',
  wholesale: 'Оптовая',
  regional: 'Региональная',
  scrap: 'Лом',
  raw: 'Сырье',
  alloy: 'Сплав',
};
