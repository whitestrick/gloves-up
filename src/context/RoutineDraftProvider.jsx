import { useState } from 'react'
import { RoutineDraftContext, emptyDraft } from './routineDraftContext'

// Holds the routine the user is building, so the Drills page and the
// Routine builder page can share it without passing props through the router.
export default function RoutineDraftProvider({ children }) {
  const [draft, setDraft] = useState(emptyDraft)

  // Change some fields, e.g. updateDraft({ name: 'Cardio blast' }).
  // (current) => ... always works from the latest state; ...spread copies it first.
  function updateDraft(changes) {
    setDraft((current) => ({ ...current, ...changes }))
  }

  // Add a drill id (ignored if it is already in the draft)
  function addDrill(id) {
    setDraft((current) =>
      current.drillIds.includes(id)
        ? current
        : { ...current, drillIds: [...current.drillIds, id] },
    )
  }

  // Remove a drill id
  function removeDrill(id) {
    setDraft((current) => ({
      ...current,
      drillIds: current.drillIds.filter((drillId) => drillId !== id),
    }))
  }

  // Start over with an empty draft (used after a routine is saved)
  function resetDraft() {
    setDraft(emptyDraft)
  }

  return (
    <RoutineDraftContext.Provider value={{ draft, updateDraft, addDrill, removeDrill, resetDraft }}>
      {children}
    </RoutineDraftContext.Provider>
  )
}
