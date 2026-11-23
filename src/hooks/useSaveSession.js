import { useCallback, useRef, useState } from 'react'
import useAuth from './useAuth'
import { createSession } from '../services/sessionService'

// Saves a session and keeps track of how it went.
// It also makes sure the same workout can never be saved TWICE.
// Returns: status ('idle' | 'saving' | 'saved' | 'error') and save(sessionData).
export default function useSaveSession() {
  const { user } = useAuth()
  const uid = user ? user.uid : null

  const [status, setStatus] = useState('idle')

  // A ref is perfect for a "have I already done this?" flag: changing it does not re-render,
  // and the new value is visible immediately (state would only update on the next render).
  const savedRef = useRef(false)

  // useCallback keeps "save" the same function between renders,
  // so an effect that uses it does not run again and again.
  const save = useCallback(
    async (sessionData) => {
      if (savedRef.current) return true // already saved or being saved: do nothing
      savedRef.current = true
      setStatus('saving')
      try {
        await createSession(uid, sessionData)
        setStatus('saved')
        return true
      } catch {
        savedRef.current = false // allow another try
        setStatus('error')
        return false
      }
    },
    [uid],
  )

  return { status, save }
}
