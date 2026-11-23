import Button from './Button'
import LinkButton from './LinkButton'
import useTimer from '../hooks/useTimer'
import { drills } from '../data/drills'
import { calculateTotalSeconds, drillIdForRound, formatDuration } from '../utils/routineHelpers'

// Background colour and label for each phase: red for work, teal for rest.
// (Full class names are written out so Tailwind can find them.)
const phaseStyles = {
  work: 'bg-brand',
  rest: 'bg-accent',
  finished: 'bg-ink',
}
const phaseLabels = { work: 'WORK', rest: 'REST', finished: 'DONE' }

// The whole workout screen for ONE routine. The routine arrives through props,
// already loaded, because useTimer reads its settings only once.
export default function WorkoutTimer({ routine }) {
  const { rounds, roundSeconds, restSeconds, drillIds } = routine
  const timer = useTimer({ rounds, roundSeconds, restSeconds })
  const { phase, round, secondsLeft, elapsedSeconds, isRunning } = timer

  // Find the full drill object (name + description) for a given round
  function drillForRound(roundNumber) {
    return drills.find((drill) => drill.id === drillIdForRound(drillIds, roundNumber))
  }

  const currentDrill = drillForRound(round)

  // What comes next? During work it is the rest (or the next drill if there is no rest,
  // or the end after the last round). During rest it is the next round's drill.
  let upNext = ''
  if (phase === 'work') {
    if (round >= rounds) {
      upNext = 'Finish'
    } else if (restSeconds > 0) {
      upNext = 'Rest'
    } else {
      upNext = drillForRound(round + 1)?.name ?? 'Next round'
    }
  } else if (phase === 'rest') {
    upNext = drillForRound(round + 1)?.name ?? 'Next round'
  }

  // Progress through the whole workout, 0 to 100. Worked out on every render, no state needed.
  const totalSeconds = calculateTotalSeconds(rounds, roundSeconds, restSeconds)
  const progress =
    phase === 'finished' || totalSeconds === 0
      ? 100
      : Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100))

  // One button does three jobs, so its label depends on where we are
  let mainLabel = 'Pause'
  if (!isRunning) mainLabel = elapsedSeconds === 0 ? 'Start' : 'Resume'

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between gap-8 p-6 text-center text-white ${phaseStyles[phase]}`}
    >
      <header className="w-full max-w-3xl">
        <p className="text-lg font-semibold">{routine.name}</p>
        <p className="text-xl font-bold">
          {phase === 'finished' ? 'Workout complete!' : `Round ${round} of ${rounds}`}
        </p>

        {/* Progress bar: the outer div is the track, the inner div is the filled part.
            role="progressbar" and the aria values let screen readers announce it. */}
        <div
          role="progressbar"
          aria-label="Workout progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/30"
        >
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <section className="flex flex-col items-center gap-4">
        {/* aria-live="polite": a screen reader announces WORK / REST when it changes */}
        <p aria-live="polite" className="text-3xl font-extrabold tracking-widest">
          {phaseLabels[phase]}
        </p>
        {/* role="timer" does not announce every second, which would be very annoying */}
        <p role="timer" className="text-8xl font-extrabold tabular-nums sm:text-9xl">
          {formatDuration(secondsLeft)}
        </p>

        {phase === 'work' && currentDrill && (
          <div className="max-w-md">
            <p className="text-3xl font-bold">{currentDrill.name}</p>
            <p className="mt-1 text-lg">{currentDrill.description}</p>
          </div>
        )}
        {phase !== 'finished' && (
          <p className="text-xl">
            <span className="font-semibold">Up next:</span> {upNext}
          </p>
        )}
      </section>

      {/* "secondary" buttons (white) stay visible on every background colour.
          A red "primary" button would disappear on the red work screen. */}
      <footer className="flex flex-wrap justify-center gap-3">
        {phase === 'finished' ? (
          <LinkButton to="/routines" variant="secondary" className="text-xl">
            Back to routines
          </LinkButton>
        ) : (
          <>
            <Button
              variant="secondary"
              className="text-xl"
              onClick={isRunning ? timer.pause : timer.resume}
            >
              {mainLabel}
            </Button>
            <Button variant="secondary" className="text-xl" onClick={timer.skip}>
              Skip
            </Button>
            <LinkButton to="/routines" variant="secondary" className="text-xl">
              Exit
            </LinkButton>
          </>
        )}
      </footer>
    </main>
  )
}
