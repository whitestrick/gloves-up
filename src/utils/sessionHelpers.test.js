import { describe, it, expect } from 'vitest'
import {
  buildSession,
  startOfWeek,
  calculateWeeklyStats,
  formatSessionDate,
} from './sessionHelpers'

// Firestore gives us Timestamp objects. Tests only need the one method each function calls,
// so a small fake object is enough.
function fakeTimestamp(date) {
  return { toMillis: () => date.getTime(), toDate: () => date }
}

describe('buildSession', () => {
  const routine = { id: 'r1', name: 'Cardio blast', rounds: 3 }

  it('builds a completed session when the workout finished', () => {
    const session = buildSession(routine, { phase: 'finished', round: 3, elapsedSeconds: 13 })
    expect(session).toEqual({
      routineId: 'r1',
      routineName: 'Cardio blast',
      roundsCompleted: 3,
      plannedRounds: 3,
      durationSeconds: 13,
      completed: true,
    })
  })

  it('does not count the round in progress when ended early during work', () => {
    const session = buildSession(routine, { phase: 'work', round: 2, elapsedSeconds: 200 })
    expect(session.roundsCompleted).toBe(1)
    expect(session.completed).toBe(false)
    expect(session.durationSeconds).toBe(200)
  })

  it('counts the round when ended early during rest', () => {
    const session = buildSession(routine, { phase: 'rest', round: 2, elapsedSeconds: 250 })
    expect(session.roundsCompleted).toBe(2)
    expect(session.completed).toBe(false)
  })
})

describe('startOfWeek', () => {
  it('returns midnight on the same day when it is Monday', () => {
    // 23 Nov 2026 is a Monday (months start at 0, so November is 10)
    expect(startOfWeek(new Date(2026, 10, 23, 14, 5))).toEqual(new Date(2026, 10, 23))
  })

  it('goes back to Monday from the middle of the week', () => {
    expect(startOfWeek(new Date(2026, 10, 25, 9, 0))).toEqual(new Date(2026, 10, 23))
  })

  it('treats Sunday as the LAST day of the week', () => {
    expect(startOfWeek(new Date(2026, 10, 29, 20, 0))).toEqual(new Date(2026, 10, 23))
  })

  it('works across a month boundary', () => {
    // Wednesday 2 Dec 2026 -> Monday 30 Nov 2026
    expect(startOfWeek(new Date(2026, 11, 2, 12, 0))).toEqual(new Date(2026, 10, 30))
  })

  it('does not change the date it was given', () => {
    const now = new Date(2026, 10, 25, 9, 0)
    startOfWeek(now)
    expect(now.getHours()).toBe(9)
  })
})

describe('calculateWeeklyStats', () => {
  // "Now" is Wednesday 25 Nov 2026, so this week started on Monday 23 Nov
  const now = new Date(2026, 10, 25, 12, 0)

  function session(date, durationSeconds, roundsCompleted) {
    return { createdAt: fakeTimestamp(date), durationSeconds, roundsCompleted }
  }

  it('adds up only the sessions from this week', () => {
    const sessions = [
      session(new Date(2026, 10, 23, 10, 0), 600, 3), // Monday: counts
      session(new Date(2026, 10, 24, 18, 0), 300, 2), // Tuesday: counts
      session(new Date(2026, 10, 22, 23, 59), 999, 9), // last Sunday: does NOT count
    ]
    expect(calculateWeeklyStats(sessions, now)).toEqual({
      sessionCount: 2,
      totalSeconds: 900,
      totalRounds: 5,
    })
  })

  it('counts a session made at exactly midnight on Monday', () => {
    const sessions = [session(new Date(2026, 10, 23, 0, 0, 0), 60, 1)]
    expect(calculateWeeklyStats(sessions, now).sessionCount).toBe(1)
  })

  it('ignores a session that has no date yet (Firestore is still saving it)', () => {
    const sessions = [{ createdAt: null, durationSeconds: 60, roundsCompleted: 1 }]
    expect(calculateWeeklyStats(sessions, now).sessionCount).toBe(0)
  })

  it('returns zeros when there are no sessions', () => {
    expect(calculateWeeklyStats([], now)).toEqual({
      sessionCount: 0,
      totalSeconds: 0,
      totalRounds: 0,
    })
  })
})

describe('formatSessionDate', () => {
  it('returns an empty string when there is no date yet', () => {
    expect(formatSessionDate(null)).toBe('')
    expect(formatSessionDate(undefined)).toBe('')
  })

  it('returns readable text containing the day number', () => {
    // The exact wording depends on the computer's language, so we only check the day
    const text = formatSessionDate(fakeTimestamp(new Date(2026, 10, 23, 14, 5)))
    expect(text).toContain('23')
  })
})
