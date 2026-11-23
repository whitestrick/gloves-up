import { describe, it, expect } from 'vitest'
import { calculateTotalSeconds, formatDuration, drillIdForRound } from './routineHelpers'

describe('calculateTotalSeconds', () => {
  it('adds every round plus a rest between rounds', () => {
    // 3 rounds x 180s = 540, plus 2 rests x 60s = 120
    expect(calculateTotalSeconds(3, 180, 60)).toBe(660)
  })

  it('has no rest after the last round (one round = no rest at all)', () => {
    expect(calculateTotalSeconds(1, 180, 60)).toBe(180)
  })

  it('works with rest set to 0', () => {
    expect(calculateTotalSeconds(3, 180, 0)).toBe(540)
  })

  it('accepts text from form fields', () => {
    expect(calculateTotalSeconds('3', '180', '60')).toBe(660)
  })

  it('returns 0 for empty or invalid input instead of NaN', () => {
    expect(calculateTotalSeconds('', 'abc', '')).toBe(0)
    expect(calculateTotalSeconds(0, 180, 60)).toBe(0)
  })
})

describe('formatDuration', () => {
  it('formats seconds as m:ss', () => {
    expect(formatDuration(660)).toBe('11:00')
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(59)).toBe('0:59')
  })

  it('formats zero', () => {
    expect(formatDuration(0)).toBe('0:00')
  })

  it('never shows a negative time', () => {
    expect(formatDuration(-5)).toBe('0:00')
  })

  it('rounds to the nearest second', () => {
    expect(formatDuration(59.6)).toBe('1:00')
  })

  it('keeps counting minutes past one hour', () => {
    expect(formatDuration(3600)).toBe('60:00')
  })
})

describe('drillIdForRound', () => {
  const ids = ['jab', 'cross', 'hook']

  it('gives the drills in order', () => {
    expect(drillIdForRound(ids, 1)).toBe('jab')
    expect(drillIdForRound(ids, 2)).toBe('cross')
    expect(drillIdForRound(ids, 3)).toBe('hook')
  })

  it('starts over when the list runs out', () => {
    expect(drillIdForRound(ids, 4)).toBe('jab')
    expect(drillIdForRound(ids, 7)).toBe('jab')
  })

  it('repeats a single drill every round', () => {
    expect(drillIdForRound(['jab'], 5)).toBe('jab')
  })

  it('returns null when there are no drills', () => {
    expect(drillIdForRound([], 1)).toBeNull()
  })
})
