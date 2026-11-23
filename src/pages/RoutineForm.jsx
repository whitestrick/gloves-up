import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import FormInput from '../components/FormInput'
import useAuth from '../hooks/useAuth'
import useRoutineDraft from '../hooks/useRoutineDraft'
import useToast from '../hooks/useToast'
import { drills } from '../data/drills'
import { createRoutine } from '../services/routineService'
import { validateRoutine } from '../utils/validators'
import { calculateTotalSeconds, formatDuration } from '../utils/routineHelpers'

export default function RoutineForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  // The form fields live in the shared draft, so they survive a trip to the Drills page
  const { draft, updateDraft, removeDrill, resetDraft } = useRoutineDraft()

  const [errors, setErrors] = useState({}) // one message per invalid field
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Worked out on every render from the draft, so it updates as the user types
  const totalSeconds = calculateTotalSeconds(draft.rounds, draft.roundSeconds, draft.restSeconds)

  // The drills the user picked, looked up by id in the drill list
  const selectedDrills = draft.drillIds
    .map((id) => drills.find((drill) => drill.id === id))
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

    // 2. Save to Firestore with the signed-in user's id
    setSaving(true)
    setSaveError('')
    try {
      await createRoutine(user.uid, {
        name: draft.name.trim(),
        rounds: Number(draft.rounds),
        roundSeconds: Number(draft.roundSeconds),
        restSeconds: Number(draft.restSeconds),
        drillIds: draft.drillIds,
        totalSeconds,
      })
      // 3. Success: clear the draft, tell the user, go to the list
      resetDraft()
      showToast('Routine saved!')
      navigate('/routines')
    } catch {
      setSaveError('Could not save your routine. Please try again.')
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">New routine</h1>

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
            {saving ? 'Saving...' : 'Save routine'}
          </Button>
          <Link to="/routines" className="font-semibold text-brand">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}
