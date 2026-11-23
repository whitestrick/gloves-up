import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import LinkButton from '../components/LinkButton'
import RoutineCard from '../components/RoutineCard'
import useRoutines from '../hooks/useRoutines'

export default function Routines() {
  const { routines, loading, error } = useRoutines()

  // Decide what to show: loading, error, empty, or the list. Only one of them at a time.
  let content
  if (loading) {
    content = <Loader label="Loading your routines..." />
  } else if (error) {
    content = <ErrorMessage message={error} />
  } else if (routines.length === 0) {
    content = (
      <EmptyState title="No routines yet" message="Build your first routine from the drill library.">
        <LinkButton to="/routines/new">Create a routine</LinkButton>
      </EmptyState>
    )
  } else {
    content = (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routines.map((routine) => (
          <li key={routine.id}>
            <RoutineCard routine={routine} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">My routines</h1>
        <LinkButton to="/routines/new">New routine</LinkButton>
      </div>
      <div className="mt-6">{content}</div>
    </main>
  )
}
