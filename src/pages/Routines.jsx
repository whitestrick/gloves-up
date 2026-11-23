import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import LinkButton from '../components/LinkButton'
import RoutineCard from '../components/RoutineCard'
import useRoutines from '../hooks/useRoutines'
import useRoutineDraft from '../hooks/useRoutineDraft'
import useToast from '../hooks/useToast'

export default function Routines() {
  const { routines, loading, error, removeRoutine } = useRoutines()
  const { draft, resetDraft } = useRoutineDraft()
  const { showToast } = useToast()

  // The routine waiting for confirmation. null = no dialog showing.
  const [routineToDelete, setRoutineToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // The user clicked "Yes, delete" in the dialog
  async function handleConfirmDelete() {
    setDeleting(true)
    try {
      await removeRoutine(routineToDelete.id)
      // If this routine was half-edited in the draft, throw that draft away too
      if (draft.editingId === routineToDelete.id) resetDraft()
      showToast('Routine deleted')
    } catch {
      showToast('Could not delete the routine. Try again.')
    } finally {
      // Runs after success AND failure: close the dialog and re-enable the buttons
      setDeleting(false)
      setRoutineToDelete(null)
    }
  }

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
            {/* Clicking Delete only remembers WHICH routine. Nothing is deleted yet. */}
            <RoutineCard routine={routine} onDelete={setRoutineToDelete} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">My routines</h1>
        <LinkButton to="/routines/new">New routine</LinkButton>
      </div>
      <div className="mt-6">{content}</div>

      {/* The dialog is open whenever a routine is waiting for confirmation */}
      <ConfirmDialog
        open={routineToDelete !== null}
        title="Delete this routine?"
        message={
          routineToDelete
            ? `"${routineToDelete.name}" will be deleted for good. This cannot be undone.`
            : ''
        }
        confirmLabel="Yes, delete"
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setRoutineToDelete(null)}
      />
    </main>
  )
}
