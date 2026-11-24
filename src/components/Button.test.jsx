// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

afterEach(cleanup)

describe('Button', () => {
  it('shows its text and calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('uses different classes for different variants', () => {
    render(
      <>
        <Button>One</Button>
        <Button variant="secondary">Two</Button>
      </>,
    )
    const one = screen.getByRole('button', { name: 'One' }).className
    const two = screen.getByRole('button', { name: 'Two' }).className
    expect(one).not.toBe(two)
  })
})
