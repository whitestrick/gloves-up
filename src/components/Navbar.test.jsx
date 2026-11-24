// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import ToastProvider from '../context/ToastProvider'
import { logoutUser } from '../services/authService'
import Navbar from './Navbar'

vi.mock('../services/authService', () => ({ logoutUser: vi.fn() }))

afterEach(cleanup)

// Shows the navbar on /routines. After logging out it should move to /login.
function setup(user) {
  return render(
    <AuthContext.Provider value={{ user, loading: false }}>
      <ToastProvider>
        <MemoryRouter initialEntries={['/routines']}>
          <Navbar />
          <Routes>
            <Route path="/login" element={<p>Login page</p>} />
            <Route path="*" element={<p>Other page</p>} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </AuthContext.Provider>,
  )
}

describe('Navbar', () => {
  it('shows the navigation links', () => {
    setup(null)
    expect(screen.getByRole('link', { name: 'Drills' }).getAttribute('href')).toBe('/drills')
    expect(screen.getByRole('link', { name: 'Routines' }).getAttribute('href')).toBe('/routines')
    expect(screen.getByRole('link', { name: 'History' }).getAttribute('href')).toBe('/history')
  })

  it('shows a Log in link when nobody is logged in', () => {
    setup(null)
    expect(screen.getByRole('link', { name: 'Log in' }).getAttribute('href')).toBe('/login')
    expect(screen.queryByRole('button', { name: 'Log out' })).toBeNull()
  })

  it('shows the email and a Log out button when logged in', () => {
    setup({ uid: 'u1', email: 'me@example.com' })
    expect(screen.getByText('me@example.com')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Log out' })).toBeTruthy()
  })

  it('logs out and goes to the login page', async () => {
    logoutUser.mockResolvedValue()
    setup({ uid: 'u1', email: 'me@example.com' })
    await userEvent.click(screen.getByRole('button', { name: 'Log out' }))
    expect(await screen.findByText('Login page')).toBeTruthy()
    expect(logoutUser).toHaveBeenCalledTimes(1)
  })

  it('shows a message when logging out fails', async () => {
    logoutUser.mockRejectedValue(new Error('network'))
    setup({ uid: 'u1', email: 'me@example.com' })
    await userEvent.click(screen.getByRole('button', { name: 'Log out' }))
    expect(await screen.findByText('Could not log out. Try again.')).toBeTruthy()
  })
})
