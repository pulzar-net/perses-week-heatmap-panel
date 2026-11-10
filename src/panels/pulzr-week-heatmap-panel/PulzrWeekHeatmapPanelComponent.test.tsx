import { render, screen } from '@testing-library/react';

import type { PulzrWeekHeatmapPanelProps } from './pulzr-week-heatmap-panel-types';
import { PulzrWeekHeatmapPanelComponent } from './PulzrWeekHeatmapPanelComponent';

const draw = (matrix: unknown[], spec: PulzrWeekHeatmapPanelProps['spec']): HTMLElement => {
  const props = { spec, queryResults: [{ data: { series: [], metadata: { matrix } } }] };
  return render(<PulzrWeekHeatmapPanelComponent {...(props as unknown as PulzrWeekHeatmapPanelProps)} />).container;
};

const coverage = [
  { dow: 1, hour: 9, value: 12, overlay: 2 },
  { dow: 1, hour: 10, value: 4, overlay: 0.1 },
  { dow: 2, hour: 3, value: 5, overlay: 0 },
  { dow: 2, hour: 4, value: 0, overlay: 0 },
];

describe('PulzrWeekHeatmapPanelComponent', () => {
  it('says so when there is no matrix', () => {
    draw([], {});
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('labels hours in 24-hour form by default, without bars, hatches or legend', () => {
    const view = draw(coverage, {});
    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(view.querySelectorAll('[data-overlay]')).toHaveLength(0);
    expect(view.querySelectorAll('[data-marked]')).toHaveLength(0);
    expect(screen.queryByText('Violations')).not.toBeInTheDocument();
  });

  it('draws the coverage grid: 12-hour labels, overlay bars, hatches and a legend', () => {
    const view = draw(coverage, {
      hours: '12h',
      overlay: { label: 'Officers on shift' },
      mark: { label: 'Violations, no one on patrol' },
      legend: { value: 'Violations' },
      cellHeight: 22,
    });
    expect(screen.getByText('12a')).toBeInTheDocument();
    expect(screen.getByText('3p')).toBeInTheDocument();
    const bars = [...view.querySelectorAll<HTMLElement>('[data-overlay]')];
    expect(bars).toHaveLength(2);
    expect(getComputedStyle(bars[0]!).width).toBe('100%');
    expect(getComputedStyle(bars[1]!).width).toBe('12%');
    expect(view.querySelectorAll('[data-marked]')).toHaveLength(1);
    expect(screen.getByText('Violations')).toBeInTheDocument();
    expect(screen.getByText('Officers on shift')).toBeInTheDocument();
    expect(screen.getByText('Violations, no one on patrol')).toBeInTheDocument();
  });
});
