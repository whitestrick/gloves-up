import { completedRounds } from './timerLogic'

// Turns "what happened in the workout" into the data we save.
// It is a plain function (no React), so auto-save and "End and save" both use the SAME code.
// userId and createdAt are added later by the service.
export function buildSession(routine, { phase, round, elapsedSeconds }) {
  return {
    routineId: routine.id,
    routineName: routine.name, // saved as text so History still works if the routine is later deleted
    roundsCompleted: completedRounds({ phase, round }),
    plannedRounds: routine.rounds,
    durationSeconds: elapsedSeconds, // seconds the timer actually ran
    completed: phase === 'finished', // false = ended early
  }
}

// Midnight on the Monday of the week that contains "now" (the week starts on Monday).
// getDay() gives 0 for Sunday ... 6 for Saturday, so (day + 6) % 7 counts the days since Monday.
export function startOfWeek(now = new Date()) {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return start
}

// Adds up this week's sessions. "now" is a parameter so a test can pick any date.
export function calculateWeeklyStats(sessions, now = new Date()) {
  const weekStart = startOfWeek(now).getTime()
  const thisWeek = sessions.filter((session) => (session.createdAt?.toMillis() ?? 0) >= weekStart)

  return {
    sessionCount: thisWeek.length,
    totalSeconds: thisWeek.reduce((sum, session) => sum + session.durationSeconds, 0),
    totalRounds: thisWeek.reduce((sum, session) => sum + session.roundsCompleted, 0),
  }
}

// Turns a Firestore Timestamp into readable text, e.g. "Mon, 23 Nov, 14:05"
export function formatSessionDate(createdAt) {
  if (!createdAt) return ''
  return createdAt.toDate().toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
