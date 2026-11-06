import { buildGrid, intensity, matrixOf } from './grid';

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
});
