import LinkButton from './LinkButton'
import { formatDuration } from '../utils/routineHelpers'

// Shows ONE saved routine. The data arrives through the "routine" prop.
export default function RoutineCard({ routine }) {
  const drillCount = routine.drillIds.length

  return (
    <article className="flex h-full flex-col gap-2 rounded-lg border-[1.5px] border-neutral-300 bg-white p-5">
      <h2 className="text-xl font-bold">{routine.name}</h2>
      <p className="text-3xl font-extrabold text-accent">{formatDuration(routine.totalSeconds)}</p>
      <p className="text-neutral-600">
        {routine.rounds} rounds x {routine.roundSeconds}s, {routine.restSeconds}s rest
      </p>
      <p className="text-neutral-600">
        {drillCount} {drillCount === 1 ? 'drill' : 'drills'}
      </p>

      {/* mt-auto pushes the buttons to the bottom so all cards line up */}
      <div className="mt-auto flex flex-wrap gap-2 pt-3">
        <LinkButton to={`/workout/${routine.id}`}>
          Start<span className="sr-only"> {routine.name}</span>
        </LinkButton>
        <LinkButton to={`/routines/${routine.id}/edit`} variant="secondary">
          Edit<span className="sr-only"> {routine.name}</span>
        </LinkButton>
      </div>
    </article>
  )
}
