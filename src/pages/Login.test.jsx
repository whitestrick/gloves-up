// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import { loginUser, loginWithGoogle, registerUser } from '../services/authService'
import Login from './Login'

// Fake auth service: Firebase never starts, and we choose what each call does
vi.mock('../services/authService', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  loginWithGoogle: vi.fn(),
  friendlyError: (error) => `Friendly: ${error.message}`,
}))

afterEach(cleanup)

// Opens /login with the given auth state; /routines is where a logged-in user is sent
function setup(authValue = { user: null, loading: false }) {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/routines" element={<p>Routines page</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

async function fillIn(email, password) {
  await userEvent.type(screen.getByLabelText('Email'), email)
  await userEvent.type(screen.getByLabelText('Password'), password)
}

describe('Login page', () => {
  it('shows the log in form and the Google button', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeTruthy()
  })

  it('switches to the sign up form', async () => {
    setup()
    await userEvent.click(screen.getByRole('button', { name: 'Sign up' }))
    expect(screen.getByRole('heading', { name: 'Create account' })).toBeTruthy()
  })

  it('logs in with email and password', async () => {
    loginUser.mockResolvedValue()
    setup()
    await fillIn('me@example.com', 'secret123')
    // There are two "Log in" buttons: the tab and the submit button (the second one)
    await userEvent.click(screen.getAllByRole('button', { name: 'Log in' })[1])
    expect(loginUser).toHaveBeenCalledWith('me@example.com', 'secret123')
  })

  it('shows a friendly error when logging in fails', async () => {
    loginUser.mockRejectedValue(new Error('bad login'))
    setup()
    await fillIn('me@example.com', 'secret123')
    await userEvent.click(screen.getAllByRole('button', { name: 'Log in' })[1])
    expect(await screen.findByText('Friendly: bad login')).toBeTruthy()
  })

  it('creates an account from the sign up form', async () => {
    registerUser.mockResolvedValue()
    setup()
    await userEvent.click(screen.getByRole('button', { name: 'Sign up' }))
    await fillIn('new@example.com', 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(registerUser).toHaveBeenCalledWith('new@example.com', 'secret123')
  })

  it('signs in with Google', async () => {
    loginWithGoogle.mockResolvedValue()
    setup()
    await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }))
    expect(loginWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('shows a friendly error when Google sign-in fails', async () => {
    loginWithGoogle.mockRejectedValue(new Error('popup closed'))
    setup()
    await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }))
    expect(await screen.findByText('Friendly: popup closed')).toBeTruthy()
  })

  it('sends a logged-in user straight to the app', () => {
    setup({ user: { uid: 'u1', email: 'me@example.com' }, loading: false })
    expect(screen.getByText('Routines page')).toBeTruthy()
  })
})
