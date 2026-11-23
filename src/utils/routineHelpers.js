// Total workout time in seconds: every round, plus a rest BETWEEN rounds
// (no rest after the last round). Inputs may be text from form fields, so Number() converts them.
export function calculateTotalSeconds(rounds, roundSeconds, restSeconds) {
  const roundCount = Number(rounds) || 0
  const work = roundCount * (Number(roundSeconds) || 0)
  const rest = Math.max(roundCount - 1, 0) * (Number(restSeconds) || 0)
  return work + rest
}

// Turns seconds into m:ss text, e.g. 660 -> "11:00"
export function formatDuration(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

// Which drill id goes with a round? The drills take turns and start over when the list runs out.
// Round 1 -> first drill, round 2 -> second drill ... then back to the first.
// "%" is the remainder operator: 4 % 3 = 1, which gives the wrap-around.
export function drillIdForRound(drillIds, round) {
  if (drillIds.length === 0) return null
  return drillIds[(round - 1) % drillIds.length]
}
