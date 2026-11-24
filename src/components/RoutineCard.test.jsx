// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RoutineCard from './RoutineCard'

afterEach(cleanup)

const routine = {
  id: 'r1',
  name: 'Cardio blast',
  rounds: 3,
  roundSeconds: 180,
  restSeconds: 60,
  drillIds: ['jab', 'cross'],
  totalSeconds: 660,
}

describe('RoutineCard', () => {
  it('shows the name and the total time', () => {
    render(
      <MemoryRouter>
        <RoutineCard routine={routine} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Cardio blast' })).toBeTruthy()
    expect(screen.getByText('11:00')).toBeTruthy()
  })

  it('links to the workout and edit pages for this routine', () => {
    render(
      <MemoryRouter>
        <RoutineCard routine={routine} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /start/i }).getAttribute('href')).toBe('/workout/r1')
    expect(screen.getByRole('link', { name: /edit/i }).getAttribute('href')).toBe('/routines/r1/edit')
  })
})
