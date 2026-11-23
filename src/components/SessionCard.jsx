import { formatDuration } from '../utils/routineHelpers'
import { formatSessionDate } from '../utils/sessionHelpers'

// Shows ONE saved session. The data arrives through the "session" prop.
export default function SessionCard({ session }) {
  return (
    <article className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-[1.5px] border-neutral-300 bg-white p-4">
      <div>
        <h3 className="text-lg font-bold">{session.routineName}</h3>
        <p className="text-sm text-neutral-600">{formatSessionDate(session.createdAt)}</p>
      </div>
      <p className="text-neutral-600">
        {session.roundsCompleted} of {session.plannedRounds} rounds
      </p>
      <p className="text-2xl font-extrabold text-accent">{formatDuration(session.durationSeconds)}</p>
      {/* The badge uses words as well as colour, so it works for people who can't see the colour */}
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          session.completed ? 'bg-accent/10 text-accent' : 'bg-brand/10 text-brand'
        }`}
      >
        {session.completed ? 'Completed' : 'Ended early'}
      </span>
    </article>
  )
}
