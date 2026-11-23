import { createContext } from 'react'

// What an empty routine draft looks like. The provider also uses it to reset.
export const emptyDraft = {
  editingId: null, // NEW: null = creating a new routine, otherwise the id being edited
  name: '',
  rounds: 3,
  roundSeconds: 180,
  restSeconds: 60,
  drillIds: [], // ids from src/data/drills.js
}

// The default value is only used if a component is rendered outside the provider
export const RoutineDraftContext = createContext({
  draft: emptyDraft,
  updateDraft: () => {},
  addDrill: () => {},
  removeDrill: () => {},
  resetDraft: () => {},
})
