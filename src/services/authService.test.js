import { describe, it, expect, vi } from 'vitest'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { registerUser, loginUser, loginWithGoogle, logoutUser, friendlyError } from './authService'

// Swap the two modules authService imports for fakes.
// vi.mock calls are moved to the top of the file automatically, before the imports run.
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}))
vi.mock('./firebase', () => ({
  auth: { name: 'fake-auth' },
  googleProvider: { name: 'fake-google' },
}))

describe('auth functions', () => {
  it('registerUser creates the account with the auth object, email and password', async () => {
    createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u1' } })

    const result = await registerUser('you@email.com', 'password123')

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'you@email.com', 'password123')
    expect(result).toEqual({ user: { uid: 'u1' } })
  })

  it('loginUser signs in with email and password', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u1' } })

    await loginUser('you@email.com', 'password123')

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'you@email.com', 'password123')
  })

  it('loginWithGoogle opens the Google popup', async () => {
    signInWithPopup.mockResolvedValue({ user: { uid: 'g1' } })

    await loginWithGoogle()

    expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider)
  })

  it('logoutUser signs out', async () => {
    signOut.mockResolvedValue()

    await logoutUser()

    expect(signOut).toHaveBeenCalledWith(auth)
  })

  it('passes a Firebase failure on to the caller', async () => {
    const failure = { code: 'auth/invalid-credential' }
    signInWithEmailAndPassword.mockRejectedValue(failure)

    await expect(loginUser('a@b.com', 'wrongpass1')).rejects.toBe(failure)
  })
})

describe('friendlyError', () => {
  it.each([
    ['auth/email-already-in-use', 'An account with this email already exists.'],
    ['auth/invalid-credential', 'Wrong email or password.'],
    ['auth/user-not-found', 'Wrong email or password.'],
    ['auth/too-many-requests', 'Too many attempts. Try again later.'],
    ['auth/network-request-failed', 'Network problem. Check your connection.'],
    ['auth/popup-closed-by-user', 'Google sign-in was cancelled.'],
    ['auth/popup-blocked', 'Your browser blocked the popup. Allow popups and try again.'],
  ])('turns %s into a readable message', (code, message) => {
    expect(friendlyError({ code })).toBe(message)
  })

  it('uses a general message for an unknown code', () => {
    expect(friendlyError({ code: 'auth/something-new' })).toBe('Something went wrong. Please try again.')
  })

  it('uses a general message when the error has no code at all', () => {
    expect(friendlyError(new Error('boom'))).toBe('Something went wrong. Please try again.')
  })
})
