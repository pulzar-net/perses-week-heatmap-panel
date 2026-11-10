import { buildGrid, cellTitle, hourLabel, intensity, matrixOf } from './grid';

describe('matrixOf', () => {
  it('reads metadata.matrix and leaves out malformed cells', () => {
    const data = {
      series: [],
      metadata: {
        matrix: [
          { dow: 1, hour: 0, value: 3, samples: 4 },
          { dow: 0, hour: 5, value: 1 },
          { dow: 8, hour: 5, value: 1 },
          { dow: 2, hour: 24, value: 1 },
          { dow: 2, hour: 1.5, value: 1 },
          { dow: 3, hour: 5, value: null },
          { dow: 3, hour: 5, value: Number.NaN },
          null,
          { dow: 7, hour: 23, value: 0 },
        ],
      },
    };
    expect(matrixOf(data)).toEqual([
      { dow: 1, hour: 0, value: 3, samples: 4 },
      { dow: 7, hour: 23, value: 0 },
    ]);
  });

  it('keeps a numeric overlay and leaves out a cell whose overlay is malformed', () => {
    const data = {
      series: [],
      metadata: {
        matrix: [
          { dow: 1, hour: 9, value: 12, overlay: 1.5 },
          { dow: 1, hour: 10, value: 3, overlay: 'two' },
          { dow: 1, hour: 11, value: 3, overlay: Number.POSITIVE_INFINITY },
        ],
      },
    };
    expect(matrixOf(data)).toEqual([{ dow: 1, hour: 9, value: 12, overlay: 1.5 }]);
  });

  it('has nothing without a matrix', () => {
    expect(matrixOf(undefined)).toEqual([]);
    expect(matrixOf({ series: [] })).toEqual([]);
    expect(matrixOf({ series: [], metadata: { matrix: 'no' } })).toEqual([]);
  });
});

describe('buildGrid', () => {
  it('lays cells out Monday to Sunday by hour, blank where there is none', () => {
    const grid = buildGrid([
      { dow: 1, hour: 0, value: 2 },
      { dow: 7, hour: 23, value: 8 },
      { dow: 3, hour: 12, value: 5 },
    ]);
    expect(grid.rows).toHaveLength(7);
    expect(grid.rows.every((row) => row.length === 24)).toBe(true);
    expect(grid.rows[0]![0]?.value).toBe(2);
    expect(grid.rows[6]![23]?.value).toBe(8);
    expect(grid.rows[2]![12]?.value).toBe(5);
    expect(grid.rows.flat().filter((c) => c !== null)).toHaveLength(3);
    expect(grid.max).toBe(8);
  });

  it('keeps the last of a cell given twice', () => {
    expect(
      buildGrid([
        { dow: 2, hour: 9, value: 1 },
        { dow: 2, hour: 9, value: 4 },
      ]).rows[1]![9]?.value,
    ).toBe(4);
  });

  it('scales to max when it is set above zero', () => {
    const cells = [{ dow: 1, hour: 1, value: 40 }];
    expect(buildGrid(cells, 100).max).toBe(100);
    expect(buildGrid(cells, 0).max).toBe(40);
    expect(buildGrid(cells, -5).max).toBe(40);
    expect(buildGrid([]).max).toBe(0);
  });

  it('finds the largest overlay, 0 when there is none', () => {
    expect(
      buildGrid([
        { dow: 1, hour: 1, value: 1, overlay: 2 },
        { dow: 1, hour: 2, value: 1, overlay: 0.5 },
        { dow: 1, hour: 3, value: 1 },
      ]).overlay,
    ).toBe(2);
    expect(buildGrid([{ dow: 1, hour: 1, value: 1 }]).overlay).toBe(0);
  });
});

describe('intensity', () => {
  it('runs from 0 to 1 over the scale, clamped', () => {
    expect(intensity(0, 10)).toBe(0);
    expect(intensity(5, 10)).toBe(0.5);
    expect(intensity(10, 10)).toBe(1);
    expect(intensity(15, 10)).toBe(1);
    expect(intensity(-3, 10)).toBe(0);
  });

  it('is 0 when there is no scale', () => {
    expect(intensity(5, 0)).toBe(0);
  });

  it('starts values above zero at the floor', () => {
    expect(intensity(0, 10, 0.12)).toBe(0);
    expect(intensity(-1, 10, 0.12)).toBe(0);
    expect(intensity(5, 10, 0.12)).toBeCloseTo(0.56);
    expect(intensity(10, 10, 0.12)).toBe(1);
    expect(intensity(20, 10, 0.12)).toBe(1);
  });
});

describe('hourLabel', () => {
  it('reads 00:00 by default', () => {
    expect(hourLabel(0)).toBe('00:00');
    expect(hourLabel(9, '24h')).toBe('09:00');
    expect(hourLabel(21)).toBe('21:00');
  });

  it('reads 12a to 11p in 12-hour form', () => {
    expect([0, 3, 6, 9, 12, 15, 18, 21, 23].map((h) => hourLabel(h, '12h'))).toEqual([
      '12a',
      '3a',
      '6a',
      '9a',
      '12p',
      '3p',
      '6p',
      '9p',
      '11p',
    ]);
  });
});

describe('cellTitle', () => {
  it('gives the day, hour and value', () => {
    expect(cellTitle({ dow: 3, hour: 14, value: 42 }, {})).toBe('Wed 14:00 · 42');
    expect(cellTitle({ dow: 7, hour: 0, value: 0.5 }, { hours: '12h', format: { unit: 'percent-decimal' } })).toBe(
      'Sun 12a · 50%',
    );
  });

  it('adds the overlay, formatted and labelled in lower case', () => {
    const spec = {
      hours: '12h',
      format: { unit: 'decimal', decimalPlaces: 0 },
      overlay: { label: 'Officers', format: { unit: 'decimal', decimalPlaces: 1 } },
    } as const;
    expect(cellTitle({ dow: 1, hour: 9, value: 12, overlay: 1.5 }, spec)).toBe('Mon 9a · 12 · 1.5 officers');
    expect(cellTitle({ dow: 1, hour: 9, value: 12 }, spec)).toBe('Mon 9a · 12 · 0.0 officers');
    expect(cellTitle({ dow: 1, hour: 9, value: 12, overlay: 2 }, { overlay: {} })).toBe('Mon 09:00 · 12 · 2');
  });
});
