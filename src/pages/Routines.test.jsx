// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ToastProvider from '../context/ToastProvider'
import useRoutines from '../hooks/useRoutines'
import Routines from './Routines'

// The page is tested with a fake hook, so no database is needed
vi.mock('../hooks/useRoutines', () => ({ default: vi.fn() }))

// jsdom cannot open a <dialog> by itself, so we teach it the two methods ConfirmDialog uses
beforeAll(() => {
  const proto = (window.HTMLDialogElement || window.HTMLElement).prototype
  proto.showModal = function () {
    this.setAttribute('open', '')
  }
  proto.close = function () {
    this.removeAttribute('open')
  }
})

afterEach(cleanup)

const routines = [
  { id: 'r1', name: 'Cardio blast', rounds: 3, roundSeconds: 180, restSeconds: 60, drillIds: ['jab'], totalSeconds: 660 },
]

// Shows the page with whatever the fake hook should return
function setup(hookResult) {
  useRoutines.mockReturnValue({ routines: [], loading: false, error: '', removeRoutine: vi.fn(), ...hookResult })
  return render(
    <ToastProvider>
      <MemoryRouter>
        <Routines />
      </MemoryRouter>
    </ToastProvider>,
  )
}

describe('Routines page', () => {
  it('shows a loader while loading', () => {
    setup({ loading: true })
    expect(screen.getByText('Loading your routines...')).toBeTruthy()
  })

  it('shows an error message', () => {
    setup({ error: 'Could not load your routines. Please try again.' })
    expect(screen.getByText('Could not load your routines. Please try again.')).toBeTruthy()
  })

  it('shows the empty state with a link to create a routine', () => {
    setup({})
    expect(screen.getByRole('heading', { name: 'No routines yet' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Create a routine' })).toBeTruthy()
  })

  it('lists the routines', () => {
    setup({ routines })
    expect(screen.getByRole('heading', { name: 'Cardio blast' })).toBeTruthy()
  })

  it('deletes a routine after the user confirms', async () => {
    const removeRoutine = vi.fn().mockResolvedValue()
    setup({ routines, removeRoutine })
    await userEvent.click(screen.getByRole('button', { name: /^delete/i }))
    await userEvent.click(screen.getByRole('button', { name: 'Yes, delete' }))
    await waitFor(() => expect(removeRoutine).toHaveBeenCalledWith('r1'))
    expect(await screen.findByText('Routine deleted')).toBeTruthy()
  })

  it('does not delete anything when the user cancels', async () => {
    const removeRoutine = vi.fn()
    setup({ routines, removeRoutine })
    await userEvent.click(screen.getByRole('button', { name: /^delete/i }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(removeRoutine).not.toHaveBeenCalled()
  })

  it('tells the user when deleting fails', async () => {
    const removeRoutine = vi.fn().mockRejectedValue(new Error('network'))
    setup({ routines, removeRoutine })
    await userEvent.click(screen.getByRole('button', { name: /^delete/i }))
    await userEvent.click(screen.getByRole('button', { name: 'Yes, delete' }))
    expect(await screen.findByText('Could not delete the routine. Try again.')).toBeTruthy()
  })
})
