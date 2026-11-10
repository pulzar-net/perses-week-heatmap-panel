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
  /** A second measure of the hour, such as the average officers on shift, drawn as a bar along the cell's foot. */
  overlay?: number;
}

export interface PulzrWeekHeatmapPanelOptions {
  format?: FormatOptions;
  /** The value drawn in full color, instead of the largest one. */
  max?: number;
  /** The cells' color, any CSS color, instead of the theme's primary color. */
  color?: string;
  /** The opacity of the smallest value above zero, from 0 to 1; a cell reads `floor + (1 - floor) × value / max`. */
  floor?: number;
  /** Hour labels as `00:00` (the default) or `12a`, `3a`, … */
  hours?: '24h' | '12h';
  /** Draws each cell's `overlay` as a bar along its foot, scaled to the largest overlay. */
  overlay?: { label?: string; format?: FormatOptions };
  /** Hatches the cells with a value above zero and no overlay. */
  mark?: { label?: string };
  /** A legend under the grid, the value's swatch labelled `value`. */
  legend?: { value?: string };
  /** A fixed cell height in pixels, instead of rows sharing the panel's height. */
  cellHeight?: number;
}

export type PulzrWeekHeatmapPanelProps = PanelProps<PulzrWeekHeatmapPanelOptions, TimeSeriesData>;
