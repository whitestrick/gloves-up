import { describe, it, expect } from 'vitest'
import { buttonClasses } from './buttonStyles'

describe('buttonClasses', () => {
  it('uses the primary look by default', () => {
    expect(buttonClasses()).toContain('bg-brand')
  })

  it('gives each variant its own colours', () => {
    expect(buttonClasses('secondary')).toContain('bg-white text-ink')
    expect(buttonClasses('danger')).toContain('text-brand')
  })

  it('adds extra classes from the caller', () => {
    expect(buttonClasses('primary', 'w-full')).toContain('w-full')
  })

  it('always keeps the 44px tap target', () => {
    expect(buttonClasses('danger')).toContain('min-h-11')
  })
})
