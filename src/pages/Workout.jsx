import { useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LinkButton from '../components/LinkButton'
import Loader from '../components/Loader'
import WorkoutTimer from '../components/WorkoutTimer'
import useRoutine from '../hooks/useRoutine'

// The page only LOADS the routine. The timer itself lives in WorkoutTimer.
// Splitting it matters: useTimer reads its settings once, so it must be
// mounted only after the routine has arrived.
export default function Workout() {
  const { id } = useParams() // the :id from /workout/:id
  const { routine, loading, error } = useRoutine(id)

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <Loader label="Loading workout..." />
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <ErrorMessage message={error} />
        <LinkButton to="/routines" variant="secondary" className="mt-4">
          Back to routines
        </LinkButton>
      </main>
    )
  }

  // key={routine.id}: if the id ever changes, React builds a fresh timer instead of reusing the old one
  return <WorkoutTimer key={routine.id} routine={routine} />
}
