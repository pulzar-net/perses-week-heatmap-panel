import type { PanelPlugin } from '@perses-dev/plugin-system';

import type { PulzrWeekHeatmapPanelOptions, PulzrWeekHeatmapPanelProps } from './pulzr-week-heatmap-panel-types';
import { PulzrWeekHeatmapPanelComponent } from './PulzrWeekHeatmapPanelComponent';
import { PulzrWeekHeatmapPanelSettingsEditor } from './PulzrWeekHeatmapPanelSettingsEditor';

export const PulzrWeekHeatmapPanel: PanelPlugin<PulzrWeekHeatmapPanelOptions, PulzrWeekHeatmapPanelProps> = {
  PanelComponent: PulzrWeekHeatmapPanelComponent,
  panelOptionsEditorComponents: [{ label: 'Settings', content: PulzrWeekHeatmapPanelSettingsEditor }],
  supportedQueryTypes: ['TimeSeriesQuery'],
  createInitialOptions: () => ({}),
};
