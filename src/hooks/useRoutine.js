import { useEffect, useState } from 'react'
import { getRoutine } from '../services/routineService'

// Loads ONE routine by id. Same idea as useRoutines, but for a single document.
// Returns the routine plus "loading" and "error" so the page can show the right thing.
export default function useRoutine(id) {
  const [routine, setRoutine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // If the user leaves before the answer arrives, we ignore the late answer
    let cancelled = false

    getRoutine(id)
      .then((data) => {
        if (cancelled) return
        if (data) {
          setRoutine(data)
        } else {
          setError('Routine not found.')
        }
      })
      .catch(() => {
        // Also happens when the routine belongs to someone else: the security rules refuse the read
        if (!cancelled) setError('Could not load this routine. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { routine, loading, error }
}
