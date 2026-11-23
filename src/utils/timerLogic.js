// The rules of the round timer. There is NO React in this file, only plain functions.
// A timer "state" is an object: { phase, round, secondsLeft, elapsedSeconds }
//   phase: 'work' | 'rest' | 'finished'
//   round: which round we are in (starts at 1)
//   secondsLeft: seconds remaining in the current phase
//   elapsedSeconds: total seconds the timer has actually run (used to save the session later)
// "config" is { rounds, roundSeconds, restSeconds }.

// The state when the workout begins: round 1, work phase
export function startingState({ roundSeconds }) {
  return { phase: 'work', round: 1, secondsLeft: roundSeconds, elapsedSeconds: 0 }
}

// The state AFTER the current phase ends (either the time ran out or the user pressed skip).
// Pattern: work -> rest -> work -> rest -> ... -> work -> finished
export function nextPhase(state, { rounds, roundSeconds, restSeconds }) {
  // Nothing comes after "finished"
  if (state.phase === 'finished') return state

  if (state.phase === 'work') {
    // The last round has no rest after it, so the workout is over
    if (state.round >= rounds) return { ...state, phase: 'finished', secondsLeft: 0 }
    // A rest of 0 seconds means we skip the rest phase completely
    if (restSeconds > 0) return { ...state, phase: 'rest', secondsLeft: restSeconds }
  }

  // After a rest (or a work round with no rest), the next round starts
  return { ...state, phase: 'work', round: state.round + 1, secondsLeft: roundSeconds }
}

// What happens when ONE second passes
export function tick(state, config) {
  if (state.phase === 'finished') return state

  // A second has passed, so the elapsed time goes up by one
  const ticked = { ...state, elapsedSeconds: state.elapsedSeconds + 1 }

  // Still time left in this phase: just count down
  if (ticked.secondsLeft > 1) return { ...ticked, secondsLeft: ticked.secondsLeft - 1 }

  // That was the last second of the phase: move on
  return nextPhase(ticked, config)
}
