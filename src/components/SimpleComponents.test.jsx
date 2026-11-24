// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import LinkButton from './LinkButton'

afterEach(cleanup)

describe('Loader', () => {
  it('shows the default and a custom label', () => {
    const { rerender } = render(<Loader />)
    expect(screen.getByRole('status').textContent).toContain('Loading...')
    rerender(<Loader label="Loading your routines..." />)
    expect(screen.getByText('Loading your routines...')).toBeTruthy()
  })
})

describe('ErrorMessage', () => {
  it('announces the message as an alert', () => {
    render(<ErrorMessage message="Could not load." />)
    expect(screen.getByRole('alert').textContent).toBe('Could not load.')
  })
})

describe('EmptyState', () => {
  it('shows the title, message and the action passed as children', () => {
    render(
      <EmptyState title="No routines yet" message="Build your first one.">
        <button>Create</button>
      </EmptyState>,
    )
    expect(screen.getByRole('heading', { name: 'No routines yet' })).toBeTruthy()
    expect(screen.getByText('Build your first one.')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Create' })).toBeTruthy()
  })
})

describe('LinkButton', () => {
  it('renders a link that points to the right page', () => {
    render(
      <MemoryRouter>
        <LinkButton to="/routines/new">New routine</LinkButton>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'New routine' }).getAttribute('href')).toBe('/routines/new')
  })
})
