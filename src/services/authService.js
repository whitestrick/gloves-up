import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'

const messages = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/weak-password': 'Password must be at least 8 characters.',
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/network-request-failed': 'Network problem. Check your connection.',
}

export function friendlyError(error) {
  return messages[error.code] || 'Something went wrong. Please try again.'
}

export function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}
