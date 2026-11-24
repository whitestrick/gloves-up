import { describe, expect, it, vi } from 'vitest'
import * as firestore from 'firebase/firestore'
import {
  createRoutine,
  deleteRoutine,
  getRoutine,
  getUserRoutines,
  updateRoutine,
} from './routineService'

// Replace our Firebase setup and the Firestore functions, so no real database is used
vi.mock('./firebase', () => ({ db: { fake: 'db' } }))
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    addDoc: vi.fn(),
    collection: vi.fn((db, name) => ({ db, name })),
    deleteDoc: vi.fn(),
    doc: vi.fn((db, name, id) => ({ db, name, id })),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn((ref) => ref),
    serverTimestamp: vi.fn(() => 'SERVER_TIME'),
    updateDoc: vi.fn(),
    where: vi.fn(),
  }
})

describe('routineService', () => {
  it('createRoutine saves the routine with the user id and a server timestamp', async () => {
    firestore.addDoc.mockResolvedValue({ id: 'new1' })
    await createRoutine('user-1', { name: 'Cardio' })
    expect(firestore.addDoc).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'routines' }),
      expect.objectContaining({ name: 'Cardio', userId: 'user-1', createdAt: 'SERVER_TIME' }),
    )
  })

  it('getUserRoutines returns the routines newest first, each with its id', async () => {
    firestore.getDocs.mockResolvedValue({
      docs: [
        { id: 'a', data: () => ({ name: 'Old', createdAt: { toMillis: () => 1 } }) },
        { id: 'b', data: () => ({ name: 'New', createdAt: { toMillis: () => 2 } }) },
      ],
    })
    const routines = await getUserRoutines('user-1')
    expect(routines.map((routine) => routine.id)).toEqual(['b', 'a'])
    expect(routines[0].name).toBe('New')
  })

  it('getRoutine returns the routine with its id', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => true, id: 'r1', data: () => ({ name: 'Cardio' }) })
    expect(await getRoutine('r1')).toEqual({ id: 'r1', name: 'Cardio' })
  })

  it.skip('getRoutine throws when the routine does not exist', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false })
    await expect(getRoutine('missing')).rejects.toThrow()
  })

  it('updateRoutine changes the fields and sets updatedAt', async () => {
    await updateRoutine('r1', { name: 'New name' })
    expect(firestore.updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'r1' }),
      expect.objectContaining({ name: 'New name', updatedAt: 'SERVER_TIME' }),
    )
  })

  it('deleteRoutine deletes the right document', async () => {
    await deleteRoutine('r1')
    expect(firestore.deleteDoc).toHaveBeenCalledWith(expect.objectContaining({ id: 'r1' }))
  })
})
