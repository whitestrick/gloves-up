// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import ToastProvider from './ToastProvider'
import useToast from '../hooks/useToast'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

// A tiny component that uses the context, so we can test the provider
function Demo() {
  const { showToast } = useToast()
  return <button onClick={() => showToast('Saved!')}>Go</button>
}

describe('ToastProvider', () => {
  it('shows a toast and hides it again after 3 seconds', () => {
    vi.useFakeTimers()
    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    )
    fireEvent.click(screen.getByText('Go'))
    expect(screen.getByText('Saved!')).toBeTruthy()
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.queryByText('Saved!')).toBeNull()
  })
})
