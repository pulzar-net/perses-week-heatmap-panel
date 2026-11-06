package model

import (
	"github.com/perses/shared/cue/common"
)

kind: "PulzrWeekHeatmapPanel"
spec: close({
	format?: common.#format
	// The value drawn in full color, instead of the largest one.
	max?: number & >0
})
