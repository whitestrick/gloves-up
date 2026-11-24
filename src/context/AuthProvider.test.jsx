// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import AuthProvider from './AuthProvider'
import useAuth from '../hooks/useAuth'

// Replace Firebase so nothing real starts up during the test
vi.mock('../services/firebase', () => ({ auth: {} }))
vi.mock('firebase/auth', () => ({
  // Pretend Firebase instantly tells us that a user is signed in
  onAuthStateChanged: (auth, callback) => {
    callback({ email: 'me@example.com' })
    return () => {}
  },
}))

afterEach(cleanup)

function Show() {
  const { user, loading } = useAuth()
  if (loading) return <p>checking</p>
  return <p>{user ? user.email : 'no user'}</p>
}

describe('AuthProvider', () => {
  it('puts the signed-in user in context and stops loading', async () => {
    render(
      <AuthProvider>
        <Show />
      </AuthProvider>,
    )
    expect(await screen.findByText('me@example.com')).toBeTruthy()
  })
})
