import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import useAuth from '../hooks/useAuth'
import useToast from '../hooks/useToast'
import { registerUser, loginUser, friendlyError } from '../services/authService'

export default function Login() {
  const { user, loading } = useAuth()
  const { showToast } = useToast()
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isSignup = mode === 'signup'

  if (!loading && user) return <Navigate to="/routines" replace />

  function switchMode(next) {
    setMode(next)
    setError('')
  }

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

  const tab = (value, label) => (
    <button
      type="button"
      aria-pressed={mode === value}
      onClick={() => switchMode(value)}
      className={`min-h-9 cursor-pointer rounded-full border-[1.5px] px-4 text-sm ${
        mode === value ? 'border-ink bg-ink text-white' : 'border-neutral-500 bg-white text-ink'
      }`}
    >
      {label}
    </button>
  )

  return (
    <main className="flex min-h-screen flex-wrap">
      <section className="flex flex-1 basis-96 flex-col justify-center gap-4 bg-ink p-12 text-white">
        <p className="text-xl font-extrabold tracking-wide text-rose-300">GLOVES UP</p>
        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Plan it. Time it. Log it.</h1>
        <p className="text-lg text-neutral-300">
          Build boxing routines, run them with a round timer, and track every session.
        </p>
      </section>
      <section className="flex flex-1 basis-96 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg border-[1.5px] border-neutral-300 bg-white p-8">
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
        </div>
      </section>
    </main>
  )
}
