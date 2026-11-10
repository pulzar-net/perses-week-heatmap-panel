import { FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';
import { FormatControls, OptionsEditorColumn, OptionsEditorGrid, OptionsEditorGroup } from '@perses-dev/components';
import type { OptionsEditorProps } from '@perses-dev/plugin-system';
import type { ReactElement } from 'react';

import type { PulzrWeekHeatmapPanelOptions } from './pulzr-week-heatmap-panel-types';

/** A number field's value, or undefined when it is empty or fails `ok`. */
const numberOf = (text: string, ok: (n: number) => boolean): number | undefined => {
  const n = Number(text);
  return text !== '' && ok(n) ? n : undefined;
};

export function PulzrWeekHeatmapPanelSettingsEditor({
  value,
  onChange,
}: OptionsEditorProps<PulzrWeekHeatmapPanelOptions>): ReactElement {
  const set = (patch: Partial<PulzrWeekHeatmapPanelOptions>): void => onChange({ ...value, ...patch });
  return (
    <OptionsEditorGrid>
      <OptionsEditorColumn>
        <OptionsEditorGroup title="Format">
          <FormatControls value={value.format ?? { unit: 'decimal' }} onChange={(format) => set({ format })} />
        </OptionsEditorGroup>
        <OptionsEditorGroup title="Overlay">
          <FormControlLabel
            label="Bar along each cell's foot"
            control={
              <Switch
                checked={value.overlay !== undefined}
                onChange={(_, on) => set({ overlay: on ? {} : undefined, mark: on ? value.mark : undefined })}
              />
            }
          />
          {value.overlay ? (
            <>
              <TextField
                size="small"
                label="Label"
                helperText="In the legend and, in lower case, the tooltip."
                value={value.overlay.label ?? ''}
                onChange={(e) => set({ overlay: { ...value.overlay, label: e.target.value || undefined } })}
              />
              <FormatControls
                value={value.overlay.format ?? { unit: 'decimal' }}
                onChange={(format) => set({ overlay: { ...value.overlay, format } })}
              />
              <FormControlLabel
                label="Hatch cells with a value and no overlay"
                control={
                  <Switch checked={value.mark !== undefined} onChange={(_, on) => set({ mark: on ? {} : undefined })} />
                }
              />
              {value.mark ? (
                <TextField
                  size="small"
                  label="Hatch label"
                  value={value.mark.label ?? ''}
                  onChange={(e) => set({ mark: { label: e.target.value || undefined } })}
                />
              ) : null}
            </>
          ) : null}
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
            onChange={(e) => set({ max: numberOf(e.target.value, (n) => n > 0) })}
          />
          <TextField
            size="small"
            type="number"
            label="Floor"
            helperText="Opacity of the smallest value above zero, 0 to 1."
            value={value.floor ?? ''}
            slotProps={{ htmlInput: { min: 0, max: 1, step: 0.01 } }}
            onChange={(e) => set({ floor: numberOf(e.target.value, (n) => n >= 0 && n <= 1) })}
          />
          <TextField
            size="small"
            label="Color"
            helperText="Any CSS color. Empty: the theme's primary color."
            value={value.color ?? ''}
            onChange={(e) => set({ color: e.target.value || undefined })}
          />
        </OptionsEditorGroup>
        <OptionsEditorGroup title="Layout">
          <TextField
            select
            size="small"
            label="Hours"
            value={value.hours ?? '24h'}
            onChange={(e) => set({ hours: e.target.value === '12h' ? '12h' : undefined })}
          >
            <MenuItem value="24h">00:00, 03:00, …</MenuItem>
            <MenuItem value="12h">12a, 3a, …</MenuItem>
          </TextField>
          <TextField
            size="small"
            type="number"
            label="Cell height (px)"
            helperText="Empty: rows share the panel's height."
            value={value.cellHeight ?? ''}
            slotProps={{ htmlInput: { min: 1 } }}
            onChange={(e) => set({ cellHeight: numberOf(e.target.value, (n) => n > 0) })}
          />
          <FormControlLabel
            label="Legend"
            control={
              <Switch checked={value.legend !== undefined} onChange={(_, on) => set({ legend: on ? {} : undefined })} />
            }
          />
          {value.legend ? (
            <TextField
              size="small"
              label="Value label"
              value={value.legend.value ?? ''}
              onChange={(e) => set({ legend: { value: e.target.value || undefined } })}
            />
          ) : null}
        </OptionsEditorGroup>
      </OptionsEditorColumn>
    </OptionsEditorGrid>
  );
}
