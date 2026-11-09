import { CATEGORY_MAP } from '@/data/categories';
import { PERIODS } from '@/data/periods';
import { formatDateTime } from '@/lib/format';
import type { MetalQuote, PeriodKey } from '@/types/market';

const HEADERS = [
  'Металл',
  'Символ',
  'Категория',
  'Цена за единицу',
  'Валюта',
  'Единица',
  'Изменение',
  'Изменение %',
  'Максимум',
  'Минимум',
  'Среднее',
  'Период',
  'Дата обновления (МСК)',
  'Статус данных',
  'Источник',
];

const DATA_SOURCE = 'Демо-генератор ALPHA ANALYST (не реальные котировки)';

function formatNumber(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

function escapeCell(value: string): string {
  return /[";\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function buildQuotesCsv(quotes: MetalQuote[], period: PeriodKey, updatedAt: Date): string {
  const periodLabel = PERIODS.find((item) => item.key === period)?.label ?? period;
  const updated = formatDateTime(updatedAt.getTime());

  const rows = quotes.map((quote) => {
    const { metal } = quote;
    return [
      metal.name,
      metal.symbol,
      CATEGORY_MAP[metal.categoryId].name,
      formatNumber(quote.price),
      metal.currency,
      metal.unit,
      formatNumber(quote.change),
      formatNumber(quote.changePct),
      formatNumber(quote.high),
      formatNumber(quote.low),
      formatNumber(quote.average),
      periodLabel,
      updated,
      'DEMO',
      DATA_SOURCE,
    ];
  });

  return [HEADERS, ...rows]
    .map((row) => row.map((cell) => escapeCell(String(cell))).join(';'))
    .join('\r\n');
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob(['\uFEFF', content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
