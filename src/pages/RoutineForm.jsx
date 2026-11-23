import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import FormInput from '../components/FormInput'
import Loader from '../components/Loader'
import useAuth from '../hooks/useAuth'
import useRoutineDraft from '../hooks/useRoutineDraft'
import useToast from '../hooks/useToast'
import { drills } from '../data/drills'
import { createRoutine, getRoutine, updateRoutine } from '../services/routineService'
import { validateRoutine } from '../utils/validators'
import { calculateTotalSeconds, formatDuration } from '../utils/routineHelpers'

export default function RoutineForm() {
  const navigate = useNavigate()
  const { id } = useParams() // NEW: the :id from /routines/:id/edit (undefined on /routines/new)
  const { user } = useAuth()
  const { showToast } = useToast()
  // The form fields live in the shared draft, so they survive a trip to the Drills page
  const { draft, updateDraft, removeDrill, resetDraft } = useRoutineDraft()

  const [errors, setErrors] = useState({}) // one message per invalid field
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loadError, setLoadError] = useState('') // NEW: problem loading the routine to edit

  const isEditing = Boolean(id)

  // NEW: is the draft ready for THIS page?
  // Editing: the draft must hold this routine. New: the draft must not hold an old edit.
  // This is worked out on every render, so it needs no state of its own.
  const draftReady = isEditing ? draft.editingId === id : !draft.editingId

  // NEW: gets the draft ready when the page opens (or the id changes)
  useEffect(() => {
    // New-routine page with a leftover edit in the draft: start clean
    if (!id) {
      if (draft.editingId) resetDraft()
      return
    }

    // The draft already holds this routine (e.g. coming back from the Drills page).
    // Do nothing, or we would overwrite the user's unsaved changes.
    if (draft.editingId === id) return

    // Otherwise load the routine from Firestore into the draft
    let cancelled = false // ignore a late answer if the user has already left
    getRoutine(id)
      .then((routine) => {
        if (cancelled) return
        if (!routine) {
          setLoadError('Routine not found.')
          return
        }
        updateDraft({
          editingId: id,
          name: routine.name,
          rounds: routine.rounds,
          roundSeconds: routine.roundSeconds,
          restSeconds: routine.restSeconds,
          drillIds: routine.drillIds,
        })
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not load this routine. Please try again.')
      })

    return () => {
      cancelled = true
    }
  }, [id, draft.editingId, updateDraft, resetDraft])

  // Worked out on every render from the draft, so it updates as the user types
  const totalSeconds = calculateTotalSeconds(draft.rounds, draft.roundSeconds, draft.restSeconds)

  // The drills the user picked, looked up by id in the drill list
  const selectedDrills = draft.drillIds
    .map((drillId) => drills.find((drill) => drill.id === drillId))
    .filter(Boolean)

  // Connects an input to the draft: shows the draft value and updates it while typing
  function bind(field) {
    return {
      value: draft[field],
      onChange: (e) => updateDraft({ [field]: e.target.value }),
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // 1. Validate. If anything is wrong, show the messages and stop.
    const found = validateRoutine(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    // 2. Save to Firestore: update the existing routine, or create a new one
    setSaving(true)
    setSaveError('')
    const data = {
      name: draft.name.trim(),
      rounds: Number(draft.rounds),
      roundSeconds: Number(draft.roundSeconds),
      restSeconds: Number(draft.restSeconds),
      drillIds: draft.drillIds,
      totalSeconds,
    }
    try {
      if (isEditing) {
        await updateRoutine(id, data)
      } else {
        await createRoutine(user.uid, data)
      }
      // 3. Success: clear the draft, tell the user, go to the list
      resetDraft()
      showToast(isEditing ? 'Routine updated!' : 'Routine saved!')
      navigate('/routines')
    } catch {
      setSaveError('Could not save your routine. Please try again.')
      setSaving(false)
    }
  }

  // NEW: loading and error screens. They come AFTER all the hooks above,
  // because React needs hooks to run in the same order on every render.
  if (loadError) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <ErrorMessage message={loadError} />
        <Link to="/routines" className="mt-4 inline-block font-semibold text-brand">
          Back to routines
        </Link>
      </main>
    )
  }
  if (!draftReady) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <Loader label="Loading routine..." />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">{isEditing ? 'Edit routine' : 'New routine'}</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
        <FormInput id="name" label="Routine name" placeholder="e.g. Cardio blast" {...bind('name')} error={errors.name} />

        <div className="grid gap-4 sm:grid-cols-3">
          <FormInput
            id="rounds"
            label="Rounds (1-20)"
            type="number"
            min="1"
            max="20"
            {...bind('rounds')}
            error={errors.rounds}
          />
          <FormInput
            id="roundSeconds"
            label="Round length (seconds)"
            type="number"
            min="10"
            max="600"
            {...bind('roundSeconds')}
            error={errors.roundSeconds}
          />
          <FormInput
            id="restSeconds"
            label="Rest (seconds)"
            type="number"
            min="0"
            max="300"
            {...bind('restSeconds')}
            error={errors.restSeconds}
          />
        </div>

        {/* Selected drills, with a link to the Drills page to add more */}
        <section aria-labelledby="drills-heading" className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 id="drills-heading" className="text-lg font-bold">
              Drills ({selectedDrills.length})
            </h2>
            <Link to="/drills" className="font-semibold text-brand">
              Add drills
            </Link>
          </div>

          {selectedDrills.length === 0 ? (
            <p className="text-neutral-600">No drills yet. Use the Add drills link to pick some.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {selectedDrills.map((drill) => (
                <li
                  key={drill.id}
                  className="flex items-center justify-between gap-3 rounded-lg border-[1.5px] border-neutral-300 bg-white px-4 py-2"
                >
                  <span>{drill.name}</span>
                  <Button type="button" variant="danger" onClick={() => removeDrill(drill.id)}>
                    Remove<span className="sr-only"> {drill.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {errors.drillIds && (
            <p role="alert" className="text-sm text-brand">
              {errors.drillIds}
            </p>
          )}
        </section>

        {/* Total time: rest is only counted between rounds */}
        <div className="rounded-lg border-[1.5px] border-accent bg-white p-4">
          <p className="text-sm text-neutral-600">Total time (minutes:seconds, rest only between rounds)</p>
          <p className="text-3xl font-extrabold text-accent">{formatDuration(totalSeconds)}</p>
        </div>

        {saveError && (
          <p role="alert" className="text-sm text-brand">
            {saveError}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Save routine'}
          </Button>
          {/* Cancel throws the draft away so the next form starts clean */}
          <Link to="/routines" onClick={() => resetDraft()} className="font-semibold text-brand">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}
