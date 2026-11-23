import { describe, it, expect } from 'vitest'
import { startingState, nextPhase, tick, completedRounds } from './timerLogic'
import { calculateTotalSeconds } from './routineHelpers'

// A tiny workout so the tests stay easy to follow: 3 rounds of 3s with 2s rest
const config = { rounds: 3, roundSeconds: 3, restSeconds: 2 }

describe('startingState', () => {
  it('begins in round 1, work phase, with nothing elapsed', () => {
    expect(startingState({ roundSeconds: 180 })).toEqual({
      phase: 'work',
      round: 1,
      secondsLeft: 180,
      elapsedSeconds: 0,
    })
  })
})

describe('nextPhase', () => {
  it('goes from work to rest and keeps the round and elapsed time', () => {
    const state = { phase: 'work', round: 1, secondsLeft: 1, elapsedSeconds: 3 }
    expect(nextPhase(state, config)).toEqual({
      phase: 'rest',
      round: 1,
      secondsLeft: 2,
      elapsedSeconds: 3,
    })
  })

  it('goes from rest to the next round', () => {
    const state = { phase: 'rest', round: 1, secondsLeft: 1, elapsedSeconds: 5 }
    expect(nextPhase(state, config)).toEqual({
      phase: 'work',
      round: 2,
      secondsLeft: 3,
      elapsedSeconds: 5,
    })
  })

  it('finishes after the last work round (no rest after it)', () => {
    const state = { phase: 'work', round: 3, secondsLeft: 1, elapsedSeconds: 13 }
    expect(nextPhase(state, config)).toEqual({
      phase: 'finished',
      round: 3,
      secondsLeft: 0,
      elapsedSeconds: 13,
    })
  })

  it('skips the rest phase when rest is 0 seconds', () => {
    const state = { phase: 'work', round: 1, secondsLeft: 1, elapsedSeconds: 3 }
    const next = nextPhase(state, { ...config, restSeconds: 0 })
    expect(next.phase).toBe('work')
    expect(next.round).toBe(2)
    expect(next.secondsLeft).toBe(3)
  })

  it('does nothing once the workout is finished', () => {
    const state = { phase: 'finished', round: 3, secondsLeft: 0, elapsedSeconds: 13 }
    expect(nextPhase(state, config)).toBe(state) // the very same object
  })
})

describe('tick', () => {
  it('counts down one second and adds one to the elapsed time', () => {
    const state = { phase: 'work', round: 1, secondsLeft: 3, elapsedSeconds: 0 }
    expect(tick(state, config)).toEqual({
      phase: 'work',
      round: 1,
      secondsLeft: 2,
      elapsedSeconds: 1,
    })
  })

  it('moves to the next phase on the last second of a phase', () => {
    const state = { phase: 'work', round: 1, secondsLeft: 1, elapsedSeconds: 2 }
    expect(tick(state, config)).toEqual({
      phase: 'rest',
      round: 1,
      secondsLeft: 2,
      elapsedSeconds: 3,
    })
  })

  it('does nothing once the workout is finished', () => {
    const state = { phase: 'finished', round: 3, secondsLeft: 0, elapsedSeconds: 13 }
    expect(tick(state, config)).toBe(state)
  })

  it('runs a whole workout: finishes in round 3 after exactly the total time', () => {
    let state = startingState(config)
    let seconds = 0

    // Keep ticking until finished. The limit stops a bug from looping forever.
    while (state.phase !== 'finished' && seconds < 1000) {
      state = tick(state, config)
      seconds += 1
    }

    expect(state.phase).toBe('finished')
    expect(state.round).toBe(3)
    // 3 rounds x 3s + 2 rests x 2s = 13 seconds, the same maths the routine form uses
    expect(state.elapsedSeconds).toBe(calculateTotalSeconds(3, 3, 2))
    expect(seconds).toBe(13)
  })
})

describe('completedRounds', () => {
  it('does not count the round still being worked', () => {
    expect(completedRounds({ phase: 'work', round: 1 })).toBe(0)
    expect(completedRounds({ phase: 'work', round: 3 })).toBe(2)
  })

  it('counts a round once its work phase is over', () => {
    expect(completedRounds({ phase: 'rest', round: 2 })).toBe(2)
  })

  it('counts every round when finished', () => {
    expect(completedRounds({ phase: 'finished', round: 3 })).toBe(3)
  })
})
