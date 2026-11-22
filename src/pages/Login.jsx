import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import useToast from '../hooks/useToast'
import { registerUser, friendlyError } from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleRegister(email, password) {
    setError('')
    setSubmitting(true)
    try {
      await registerUser(email, password)
      showToast('Account created. Welcome to Gloves Up!')
      navigate('/routines')
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setSubmitting(false)
    }
  }

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
          <h2 className="mb-4 text-2xl font-bold">Create account</h2>
          <AuthForm mode="signup" onSubmit={handleRegister} error={error} submitting={submitting} />
        </div>
      </section>
    </main>
  )
}
