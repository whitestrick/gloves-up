// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from './ConfirmDialog'

// jsdom cannot open a <dialog> by itself, so we teach it the two methods the component uses
beforeAll(() => {
  const proto = (window.HTMLDialogElement || window.HTMLElement).prototype
  proto.showModal = function () {
    this.setAttribute('open', '')
  }
  proto.close = function () {
    this.removeAttribute('open')
  }
})

afterEach(cleanup)

const baseProps = {
  title: 'Delete this routine?',
  message: 'It cannot be undone.',
  confirmLabel: 'Yes, delete',
  onConfirm: () => {},
  onCancel: () => {},
}

describe('ConfirmDialog', () => {
  it('stays closed when open is false', () => {
    const { container } = render(<ConfirmDialog {...baseProps} open={false} />)
    expect(container.querySelector('dialog').hasAttribute('open')).toBe(false)
  })

  it('opens and shows the title and message when open is true', () => {
    const { container } = render(<ConfirmDialog {...baseProps} open />)
    expect(container.querySelector('dialog').hasAttribute('open')).toBe(true)
    expect(screen.getByRole('heading', { name: 'Delete this routine?' })).toBeTruthy()
    expect(screen.getByText('It cannot be undone.')).toBeTruthy()
  })

  it('calls onConfirm and onCancel from its buttons', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(<ConfirmDialog {...baseProps} open onConfirm={onConfirm} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: 'Yes, delete' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when the Escape key fires the cancel event', () => {
    const onCancel = vi.fn()
    const { container } = render(<ConfirmDialog {...baseProps} open onCancel={onCancel} />)
    fireEvent(container.querySelector('dialog'), new Event('cancel', { cancelable: true }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('disables the buttons and ignores Escape while busy', () => {
    const onCancel = vi.fn()
    const { container } = render(<ConfirmDialog {...baseProps} open busy onCancel={onCancel} />)
    expect(screen.getByRole('button', { name: 'Deleting...' }).disabled).toBe(true)
    expect(screen.getByRole('button', { name: 'Cancel' }).disabled).toBe(true)
    fireEvent(container.querySelector('dialog'), new Event('cancel', { cancelable: true }))
    expect(onCancel).not.toHaveBeenCalled()
  })
})
