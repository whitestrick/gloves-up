import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import Button from '../components/Button' // NEW: reused for the Google button
import useAuth from '../hooks/useAuth'
import useToast from '../hooks/useToast'
import { registerUser, loginUser, loginWithGoogle, friendlyError } from '../services/authService'

export default function Login() {
  const { user, loading } = useAuth() // user comes from AuthContext
  const { showToast } = useToast()
  const location = useLocation() // NEW: ProtectedRoute stores the blocked page here
  const from = location.state?.from?.pathname || '/routines' // NEW: where to go after login
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isSignup = mode === 'signup'

  // If the user is already logged in (email OR Google), send them to the app
  if (!loading && user) return <Navigate to={from} replace />

  function switchMode(next) {
    setMode(next)
    setError('')
  }

  // Runs when the email/password form is submitted
  async function handleSubmit(email, password) {
    setError('')
    setSubmitting(true)
    try {
      if (isSignup) {
        await registerUser(email, password)
        showToast('Account created. Welcome to Gloves Up!')
      } else {
        await loginUser(email, password)
        showToast('Welcome back!')
      }
    } catch (err) {
      setError(friendlyError(err))
      setSubmitting(false)
    }
  }

  // NEW: runs when the user clicks "Continue with Google".
  // Same pattern as handleSubmit: clear the old error, disable the button,
  // try the sign-in, and show a friendly message if it fails.
  async function handleGoogle() {
    setError('')
    setSubmitting(true)
    try {
      await loginWithGoogle()
      showToast('Signed in with Google!')
    } catch (err) {
      setError(friendlyError(err))
      setSubmitting(false)
    }
  }

  // Small helper that builds one of the two Log in / Sign up tab buttons
  const tab = (value, label) => (
    <button
      type="button"
      aria-pressed={mode === value}
      onClick={() => switchMode(value)}
      className={`min-h-11 cursor-pointer rounded-full border-[1.5px] px-4 text-sm ${
        mode === value ? 'border-ink bg-ink text-white' : 'border-neutral-500 bg-white text-ink'
      }`}
    >
      {label}
    </button>
  )

  return (
    <main className="flex min-h-dvh flex-wrap">
      <section className="flex flex-1 basis-96 flex-col justify-center gap-4 bg-ink p-6 text-white sm:p-12">
        <p className="text-xl font-extrabold tracking-wide text-rose-300">GLOVES UP</p>
        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Plan it. Time it. Log it.</h1>
        <p className="text-lg text-neutral-300">
          Build boxing routines, run them with a round timer, and track every session.
        </p>
      </section>
      <section className="flex flex-1 basis-96 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-lg border-[1.5px] border-neutral-300 bg-white p-5 sm:p-8">
          <div className="mb-4 flex gap-2">
            {tab('login', 'Log in')}
            {tab('signup', 'Sign up')}
          </div>
          <h2 className="mb-4 text-2xl font-bold">{isSignup ? 'Create account' : 'Welcome back'}</h2>
          <AuthForm
            key={mode}
            mode={mode}
            onSubmit={handleSubmit}
            error={error}
            submitting={submitting}
          />
          {/* NEW: divider + Google button */}
          <p className="my-4 text-center text-sm text-neutral-600">or</p>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleGoogle}
            disabled={submitting}
          >
            Continue with Google
          </Button>
        </div>
      </section>
    </main>
  )
}
