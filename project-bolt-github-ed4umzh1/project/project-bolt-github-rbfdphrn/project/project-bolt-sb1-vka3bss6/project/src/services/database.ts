import { supabase } from '@/lib/supabase';
import type { CurrencyCode, DataStatus, MarketType, PriceQuoteRecord, SourceStatus } from '@/types/market';
import type { SourceStatusRow } from '@/services/sources';

export interface UpdateLogRow {
  id: string;
  job: string;
  sourceId: string | null;
  status: 'started' | 'success' | 'error';
  startedAt: number;
  finishedAt: number | null;
  rowsWritten: number;
  message: string;
}

export interface QualityRecordRow {
  id: string;
  sourceId: string | null;
  metalId: string | null;
  checkName: string;
  result: 'pass' | 'warn' | 'fail';
  details: string;
  checkedAt: number;
}

type Row = Record<string, unknown>;

function getClient() {
  if (!supabase) throw new Error('Подключение к базе данных не настроено.');
  return supabase;
}

function fail(message: string | undefined): never {
  throw new Error(message ?? 'Неизвестная ошибка базы данных.');
}

function asString(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Неожиданный формат данных.');
  return value;
}

function asNumber(value: unknown): number {
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (typeof parsed !== 'number' || !Number.isFinite(parsed)) throw new Error('Неожиданный формат данных.');
  return parsed;
}

function asTimestamp(value: unknown): number {
  const parsed = Date.parse(asString(value));
  if (Number.isNaN(parsed)) throw new Error('Неожиданный формат даты.');
  return parsed;
}

function asNullableTimestamp(value: unknown): number | null {
  return value === null || value === undefined ? null : asTimestamp(value);
}

function asNullableString(value: unknown): string | null {
  return value === null || value === undefined ? null : asString(value);
}

function asArray(data: unknown): Row[] {
  if (!Array.isArray(data)) throw new Error('Неожиданный формат ответа базы данных.');
  return data as Row[];
}

export async function testConnection(): Promise<void> {
  const { error } = await getClient()
    .from('data_sources')
    .select('id', { count: 'exact', head: true });
  if (error) fail(error.message);
}

export async function fetchSourceRows(): Promise<SourceStatusRow[]> {
  const { data, error } = await getClient()
    .from('data_sources')
    .select('id, status, last_success_at, last_error');
  if (error) fail(error.message);

  return asArray(data).map((row) => ({
    id: asString(row.id),
    status: asString(row.status) as SourceStatus,
    lastSuccessAt: asNullableTimestamp(row.last_success_at),
    lastError: asNullableString(row.last_error),
  }));
}

export async function fetchUpdateLogs(limit = 10): Promise<UpdateLogRow[]> {
  const { data, error } = await getClient()
    .from('update_logs')
    .select('id, job, source_id, status, started_at, finished_at, rows_written, message')
    .order('started_at', { ascending: false })
    .limit(limit);
  if (error) fail(error.message);

  return asArray(data).map((row) => ({
    id: asString(row.id),
    job: asString(row.job),
    sourceId: asNullableString(row.source_id),
    status: asString(row.status) as UpdateLogRow['status'],
    startedAt: asTimestamp(row.started_at),
    finishedAt: asNullableTimestamp(row.finished_at),
    rowsWritten: asNumber(row.rows_written),
    message: asString(row.message),
  }));
}

export async function fetchQualityRecords(limit = 10): Promise<QualityRecordRow[]> {
  const { data, error } = await getClient()
    .from('data_quality_records')
    .select('id, source_id, metal_id, check_name, result, details, checked_at')
    .order('checked_at', { ascending: false })
    .limit(limit);
  if (error) fail(error.message);

  return asArray(data).map((row) => ({
    id: asString(row.id),
    sourceId: asNullableString(row.source_id),
    metalId: asNullableString(row.metal_id),
    checkName: asString(row.check_name),
    result: asString(row.result) as QualityRecordRow['result'],
    details: asString(row.details),
    checkedAt: asTimestamp(row.checked_at),
  }));
}

export async function fetchQuotationRecords(metalId: string): Promise<PriceQuoteRecord[]> {
  const { data, error } = await getClient()
    .from('price_quotations')
    .select(
      'metal_id, price, currency, unit, region, market_type, quality_score, data_status, quoted_at, retrieved_at, data_sources(name, url)'
    )
    .eq('metal_id', metalId)
    .order('quoted_at', { ascending: false })
    .limit(500);
  if (error) fail(error.message);

  return asArray(data).map((row) => {
    const source = row.data_sources as Row | null;
    if (!source || typeof source !== 'object') throw new Error('Неожиданный формат данных источника.');
    return {
      sourceName: asString(source.name),
      sourceUrl: asString(source.url),
      metalId: asString(row.metal_id),
      price: asNumber(row.price),
      currency: asString(row.currency) as CurrencyCode,
      unit: asString(row.unit),
      marketType: asString(row.market_type) as MarketType,
      region: asString(row.region),
      timestamp: asTimestamp(row.quoted_at),
      retrievedAt: asTimestamp(row.retrieved_at),
      dataStatus: asString(row.data_status) as DataStatus,
      qualityScore: asNumber(row.quality_score),
    };
  });
}
