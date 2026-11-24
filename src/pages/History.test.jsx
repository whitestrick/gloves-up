// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import useQuote from '../hooks/useQuote'
import useSessions from '../hooks/useSessions'
import History from './History'

// Fake hooks and fake date/stat helpers: this test only checks which state the page shows
vi.mock('../hooks/useSessions', () => ({ default: vi.fn() }))
vi.mock('../hooks/useQuote', () => ({ default: vi.fn() }))
vi.mock('../utils/sessionHelpers', () => ({
  calculateWeeklyStats: () => ({ sessionCount: 2, totalSeconds: 600, totalRounds: 5 }),
  formatSessionDate: () => 'Mon 1 Jan',
}))

afterEach(cleanup)

const sessions = [
  { id: 's1', routineName: 'Cardio blast', createdAt: 'x', roundsCompleted: 3, plannedRounds: 3, durationSeconds: 300, completed: true },
]

function setup(hookResult) {
  useQuote.mockReturnValue({ quote: { text: 'Keep going', author: 'Coach' }, loading: false, error: '' })
  useSessions.mockReturnValue({ sessions: [], loading: false, error: '', ...hookResult })
  return render(
    <MemoryRouter>
      <History />
    </MemoryRouter>,
  )
}

describe('History page', () => {
  it('shows a loader while loading', () => {
    setup({ loading: true })
    expect(screen.getByText('Loading your history...')).toBeTruthy()
  })

  it('shows an error message', () => {
    setup({ error: 'Could not load your history. Please try again.' })
    expect(screen.getByText('Could not load your history. Please try again.')).toBeTruthy()
  })

  it('shows the empty state with a link to pick a routine', () => {
    setup({})
    expect(screen.getByRole('heading', { name: 'No sessions yet' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Pick a routine' })).toBeTruthy()
  })

  it('shows the weekly stats, the sessions and the quote', () => {
    setup({ sessions })
    expect(screen.getByRole('heading', { name: 'This week' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'All sessions' })).toBeTruthy()
    expect(screen.getByText('10:00')).toBeTruthy()
    expect(screen.getByText('Cardio blast')).toBeTruthy()
    expect(screen.getByText(/Keep going/)).toBeTruthy()
  })
})
