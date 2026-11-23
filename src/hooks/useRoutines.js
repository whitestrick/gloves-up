import { useEffect, useState } from 'react'
import useAuth from './useAuth'
import { deleteRoutine, getUserRoutines } from '../services/routineService'

// Loads the signed-in user's routines from Firestore.
// It returns the list plus "loading" and "error" so the page can show the right thing,
// and removeRoutine so the page can delete one.
export default function useRoutines() {
  const { user } = useAuth()
  const uid = user ? user.uid : null

  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Runs after the first render, and again if the user changes
  useEffect(() => {
    if (!uid) return

    // If the page closes before the data arrives, we ignore the late answer
    let cancelled = false

    getUserRoutines(uid)
      .then((data) => {
        if (!cancelled) setRoutines(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your routines. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    // Cleanup function: React runs it when the component leaves the screen
    return () => {
      cancelled = true
    }
  }, [uid])

  // NEW: delete in Firestore FIRST, then remove it from the list on screen.
  // If Firestore fails, the error is thrown before the list changes, so the
  // screen never shows a routine as deleted when it still exists.
  async function removeRoutine(id) {
    await deleteRoutine(id)
    // (current) => ... works from the latest list; filter keeps every routine except this one
    setRoutines((current) => current.filter((routine) => routine.id !== id))
  }

  return { routines, loading, error, removeRoutine }
}
