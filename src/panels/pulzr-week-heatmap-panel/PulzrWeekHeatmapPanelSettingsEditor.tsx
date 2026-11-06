import { TextField } from '@mui/material';
import { FormatControls, OptionsEditorColumn, OptionsEditorGrid, OptionsEditorGroup } from '@perses-dev/components';
import type { OptionsEditorProps } from '@perses-dev/plugin-system';
import type { ReactElement } from 'react';

import type { PulzrWeekHeatmapPanelOptions } from './pulzr-week-heatmap-panel-types';

export function PulzrWeekHeatmapPanelSettingsEditor({
  value,
  onChange,
}: OptionsEditorProps<PulzrWeekHeatmapPanelOptions>): ReactElement {
  return (
    <OptionsEditorGrid>
      <OptionsEditorColumn>
        <OptionsEditorGroup title="Format">
          <FormatControls
            value={value.format ?? { unit: 'decimal' }}
            onChange={(format) => onChange({ ...value, format })}
          />
        </OptionsEditorGroup>
      </OptionsEditorColumn>
      <OptionsEditorColumn>
        <OptionsEditorGroup title="Scale">
          <TextField
            size="small"
            type="number"
            label="Max"
            helperText="Drawn in full color. Empty: the largest value."
            value={value.max ?? ''}
            slotProps={{ htmlInput: { min: 0 } }}
            onChange={(e) => {
              const max = Number(e.target.value);
              onChange({ ...value, max: e.target.value !== '' && max > 0 ? max : undefined });
            }}
          />
        </OptionsEditorGroup>
      </OptionsEditorColumn>
    </OptionsEditorGrid>
  );
}
