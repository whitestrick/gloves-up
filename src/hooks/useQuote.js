import { useEffect, useState } from 'react'
import { getMotivationalQuote } from '../services/quoteService'

// Loads one quote when the component appears.
// Returns the quote plus "loading" and "error", the same pattern as useRoutines and useSessions.
export default function useQuote() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // If the page closes before the answer arrives, we ignore the late answer
    let cancelled = false

    getMotivationalQuote()
      .then((data) => {
        if (!cancelled) setQuote(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load a quote right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // The empty list [] means: run once, when the component first appears
  }, [])

  return { quote, loading, error }
}
