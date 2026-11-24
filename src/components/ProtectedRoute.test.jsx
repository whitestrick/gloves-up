// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import ProtectedRoute from './ProtectedRoute'

afterEach(cleanup)

// Opens /private inside a fake router, with the auth state we pass in
function renderWithAuth(authValue) {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/private" element={<p>Private page</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('shows the page when the user is logged in', () => {
    renderWithAuth({ user: { email: 'me@example.com' }, loading: false })
    expect(screen.getByText('Private page')).toBeTruthy()
  })

  it('redirects to /login when nobody is logged in', () => {
    renderWithAuth({ user: null, loading: false })
    expect(screen.getByText('Login page')).toBeTruthy()
    expect(screen.queryByText('Private page')).toBeNull()
  })

  it('does not redirect or show the page while the login is still being checked', () => {
    renderWithAuth({ user: null, loading: true })
    expect(screen.queryByText('Login page')).toBeNull()
    expect(screen.queryByText('Private page')).toBeNull()
  })
})
