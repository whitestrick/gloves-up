import { useCallback, useState } from 'react'
import { RoutineDraftContext, emptyDraft } from './routineDraftContext'

// Holds the routine the user is building or editing, so the Drills page and the
// Routine form page can share it without passing props through the router.
export default function RoutineDraftProvider({ children }) {
  const [draft, setDraft] = useState(emptyDraft)

  // useCallback keeps each function the SAME function between renders.
  // That matters now: RoutineForm lists these functions in a useEffect dependency list.
  // Without useCallback they would be "new" on every render and the effect would re-run forever.

  // Change some fields, e.g. updateDraft({ name: 'Cardio blast' }).
  const updateDraft = useCallback((changes) => {
    setDraft((current) => ({ ...current, ...changes }))
  }, [])

  // Add a drill id (ignored if it is already in the draft)
  const addDrill = useCallback((id) => {
    setDraft((current) =>
      current.drillIds.includes(id)
        ? current
        : { ...current, drillIds: [...current.drillIds, id] },
    )
  }, [])

  // Remove a drill id
  const removeDrill = useCallback((id) => {
    setDraft((current) => ({
      ...current,
      drillIds: current.drillIds.filter((drillId) => drillId !== id),
    }))
  }, [])

  // Start over with an empty draft (after saving, or on Cancel)
  const resetDraft = useCallback(() => {
    setDraft(emptyDraft)
  }, [])

  return (
    <RoutineDraftContext.Provider value={{ draft, updateDraft, addDrill, removeDrill, resetDraft }}>
      {children}
    </RoutineDraftContext.Provider>
  )
}
