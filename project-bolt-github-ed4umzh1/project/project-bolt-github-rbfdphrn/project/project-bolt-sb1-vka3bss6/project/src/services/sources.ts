import { PRICE_SOURCES } from '@/data/sources';
import type { Metal, PriceSource, SourceStatus } from '@/types/market';

export interface SourceStatusRow {
  id: string;
  status: SourceStatus;
  lastSuccessAt: number | null;
  lastError: string | null;
}

export interface SourceIntegration extends PriceSource {
  status: SourceStatus;
  lastSuccessAt: number | null;
  lastError: string | null;
}

export const SOURCE_STATUS_LABELS: Record<SourceStatus, string> = {
  pending: 'Не подключён',
  connected: 'Подключён',
  error: 'Ошибка',
  unavailable: 'Недоступен',
};

export function buildSourceIntegrations(rows: SourceStatusRow[] | null): SourceIntegration[] {
  const rowById = new Map((rows ?? []).map((row) => [row.id, row]));

  return PRICE_SOURCES.map((source) => {
    const row = rowById.get(source.id);
    return {
      ...source,
      status: row?.status ?? (source.url ? 'pending' : 'unavailable'),
      lastSuccessAt: row?.lastSuccessAt ?? null,
      lastError: row?.lastError ?? null,
    };
  });
}

export function getSourcesForMetal(metal: Metal, sources: SourceIntegration[]): SourceIntegration[] {
  return sources.filter((source) => metal.marketTypes.includes(source.marketType));
}
