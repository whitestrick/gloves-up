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
