// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import FormInput from './FormInput'

afterEach(cleanup)

describe('FormInput', () => {
  it('connects the label to the input', () => {
    render(<FormInput id="email" label="Email" />)
    expect(screen.getByLabelText('Email')).toBeTruthy()
  })

  it('marks the input invalid and shows the error message', () => {
    render(<FormInput id="email" label="Email" error="Enter your email." />)
    const input = screen.getByLabelText('Email')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('email-error')
    expect(screen.getByText('Enter your email.')).toBeTruthy()
  })

  it('is valid and shows no message when there is no error', () => {
    render(<FormInput id="email" label="Email" />)
    expect(screen.getByLabelText('Email').getAttribute('aria-invalid')).toBe('false')
  })
})
