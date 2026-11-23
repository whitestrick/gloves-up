import { useEffect, useRef } from 'react'
import Button from './Button'

// A pop-up that asks "are you sure?". It uses the browser's built-in <dialog> element,
// which gives us for free: a dimmed backdrop, keyboard focus kept inside the dialog,
// and the Esc key to close it. That is better for accessibility than building our own.
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  busy = false,
  onConfirm,
  onCancel,
}) {
  // useRef gives us direct access to the <dialog> DOM element,
  // because opening it means calling a method (showModal), not setting a prop
  const dialogRef = useRef(null)

  // Keep the real dialog in step with the "open" prop
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      // Esc fires "cancel". We stop the browser closing it itself and let the parent decide,
      // so "open" stays the single source of truth.
      onCancel={(e) => {
        e.preventDefault()
        if (!busy) onCancel()
      }}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border-[1.5px] border-neutral-300 bg-white p-6 backdrop:bg-ink/60"
    >
      <h2 id="confirm-title" className="text-xl font-bold">
        {title}
      </h2>
      <p id="confirm-message" className="mt-2 text-neutral-600">{message}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={busy}>
          {busy ? 'Deleting...' : confirmLabel}
        </Button>
      </div>
    </dialog>
  )
}
