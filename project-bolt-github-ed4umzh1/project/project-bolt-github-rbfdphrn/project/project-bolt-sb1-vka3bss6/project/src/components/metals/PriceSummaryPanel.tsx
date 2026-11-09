import { CONFIDENCE_COLORS, CONFIDENCE_LABELS, computeAveragePrice, resolveRepresentativePrice } from '@/services/averagePrice';
import DemoBadge from '@/components/common/DemoBadge';
import { cn } from '@/lib/cn';
import { formatIndex } from '@/lib/format';
import type { AsyncState } from '@/hooks/useAsyncData';
import type { AveragePriceResult, PriceQuoteRecord } from '@/types/market';

interface PriceSummaryPanelProps {
  state: AsyncState<PriceQuoteRecord[]>;
  simulatedPrice: number;
  unit: string;
  currency: string;
}

function formatValue(value: number | null, currency: string): string {
  return value === null ? '—' : `${formatIndex(value)} ${currency}`;
}

function describeState(state: AsyncState<PriceQuoteRecord[]>): string {
  switch (state.status) {
    case 'idle':
      return 'База данных не подключена, поэтому реальные котировки не загружены. Средние значения не рассчитываются.';
    case 'loading':
      return 'Загрузка котировок из базы данных…';
    case 'error':
      return `Не удалось загрузить котировки: ${state.message}`;
    case 'ready':
      return 'Котировки из подключённых источников пока не загружены. Средние значения не рассчитываются, чтобы не создавать ложных данных.';
  }
}

function buildTiles(result: AveragePriceResult, currency: string) {
  return [
    { label: 'Средняя цена', value: formatValue(result.simpleAverage, currency), hint: undefined },
    { label: 'Средневзвешенная', value: formatValue(result.weightedAverage, currency), hint: 'по весу качества' },
    { label: 'Медиана', value: formatValue(result.median, currency), hint: undefined },
    { label: 'Минимум', value: formatValue(result.min, currency), hint: undefined },
    { label: 'Максимум', value: formatValue(result.max, currency), hint: undefined },
    { label: 'Котировок', value: String(result.quotationCount), hint: undefined },
    { label: 'Источников', value: String(result.sourceCount), hint: undefined },
  ];
}

export default function PriceSummaryPanel({ state, simulatedPrice, unit, currency }: PriceSummaryPanelProps) {
  const records = state.status === 'ready' ? state.data : [];
  const result = computeAveragePrice(records);
  const representative = resolveRepresentativePrice(result, simulatedPrice);
  const hasRealData = representative.basis === 'real';

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-950/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-ink-400">Репрезентативная цена за {unit}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-ink-100">
            {formatIndex(representative.value)} {currency}
          </p>
        </div>
        {hasRealData ? (
          <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-[11px] font-semibold tracking-[0.14em] text-brand-400">
            LIVE
          </span>
        ) : (
          <DemoBadge />
        )}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-400">
        {hasRealData
          ? 'Средневзвешенная цена по реальным котировкам подключённых источников.'
          : 'Реальных котировок нет. Показана демонстрационная цена, она не является рыночной.'}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-ink-800 pt-4">
        <span className="text-xs text-ink-400">Достоверность</span>
        <span className={cn('text-sm font-medium', CONFIDENCE_COLORS[result.confidence])}>
          {CONFIDENCE_LABELS[result.confidence]}
        </span>
      </div>

      {result.quotationCount === 0 ? (
        <p className="mt-3 text-xs leading-relaxed text-ink-400">{describeState(state)}</p>
      ) : (
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {buildTiles(result, currency).map((tile) => (
            <div key={tile.label} className="rounded-lg border border-ink-800 p-3">
              <dt className="text-[11px] text-ink-400">{tile.label}</dt>
              <dd className="mt-1 text-sm font-medium tabular-nums text-ink-100">{tile.value}</dd>
              {tile.hint && <p className="mt-0.5 text-[10px] text-ink-500">{tile.hint}</p>}
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
