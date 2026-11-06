import type { TimeSeriesData } from '@perses-dev/spec';

import type { WeekCell } from './pulzr-week-heatmap-panel-types';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

/** Seven rows, Monday first, of 24 hours each; `null` where there is no value. */
export interface WeekGrid {
  rows: Array<Array<WeekCell | null>>;
  /** The value drawn in full color. */
  max: number;
}

const isCell = (c: unknown): c is WeekCell => {
  if (typeof c !== 'object' || c === null) return false;
  const { dow, hour, value } = c as Partial<WeekCell>;
  return (
    Number.isInteger(dow) &&
    dow! >= 1 &&
    dow! <= 7 &&
    Number.isInteger(hour) &&
    hour! >= 0 &&
    hour! <= 23 &&
    typeof value === 'number' &&
    Number.isFinite(value)
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
  return { rows, max: max !== undefined && max > 0 ? max : largest };
}

/** How strongly a value is colored, from 0 to 1. */
export function intensity(value: number, max: number): number {
  if (!(max > 0) || value <= 0) return 0;
  return Math.min(value / max, 1);
}
