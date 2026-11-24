// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DrillCard from './DrillCard'

afterEach(cleanup)

const drill = { id: 'jab', name: 'Jab', category: 'Punches', description: 'Straight punch with the lead hand.' }

describe('DrillCard', () => {
  it('shows the drill details and no button when onToggle is not given', () => {
    render(<DrillCard drill={drill} />)
    expect(screen.getByText('Jab')).toBeTruthy()
    expect(screen.getByText('Punches')).toBeTruthy()
    expect(screen.getByText('Straight punch with the lead hand.')).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('calls onToggle with the drill id when the button is clicked', async () => {
    const onToggle = vi.fn()
    render(<DrillCard drill={drill} onToggle={onToggle} />)
    const button = screen.getByRole('button')
    expect(button.textContent).toContain('Add to routine')
    await userEvent.click(button)
    expect(onToggle).toHaveBeenCalledWith('jab')
  })

  it('offers to remove the drill when it is selected', () => {
    render(<DrillCard drill={drill} selected onToggle={() => {}} />)
    expect(screen.getByRole('button').textContent).toContain('Remove from routine')
  })
})
