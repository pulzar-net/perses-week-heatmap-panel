import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { formatValue } from '@perses-dev/components';
import type { ReactElement } from 'react';
import { Fragment } from 'react';

import { buildGrid, DAYS, intensity, matrixOf } from './grid';
import type { PulzrWeekHeatmapPanelProps } from './pulzr-week-heatmap-panel-types';

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const hourLabel = (hour: number): string => `${String(hour).padStart(2, '0')}:00`;

export function PulzrWeekHeatmapPanelComponent({ queryResults, spec }: PulzrWeekHeatmapPanelProps): ReactElement {
  const theme = useTheme();
  const cells = queryResults.flatMap((result) => matrixOf(result.data));

  if (cells.length === 0) {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        <Typography color="text.secondary">No data</Typography>
      </Stack>
    );
  }

  const { rows, max } = buildGrid(cells, spec.max);
  const color = theme.palette.primary.main;
  const label = { color: 'text.secondary', fontSize: '0.75rem', lineHeight: 1 } as const;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto repeat(24, minmax(0, 1fr))',
        gridTemplateRows: 'auto repeat(7, minmax(0, 1fr))',
        gap: '2px',
        height: '100%',
        p: 1,
        boxSizing: 'border-box',
      }}
    >
      <Box />
      {HOURS.map((hour) => (
        <Box key={hour} sx={{ ...label, pb: 0.5, whiteSpace: 'nowrap', overflow: 'visible' }}>
          {hour % 3 === 0 ? hourLabel(hour) : null}
        </Box>
      ))}
      {DAYS.map((day, d) => (
        <Fragment key={day}>
          <Box sx={{ ...label, pr: 1, alignSelf: 'center' }}>{day.slice(0, 3)}</Box>
          {HOURS.map((hour) => {
            const cell = rows[d]![hour];
            if (!cell) return <Box key={hour} />;
            return (
              <Tooltip
                key={hour}
                title={`${day} ${hourLabel(hour)}: ${formatValue(cell.value, spec.format)}`}
                disableInteractive
              >
                <Box
                  sx={{
                    borderRadius: '2px',
                    bgcolor: `color-mix(in srgb, ${color} ${Math.round(intensity(cell.value, max) * 100)}%, transparent)`,
                  }}
                />
              </Tooltip>
            );
          })}
        </Fragment>
      ))}
    </Box>
  );
}
