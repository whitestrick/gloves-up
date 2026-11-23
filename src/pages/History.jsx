import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import LinkButton from '../components/LinkButton'
import Loader from '../components/Loader'
import QuoteCard from '../components/QuoteCard'
import SessionCard from '../components/SessionCard'
import StatCard from '../components/StatCard'
import useSessions from '../hooks/useSessions'
import { formatDuration } from '../utils/routineHelpers'
import { calculateWeeklyStats } from '../utils/sessionHelpers'

export default function History() {
  const { sessions, loading, error } = useSessions()

  // Decide what to show: loading, error, empty, or the real content. Only one at a time.
  let content
  if (loading) {
    content = <Loader label="Loading your history..." />
  } else if (error) {
    content = <ErrorMessage message={error} />
  } else if (sessions.length === 0) {
    content = (
      <EmptyState title="No sessions yet" message="Finish or end a workout and it will show up here.">
        <LinkButton to="/routines">Pick a routine</LinkButton>
      </EmptyState>
    )
  } else {
    // Worked out on every render from the sessions, so it is always up to date.
    // It is a quick calculation, so it does not need useMemo or its own state.
    const week = calculateWeeklyStats(sessions)

    content = (
      <>
        <section aria-labelledby="week-heading">
          <h2 id="week-heading" className="text-xl font-bold">
            This week
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <StatCard label="Sessions" value={week.sessionCount} />
            <StatCard label="Time trained (min:sec)" value={formatDuration(week.totalSeconds)} />
            <StatCard label="Rounds completed" value={week.totalRounds} />
          </div>
          <p className="mt-2 text-sm text-neutral-600">Weeks start on Monday.</p>
        </section>

        <section aria-labelledby="sessions-heading" className="mt-8">
          <h2 id="sessions-heading" className="text-xl font-bold">
            All sessions
          </h2>
          {/* The list is already sorted newest first by getUserSessions */}
          <ul className="mt-3 flex flex-col gap-3">
            {sessions.map((session) => (
              <li key={session.id}>
                <SessionCard session={session} />
              </li>
            ))}
          </ul>
        </section>
      </>
    )
  }

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold">Training history</h1>
      {/* The quote loads on its own, separately from the sessions */}
      <div className="mt-4">
        <QuoteCard />
      </div>
      <div className="mt-6">{content}</div>
    </main>
  )
}
