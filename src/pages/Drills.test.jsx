// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RoutineDraftProvider from '../context/RoutineDraftProvider'
import { drills } from '../data/drills'
import Drills from './Drills'

afterEach(cleanup)

// The Drills page needs a router (for its link) and the routine draft context
function setup() {
  render(
    <MemoryRouter>
      <RoutineDraftProvider>
        <Drills />
      </RoutineDraftProvider>
    </MemoryRouter>,
  )
}

describe('Drills page', () => {
  it('shows every drill at first and no Back to routine bar', () => {
    setup()
    expect(screen.getByText(`Showing ${drills.length} of ${drills.length} drills`)).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Back to routine' })).toBeNull()
  })

  it('filters by category', async () => {
    setup()
    const category = drills[0].category
    const expected = drills.filter((drill) => drill.category === category).length
    await userEvent.click(screen.getByRole('button', { name: category }))
    expect(screen.getByText(`Showing ${expected} of ${drills.length} drills`)).toBeTruthy()
  })

  it('shows an empty state when the search matches nothing', async () => {
    setup()
    await userEvent.type(screen.getByLabelText('Search drills'), 'zzzzzz')
    expect(screen.getByText(`Showing 0 of ${drills.length} drills`)).toBeTruthy()
    expect(screen.getByText(/No drills match/)).toBeTruthy()
  })

  it('adds and removes a drill from the routine draft', async () => {
    setup()
    await userEvent.click(screen.getAllByRole('button', { name: /add to routine/i })[0])
    expect(screen.getByRole('link', { name: 'Back to routine' }).getAttribute('href')).toBe('/routines/new')
    await userEvent.click(screen.getByRole('button', { name: /remove from routine/i }))
    expect(screen.queryByRole('link', { name: 'Back to routine' })).toBeNull()
  })
})
