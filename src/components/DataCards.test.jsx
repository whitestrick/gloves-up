// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import QuoteCard from './QuoteCard'
import SessionCard from './SessionCard'
import StatCard from './StatCard'
import useQuote from '../hooks/useQuote'

// Replace the quote hook and the date formatter, so these tests only check what the cards show
vi.mock('../hooks/useQuote', () => ({ default: vi.fn() }))
vi.mock('../utils/sessionHelpers', () => ({ formatSessionDate: () => 'Mon 1 Jan' }))

afterEach(cleanup)

describe('StatCard', () => {
  it('shows the label and the value', () => {
    render(<StatCard label="Sessions" value={3} />)
    expect(screen.getByText('Sessions')).toBeTruthy()
    expect(screen.getByText('3')).toBeTruthy()
  })
})

describe('SessionCard', () => {
  const session = {
    routineName: 'Cardio blast',
    createdAt: 'any',
    roundsCompleted: 3,
    plannedRounds: 3,
    durationSeconds: 300,
    completed: true,
  }

  it('shows a completed session', () => {
    render(<SessionCard session={session} />)
    expect(screen.getByText('Cardio blast')).toBeTruthy()
    expect(screen.getByText('Mon 1 Jan')).toBeTruthy()
    expect(screen.getByText('3 of 3 rounds')).toBeTruthy()
    expect(screen.getByText('5:00')).toBeTruthy()
    expect(screen.getByText('Completed')).toBeTruthy()
  })

  it('shows Ended early for an unfinished session', () => {
    render(<SessionCard session={{ ...session, completed: false, roundsCompleted: 1 }} />)
    expect(screen.getByText('Ended early')).toBeTruthy()
  })
})

describe('QuoteCard', () => {
  it('shows a loader while loading', () => {
    useQuote.mockReturnValue({ quote: null, loading: true, error: '' })
    render(<QuoteCard />)
    expect(screen.getByText('Loading a quote...')).toBeTruthy()
  })

  it('shows an error message when the quote fails', () => {
    useQuote.mockReturnValue({ quote: null, loading: false, error: 'Could not load a quote right now.' })
    render(<QuoteCard />)
    expect(screen.getByText('Could not load a quote right now.')).toBeTruthy()
  })

  it('shows the quote, its author and the API credit', () => {
    useQuote.mockReturnValue({ quote: { text: 'Keep going', author: 'Coach' }, loading: false, error: '' })
    render(<QuoteCard />)
    expect(screen.getByText(/Keep going/)).toBeTruthy()
    expect(screen.getByText('Coach')).toBeTruthy()
    expect(screen.getByRole('link', { name: /DummyJSON/ }).getAttribute('href')).toBe('https://dummyjson.com/docs/quotes')
  })
})
