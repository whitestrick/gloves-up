// A spinning circle shown while data loads.
// role="status" and the text let screen readers know something is loading.
export default function Loader({ label = 'Loading...' }) {
  return (
    <div role="status" className="flex items-center gap-3 p-6 text-neutral-600">
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-4 border-neutral-300 border-t-brand"
      />
      <span>{label}</span>
    </div>
  )
}
