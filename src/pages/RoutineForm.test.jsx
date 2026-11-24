// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import RoutineDraftProvider from '../context/RoutineDraftProvider'
import ToastProvider from '../context/ToastProvider'
import useRoutineDraft from '../hooks/useRoutineDraft'
import { drills } from '../data/drills'
import { createRoutine, getRoutine, updateRoutine } from '../services/routineService'
import RoutineForm from './RoutineForm'

// Replace the Firestore service so no real database is used
vi.mock('../services/routineService', () => ({
  createRoutine: vi.fn(),
  getRoutine: vi.fn(),
  updateRoutine: vi.fn(),
}))

afterEach(cleanup)

// A test-only button that adds a drill to the draft, like the Drills page would
function AddDrill() {
  const { addDrill } = useRoutineDraft()
  return <button onClick={() => addDrill(drills[0].id)}>test add first drill</button>
}

// Opens the form at the given URL inside all the providers it needs
function renderForm(path) {
  return render(
    <AuthContext.Provider value={{ user: { uid: 'user-1', email: 'me@example.com' }, loading: false }}>
      <ToastProvider>
        <RoutineDraftProvider>
          <MemoryRouter initialEntries={[path]}>
            <AddDrill />
            <Routes>
              <Route path="/routines" element={<p>Routines list page</p>} />
              <Route path="/routines/new" element={<RoutineForm />} />
              <Route path="/routines/:id/edit" element={<RoutineForm />} />
            </Routes>
          </MemoryRouter>
        </RoutineDraftProvider>
      </ToastProvider>
    </AuthContext.Provider>,
  )
}

describe('RoutineForm (new routine)', () => {
  it('shows the default total time', () => {
    renderForm('/routines/new')
    expect(screen.getByRole('heading', { name: 'New routine' })).toBeTruthy()
    expect(screen.getByText('11:00')).toBeTruthy()
  })

  it('shows validation messages and does not save an empty form', async () => {
    renderForm('/routines/new')
    await userEvent.click(screen.getByRole('button', { name: 'Save routine' }))
    expect(screen.getByText('Give your routine a name.')).toBeTruthy()
    expect(screen.getByText('Add at least one drill.')).toBeTruthy()
    expect(createRoutine).not.toHaveBeenCalled()
  })

  it('rejects a number of rounds outside 1 to 20', async () => {
    renderForm('/routines/new')
    const rounds = screen.getByLabelText('Rounds (1-20)')
    await userEvent.clear(rounds)
    await userEvent.type(rounds, '25')
    await userEvent.click(screen.getByRole('button', { name: 'Save routine' }))
    expect(screen.getByText('Rounds must be a whole number from 1 to 20.')).toBeTruthy()
  })

  it('saves a valid routine with the user id and goes to the list', async () => {
    createRoutine.mockResolvedValue({ id: 'new1' })
    renderForm('/routines/new')
    await userEvent.type(screen.getByLabelText('Routine name'), 'Cardio blast')
    await userEvent.click(screen.getByText('test add first drill'))
    await userEvent.click(screen.getByRole('button', { name: 'Save routine' }))
    expect(await screen.findByText('Routines list page')).toBeTruthy()
    expect(createRoutine).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ name: 'Cardio blast', rounds: 3, roundSeconds: 180, restSeconds: 60, totalSeconds: 660 }),
    )
  })

  it('shows an error message when saving fails', async () => {
    createRoutine.mockRejectedValue(new Error('network'))
    renderForm('/routines/new')
    await userEvent.type(screen.getByLabelText('Routine name'), 'Cardio blast')
    await userEvent.click(screen.getByText('test add first drill'))
    await userEvent.click(screen.getByRole('button', { name: 'Save routine' }))
    expect(await screen.findByText('Could not save your routine. Please try again.')).toBeTruthy()
  })
})

describe('RoutineForm (edit routine)', () => {
  it('loads the routine into the form and updates it', async () => {
    getRoutine.mockResolvedValue({
      id: 'r1',
      name: 'Old name',
      rounds: 4,
      roundSeconds: 120,
      restSeconds: 30,
      drillIds: [drills[0].id],
      totalSeconds: 570,
    })
    updateRoutine.mockResolvedValue()
    renderForm('/routines/r1/edit')
    expect(await screen.findByRole('heading', { name: 'Edit routine' })).toBeTruthy()
    expect(screen.getByLabelText('Routine name').value).toBe('Old name')
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(await screen.findByText('Routines list page')).toBeTruthy()
    expect(updateRoutine).toHaveBeenCalledWith('r1', expect.objectContaining({ name: 'Old name', rounds: 4 }))
  })

  it.skip('shows an error when the routine cannot be loaded', async () => {
    getRoutine.mockRejectedValue(new Error('not found'))
    renderForm('/routines/missing/edit')
    expect(await screen.findByText('Could not load this routine. It may not exist.')).toBeTruthy()
  })
})
