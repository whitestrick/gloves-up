import { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContext } from './toastContext'

export default function ToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const timer = useRef(null)

  const showToast = useCallback((text) => {
    setMessage(text)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(''), 3000)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div role="status" aria-live="polite">
        {message && (
          <p className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink px-5 py-3 text-white shadow-lg">
            {message}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  )
}
