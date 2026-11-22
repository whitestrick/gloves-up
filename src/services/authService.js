import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup, // NEW: opens the Google account popup
  signOut,
} from 'firebase/auth'
import { auth, googleProvider } from './firebase' // NEW: googleProvider was already exported

// Turns Firebase error codes into messages a normal person can read
const messages = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/weak-password': 'Password must be at least 8 characters.',
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/user-not-found': 'Wrong email or password.',
  'auth/wrong-password': 'Wrong email or password.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/network-request-failed': 'Network problem. Check your connection.',
  // NEW: errors that only happen with the Google popup
  'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  'auth/cancelled-popup-request': 'Google sign-in was cancelled.',
  'auth/popup-blocked': 'Your browser blocked the popup. Allow popups and try again.',
}

export function friendlyError(error) {
  return messages[error.code] || 'Something went wrong. Please try again.'
}

export function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

// NEW: Google sign-in. Firebase opens a popup, the user picks an account,
// and Firebase handles the whole OAuth process for us.
export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export function logoutUser() {
  return signOut(auth)
}
