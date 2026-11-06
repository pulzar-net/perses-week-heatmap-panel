import type { FormatOptions } from '@perses-dev/components';
import type { PanelProps } from '@perses-dev/plugin-system';
import type { TimeSeriesData } from '@perses-dev/spec';

/** One hour of the week, as a datasource gives it in `metadata.matrix`. */
export interface WeekCell {
  /** ISO weekday: 1 is Monday, 7 is Sunday. */
  dow: number;
  /** 0 to 23. */
  hour: number;
  value: number;
  /** How many readings the value was made from. */
  samples?: number;
}

export interface PulzrWeekHeatmapPanelOptions {
  format?: FormatOptions;
  /** The value drawn in full color, instead of the largest one. */
  max?: number;
}

export type PulzrWeekHeatmapPanelProps = PanelProps<PulzrWeekHeatmapPanelOptions, TimeSeriesData>;
