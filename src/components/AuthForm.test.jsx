// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthForm from './AuthForm'

afterEach(cleanup)

describe('AuthForm', () => {
  it('shows messages and does not submit when the login form is empty', async () => {
    const onSubmit = vi.fn()
    render(<AuthForm mode="login" onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
    expect(screen.getByText('Enter your email.')).toBeTruthy()
    expect(screen.getByText('Enter your password.')).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects an invalid email', async () => {
    const onSubmit = vi.fn()
    render(<AuthForm mode="login" onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email')
    await userEvent.type(screen.getByLabelText('Password'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
    expect(screen.getByText('Enter a valid email address.')).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects a short password when signing up', async () => {
    const onSubmit = vi.fn()
    render(<AuthForm mode="signup" onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText('Email'), 'me@example.com')
    await userEvent.type(screen.getByLabelText('Password'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(screen.getByText('Password must be at least 8 characters.')).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with the email and password when everything is valid', async () => {
    const onSubmit = vi.fn()
    render(<AuthForm mode="login" onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText('Email'), 'me@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
    expect(onSubmit).toHaveBeenCalledWith('me@example.com', 'secret123')
  })

  it('shows the error passed in and disables the button while submitting', () => {
    render(<AuthForm mode="login" onSubmit={() => {}} error="Wrong email or password." submitting />)
    expect(screen.getByRole('alert').textContent).toBe('Wrong email or password.')
    expect(screen.getByRole('button', { name: 'Please wait...' }).disabled).toBe(true)
  })
})
