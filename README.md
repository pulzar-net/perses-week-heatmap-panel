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
- Hovering a cell shows its day, hour and value, formatted by `format` (any Perses format: `decimal`, `percent`, bytes, time and the rest).
- "No data" shows when no query gives a matrix.

The panel reads `metadata.matrix` from each query result: a list of `{dow, hour, value, samples}`, with `dow` the ISO weekday (1 is Monday, 7 is Sunday) and `hour` 0 to 23. The [Pulzr Net datasource](https://github.com/pulzar-net/perses-pulzr-datasource) returns it for `PulzrMetricQuery` with `metric: occupancyByHour`. A cell given twice, by two queries, keeps the last.

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
