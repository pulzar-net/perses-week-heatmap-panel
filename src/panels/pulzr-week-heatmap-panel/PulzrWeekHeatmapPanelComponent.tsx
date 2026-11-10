import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import type { ReactElement } from 'react';
import { Fragment } from 'react';

import { buildGrid, cellTitle, DAYS, hourLabel, intensity, matrixOf } from './grid';
import type { PulzrWeekHeatmapPanelProps } from './pulzr-week-heatmap-panel-types';

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const mix = (color: string, share: number): string =>
  `color-mix(in srgb, ${color} ${Math.round(share * 100)}%, transparent)`;

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

  const { rows, max, overlay: topOverlay } = buildGrid(cells, spec.max);
  const color = spec.color || theme.palette.primary.main;
  const floor = spec.floor ?? 0;
  const empty = theme.palette.action.hover;
  const error = theme.palette.error.main;
  const bar = { height: '3px', borderRadius: '1px', bgcolor: 'text.primary', opacity: 0.7 } as const;
  const hatch = {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '2px',
    boxShadow: `inset 0 0 0 1.5px ${error}`,
    background: 'repeating-linear-gradient(135deg, transparent 0 3px, rgba(255, 255, 255, 0.45) 3px 4px)',
  } as const;
  const swatch = { width: '10px', height: '8px', borderRadius: '2px', flex: 'none' } as const;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: spec.cellHeight ? undefined : '100%',
        overflowX: 'auto',
        p: 1,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '34px repeat(24, minmax(14px, 1fr))',
          gridTemplateRows: `auto repeat(7, ${spec.cellHeight ? `${spec.cellHeight}px` : 'minmax(0, 1fr)'})`,
          gap: '2px',
          minWidth: '420px',
          flex: spec.cellHeight ? 'none' : 1,
          minHeight: 0,
        }}
      >
        <Box />
        {HOURS.map((hour) => (
          <Box key={hour} sx={{ fontSize: '9.5px', color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {hour % 3 === 0 ? hourLabel(hour, spec.hours) : null}
          </Box>
        ))}
        {DAYS.map((day, d) => (
          <Fragment key={day}>
            <Box sx={{ alignSelf: 'center', fontSize: '10.5px', fontWeight: 600, color: 'text.secondary' }}>
              {day.slice(0, 3)}
            </Box>
            {HOURS.map((hour) => {
              const cell = rows[d]![hour];
              if (!cell) return <Box key={hour} />;
              const shift = cell.overlay ?? 0;
              const marked = spec.mark !== undefined && cell.value > 0 && shift <= 0;
              return (
                <Tooltip key={hour} title={cellTitle(cell, spec)} disableInteractive>
                  <Box
                    data-marked={marked || undefined}
                    sx={{
                      position: 'relative',
                      borderRadius: '2px',
                      bgcolor: cell.value > 0 ? mix(color, intensity(cell.value, max, floor)) : empty,
                      '&::after': marked ? hatch : undefined,
                    }}
                  >
                    {spec.overlay && shift > 0 && topOverlay > 0 ? (
                      <Box
                        data-overlay
                        sx={{
                          ...bar,
                          position: 'absolute',
                          left: '2px',
                          bottom: '2px',
                          maxWidth: 'calc(100% - 4px)',
                          width: `${Math.max(12, (shift / topOverlay) * 100)}%`,
                        }}
                      />
                    ) : null}
                  </Box>
                </Tooltip>
              );
            })}
          </Fragment>
        ))}
      </Box>
      {spec.legend ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px 12px',
            mt: '8px',
            fontSize: '10.5px',
            color: 'text.secondary',
            '& > span': { display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' },
          }}
        >
          <span>
            <Box
              component="i"
              sx={{ ...swatch, width: '28px', background: `linear-gradient(90deg, ${mix(color, floor)}, ${color})` }}
            />
            {spec.legend.value}
          </span>
          {spec.overlay ? (
            <span>
              <Box component="i" sx={{ ...swatch, ...bar }} />
              {spec.overlay.label}
            </span>
          ) : null}
          {spec.mark ? (
            <span>
              <Box
                component="i"
                sx={{
                  ...swatch,
                  boxShadow: `inset 0 0 0 1.5px ${error}`,
                  background: `repeating-linear-gradient(135deg, ${empty} 0 2px, transparent 2px 3px)`,
                }}
              />
              {spec.mark.label}
            </span>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}
