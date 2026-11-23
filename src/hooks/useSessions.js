import { useEffect, useState } from 'react'
import useAuth from './useAuth'
import { getUserSessions } from '../services/sessionService'

// Loads the signed-in user's sessions from Firestore.
// Returns the list plus "loading" and "error" so the page can show the right thing.
export default function useSessions() {
  const { user } = useAuth()
  const uid = user ? user.uid : null

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!uid) return

    // If the page closes before the data arrives, we ignore the late answer
    let cancelled = false

    getUserSessions(uid)
      .then((data) => {
        if (!cancelled) setSessions(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your history. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [uid])

  return { sessions, loading, error }
}
