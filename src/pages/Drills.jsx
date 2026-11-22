import { useState } from 'react'
import DrillCard from '../components/DrillCard'
import FormInput from '../components/FormInput'
import { drills } from '../data/drills'

// "All" plus every category found in the data. A Set removes the duplicates.
const categories = ['All', ...new Set(drills.map((drill) => drill.category))]

export default function Drills() {
  // Two pieces of state: the chosen category and the text in the search box
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

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
      <p className="mt-1 text-neutral-600">Browse boxing drills. You will use them to build routines.</p>

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
        <p className="mt-6 rounded-lg border-[1.5px] border-neutral-300 bg-white p-6">
          No drills match your search. Try a different word or category.
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDrills.map((drill) => (
            // key helps React track each item when the list changes
            <li key={drill.id}>
              <DrillCard drill={drill} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
