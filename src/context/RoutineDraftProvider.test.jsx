// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import RoutineDraftProvider from './RoutineDraftProvider'
import useRoutineDraft from '../hooks/useRoutineDraft'

afterEach(cleanup)

// A tiny component that shows the draft and has a button for each action
function Demo() {
  const { draft, updateDraft, addDrill, removeDrill, resetDraft } = useRoutineDraft()
  return (
    <div>
      <p data-testid="name">{draft.name}</p>
      <p data-testid="drills">{draft.drillIds.join(',')}</p>
      <button onClick={() => updateDraft({ name: 'Cardio' })}>set name</button>
      <button onClick={() => addDrill('jab')}>add jab</button>
      <button onClick={() => addDrill('cross')}>add cross</button>
      <button onClick={() => removeDrill('jab')}>remove jab</button>
      <button onClick={resetDraft}>reset</button>
    </div>
  )
}

function setup() {
  render(
    <RoutineDraftProvider>
      <Demo />
    </RoutineDraftProvider>,
  )
}

describe('RoutineDraftProvider', () => {
  it('starts empty', () => {
    setup()
    expect(screen.getByTestId('name').textContent).toBe('')
    expect(screen.getByTestId('drills').textContent).toBe('')
  })

  it('updates fields and adds drills without duplicates', () => {
    setup()
    fireEvent.click(screen.getByText('set name'))
    fireEvent.click(screen.getByText('add jab'))
    fireEvent.click(screen.getByText('add jab'))
    fireEvent.click(screen.getByText('add cross'))
    expect(screen.getByTestId('name').textContent).toBe('Cardio')
    expect(screen.getByTestId('drills').textContent).toBe('jab,cross')
  })

  it('removes a drill', () => {
    setup()
    fireEvent.click(screen.getByText('add jab'))
    fireEvent.click(screen.getByText('add cross'))
    fireEvent.click(screen.getByText('remove jab'))
    expect(screen.getByTestId('drills').textContent).toBe('cross')
  })

  it('resets everything', () => {
    setup()
    fireEvent.click(screen.getByText('set name'))
    fireEvent.click(screen.getByText('add jab'))
    fireEvent.click(screen.getByText('reset'))
    expect(screen.getByTestId('name').textContent).toBe('')
    expect(screen.getByTestId('drills').textContent).toBe('')
  })
})
