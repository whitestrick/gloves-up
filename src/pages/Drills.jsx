import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import DrillCard from '../components/DrillCard'
import EmptyState from '../components/EmptyState'
import FormInput from '../components/FormInput'
import useRoutineDraft from '../hooks/useRoutineDraft'
import { drills } from '../data/drills'

// "All" plus every category found in the data. A Set removes the duplicates.
const categories = ['All', ...new Set(drills.map((drill) => drill.category))]

export default function Drills() {
  // Local state: only this page cares about the search text and chosen category
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  // Shared state from the context: the routine draft is used by several pages
  const { draft, addDrill, removeDrill } = useRoutineDraft()
  const draftCount = draft.drillIds.length

  // A routine is "in progress" once it has a name or at least one drill
  const hasDraft = draftCount > 0 || draft.name.trim() !== ''

  // While editing, Back to routine returns to the edit page, otherwise to the new-routine page
  const backTo = draft.editingId ? `/routines/${draft.editingId}/edit` : '/routines/new'

  // Called by a card's button: add the drill if it is not in the draft, remove it if it is
  function toggleDrill(id) {
    if (draft.drillIds.includes(id)) {
      removeDrill(id)
    } else {
      addDrill(id)
    }
  }

  // Put the search box and category back to their starting values
  function clearFilters() {
    setSearch('')
    setCategory('All')
  }

  // The visible list is worked out on every render from the two state values.
  // It does not need its own state or a useEffect.
  const visibleDrills = drills.filter((drill) => {
    const matchesCategory = category === 'All' || drill.category === category
    const matchesSearch = drill.name.toLowerCase().includes(search.trim().toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold">Drill library</h1>
      <p className="mt-1 text-neutral-600">Browse boxing drills. Add the ones you want to your routine.</p>

      {/* "Back to routine" bar: only shown while a routine is being built.
          "sticky" keeps it at the top of the screen while the user scrolls the drills. */}
      {hasDraft && (
        <div className="sticky top-0 z-10 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border-[1.5px] border-accent bg-white p-4 shadow-sm">
          <p>
            <strong>{draft.name.trim() || 'Untitled routine'}</strong>: {draftCount}{' '}
            {draftCount === 1 ? 'drill' : 'drills'} selected
          </p>
          <Link to={backTo} className="font-semibold text-brand">
            Back to routine
          </Link>
        </div>
      )}

      {/* Reuses the FormInput component from the login form */}
      <div className="mt-6 max-w-sm">
        <FormInput
          id="search"
          label="Search drills"
          type="search"
          placeholder="e.g. jab"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* One button per category. aria-pressed tells screen readers which one is active. */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
            className={`min-h-9 cursor-pointer rounded-full border-[1.5px] px-4 text-sm ${
              category === name ? 'border-ink bg-ink text-white' : 'border-neutral-500 bg-white text-ink'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-neutral-600" aria-live="polite">
        Showing {visibleDrills.length} of {drills.length} drills
      </p>

      {/* Empty state: shown when nothing matches the filters */}
      {visibleDrills.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No drills found"
            message="No drills match your search. Try a different word or category."
          >
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDrills.map((drill) => (
            // key helps React track each item when the list changes
            <li key={drill.id}>
              <DrillCard
                drill={drill}
                selected={draft.drillIds.includes(drill.id)}
                onToggle={toggleDrill}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
