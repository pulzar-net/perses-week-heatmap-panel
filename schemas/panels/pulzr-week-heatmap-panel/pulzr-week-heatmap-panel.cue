package model

import (
	"github.com/perses/shared/cue/common"
)

kind: "PulzrWeekHeatmapPanel"
spec: close({
	format?: common.#format
	// The value drawn in full color, instead of the largest one.
	max?: number & >0
	// The cells' color, any CSS color, instead of the theme's primary color.
	color?: string & !=""
	emptyColor?: string & !=""
	// The opacity of the smallest value above zero: a cell reads floor + (1 - floor) × value / max.
	floor?: number & >=0 & <=1
	// Hour labels as 00:00 (the default) or 12a, 3a, …
	hours?: "24h" | "12h"
	// Draws each cell's overlay as a bar along its foot, scaled to the largest overlay.
	overlay?: close({
		label?:  string
		format?: common.#format
	})
	// Hatches the cells with a value above zero and no overlay.
	mark?: close({
		label?: string
	})
	// A legend under the grid.
	legend?: close({
		value?: string
	})
	// A fixed cell height in pixels, instead of rows sharing the panel's height.
	cellHeight?: number & >0
})
