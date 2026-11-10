import { formatValue } from '@perses-dev/components';
import type { TimeSeriesData } from '@perses-dev/spec';

import type { PulzrWeekHeatmapPanelOptions, WeekCell } from './pulzr-week-heatmap-panel-types';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

/** Seven rows, Monday first, of 24 hours each; `null` where there is no value. */
export interface WeekGrid {
  rows: Array<Array<WeekCell | null>>;
  /** The value drawn in full color. */
  max: number;
  /** The largest overlay, drawn as a full-width bar; 0 when there is none. */
  overlay: number;
}

const isCell = (c: unknown): c is WeekCell => {
  if (typeof c !== 'object' || c === null) return false;
  const { dow, hour, value, overlay } = c as Partial<WeekCell>;
  return (
    Number.isInteger(dow) &&
    dow! >= 1 &&
    dow! <= 7 &&
    Number.isInteger(hour) &&
    hour! >= 0 &&
    hour! <= 23 &&
    typeof value === 'number' &&
    Number.isFinite(value) &&
    (overlay === undefined || (typeof overlay === 'number' && Number.isFinite(overlay)))
  );
};

/** The cells a query result carries in `metadata.matrix`, leaving out any that are malformed. */
export function matrixOf(data: TimeSeriesData | undefined): WeekCell[] {
  const matrix = (data?.metadata as { matrix?: unknown } | undefined)?.matrix;
  return Array.isArray(matrix) ? matrix.filter(isCell) : [];
}

/**
 * Lays cells out by weekday and hour. A cell given twice keeps the last. The scale runs to `max` when it is
 * above zero, else to the largest value.
 */
export function buildGrid(cells: WeekCell[], max?: number): WeekGrid {
  const rows = DAYS.map(() => Array.from<WeekCell | null>({ length: 24 }).fill(null));
  for (const cell of cells) rows[cell.dow - 1]![cell.hour] = cell;
  const largest = cells.reduce((m, c) => Math.max(m, c.value), 0);
  const overlay = cells.reduce((m, c) => Math.max(m, c.overlay ?? 0), 0);
  return { rows, max: max !== undefined && max > 0 ? max : largest, overlay };
}

/** How strongly a value is colored, from 0 to 1: `floor` for the smallest value above zero, 0 for none. */
export function intensity(value: number, max: number, floor = 0): number {
  if (!(max > 0) || value <= 0) return 0;
  return floor + (1 - floor) * Math.min(value / max, 1);
}

/** An hour as `09:00`, or in 12-hour form as `9a`, `12p`, `3p`. */
export function hourLabel(hour: number, hours: PulzrWeekHeatmapPanelOptions['hours'] = '24h'): string {
  if (hours === '24h') return `${String(hour).padStart(2, '0')}:00`;
  if (hour === 0 || hour === 12) return hour === 0 ? '12a' : '12p';
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

/** A cell's tooltip: `Mon 9a · 12 · 1.5 officers`. */
export function cellTitle(cell: WeekCell, spec: PulzrWeekHeatmapPanelOptions): string {
  const parts = [
    `${DAYS[cell.dow - 1]!.slice(0, 3)} ${hourLabel(cell.hour, spec.hours)}`,
    formatValue(cell.value, spec.format),
  ];
  if (spec.overlay) {
    const label = spec.overlay.label ? ` ${spec.overlay.label.toLowerCase()}` : '';
    parts.push(`${formatValue(cell.overlay ?? 0, spec.overlay.format)}${label}`);
  }
  return parts.join(' · ');
}
