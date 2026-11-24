// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { AuthContext } from '../context/authContext'
import { getMotivationalQuote } from '../services/quoteService'
import { deleteRoutine, getUserRoutines } from '../services/routineService'
import { getUserSessions } from '../services/sessionService'
import useQuote from './useQuote'
import useRoutines from './useRoutines'
import useSessions from './useSessions'

// Fake services: no network and no Firebase
vi.mock('../services/quoteService', () => ({ getMotivationalQuote: vi.fn() }))
vi.mock('../services/routineService', () => ({ getUserRoutines: vi.fn(), deleteRoutine: vi.fn() }))
vi.mock('../services/sessionService', () => ({ getUserSessions: vi.fn() }))

afterEach(cleanup)

// Gives the hooks a signed-in user, like AuthProvider would
const wrapper = ({ children }) => (
  <AuthContext.Provider value={{ user: { uid: 'u1' }, loading: false }}>{children}</AuthContext.Provider>
)

describe('useQuote', () => {
  it('loads a quote', async () => {
    getMotivationalQuote.mockResolvedValue({ text: 'Keep going', author: 'Coach' })
    const { result } = renderHook(() => useQuote())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.quote).toEqual({ text: 'Keep going', author: 'Coach' })
  })

  it('sets a friendly error when the request fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    getMotivationalQuote.mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useQuote())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Could not load a quote right now.')
  })
})

describe('useRoutines', () => {
  it('loads the routines and removes one from the list after deleting', async () => {
    getUserRoutines.mockResolvedValue([{ id: 'a' }, { id: 'b' }])
    deleteRoutine.mockResolvedValue()
    const { result } = renderHook(() => useRoutines(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.routines).toHaveLength(2)
    await act(async () => {
      await result.current.removeRoutine('a')
    })
    expect(deleteRoutine).toHaveBeenCalledWith('a')
    expect(result.current.routines.map((routine) => routine.id)).toEqual(['b'])
  })

  it('keeps the list unchanged when deleting fails', async () => {
    getUserRoutines.mockResolvedValue([{ id: 'a' }, { id: 'b' }])
    deleteRoutine.mockRejectedValue(new Error('denied'))
    const { result } = renderHook(() => useRoutines(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => {
      await expect(result.current.removeRoutine('a')).rejects.toThrow()
    })
    expect(result.current.routines).toHaveLength(2)
  })

  it('sets an error when loading fails', async () => {
    getUserRoutines.mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useRoutines(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Could not load your routines. Please try again.')
  })
})

describe('useSessions', () => {
  it('loads the sessions', async () => {
    getUserSessions.mockResolvedValue([{ id: 's1' }])
    const { result } = renderHook(() => useSessions(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.sessions).toEqual([{ id: 's1' }])
  })

  it('sets an error when loading fails', async () => {
    getUserSessions.mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useSessions(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Could not load your history. Please try again.')
  })
})
