import { useState } from 'react'
import FormInput from './FormInput'
import Button from './Button'
import { validateEmail, validatePassword } from '../utils/validators'

export default function AuthForm({ mode, onSubmit, error, submitting }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const isSignup = mode === 'signup'

  function handleSubmit(e) {
    e.preventDefault()
    const next = {
      email: validateEmail(email),
      password: isSignup ? validatePassword(password) : password ? '' : 'Enter your password.',
    }
    setErrors(next)
    if (next.email || next.password) return
    onSubmit(email.trim(), password)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormInput
        id="email"
        label="Email"
        type="email"
        placeholder="you@email.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <FormInput
        id="password"
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete={isSignup ? 'new-password' : 'current-password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      {error && (
        <p role="alert" className="text-sm text-brand">
          {error}
        </p>
      )}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
      </Button>
    </form>
  )
}
