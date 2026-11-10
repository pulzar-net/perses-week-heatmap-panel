# Week heatmap panel for Perses

`PulzrWeekHeatmapPanel` draws a value by weekday and hour: seven rows, Monday to Sunday, of 24 hours each, such as a parking lot's occupancy by hour of the week.

```yaml
kind: Panel
spec:
  plugin:
    kind: PulzrWeekHeatmapPanel
    spec:
      format: { unit: percent, decimalPlaces: 0 }
      max: 100
```

- Each cell is colored from transparent to the dashboard theme's primary color, scaled to the largest value, or to `max` when it is set. Hours with no value are left blank.
- Hovering a cell shows its day, hour and value, formatted by `format` (any Perses format: `decimal`, `percent`, bytes, time and the rest), such as `Mon 09:00 · 12`.
- "No data" shows when no query gives a matrix.

### Options

All are optional.

| Option | What it does |
| --- | --- |
| `format` | How values read in the tooltip. |
| `max` | The value drawn in full color, instead of the largest one. |
| `color` | The cells' color, any CSS color (`#c026d3`, `rgb(192, 38, 211)`), instead of the theme's primary color. |
| `emptyColor` | The color of a cell of nothing, any CSS color, instead of the theme's hover shade. |
| `floor` | 0 to 1: the opacity of the smallest value above zero, so a cell reads `floor + (1 - floor) × value / max`. Zero stays empty. |
| `hours` | `24h` (the default) labels every third hour `00:00`, `03:00`, …; `12h` labels them `12a`, `3a`, `6a`, `9a`, `12p`, `3p`, … |
| `overlay` | `{label, format}`: draws each cell's `overlay` as a bar along its foot, scaled to the largest overlay, and adds it to the tooltip, formatted by `format` and followed by `label` in lower case: `Mon 9a · 12 · 1.5 officers`. |
| `mark` | `{label}`: hatches the cells with a value above zero and an overlay of 0 (or none), outlined in the theme's error color. Meant for use with `overlay`. |
| `legend` | `{value}`: a legend under the grid: the value's color scale labelled `value`, and, when they are set, the overlay's bar and the hatch, labelled by their `label`s. |
| `cellHeight` | A fixed cell height in pixels. Without it, the rows share the panel's height. |

An enforcement coverage grid, violations by hour with the officers on shift:

```yaml
kind: PulzrWeekHeatmapPanel
spec:
  format: { unit: decimal, decimalPlaces: 0 }
  color: 'rgb(192, 38, 211)'
  floor: 0.12
  hours: 12h
  overlay: { label: Officers on shift, format: { unit: decimal, decimalPlaces: 1 } }
  mark: { label: 'Violations, no one on patrol' }
  legend: { value: Violations }
  cellHeight: 22
```

### Data

The panel reads `metadata.matrix` from each query result: a list of `{dow, hour, value, samples, overlay}`, with `dow` the ISO weekday (1 is Monday, 7 is Sunday), `hour` 0 to 23, and `samples` and `overlay` optional. `overlay` is a second measure of the hour, such as the average officers on shift. The [Pulzr Net datasource](https://github.com/pulzar-net/perses-pulzr-datasource) returns it for `PulzrMetricQuery` with `metric: occupancyByHour`. A cell given twice, by two queries, keeps the last.

## Install

Put the archive (`PulzrWeekHeatmapPanel-<version>.tar.gz`, from the releases) in a folder listed in the Perses server's `plugin.archive_paths`, or `npm install @pulzr/perses-week-heatmap-panel` to embed it.

## Development

```bash
npm install
npm test
percli plugin test-schemas
npm run build
percli plugin build
```

### Releasing

Set the new version in `package.json`, commit, then tag and push it:

```bash
git tag v0.2.0 && git push origin v0.2.0
```

The Release workflow tests and builds, publishes the package to npm with provenance, and attaches the Perses plugin archive and the npm tarball to a GitHub release.

## License

Apache 2.0
