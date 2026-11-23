// Shown when loading data fails. role="alert" makes screen readers announce it.
export default function ErrorMessage({ message }) {
  return (
    <p role="alert" className="rounded-lg border-[1.5px] border-brand bg-white p-4 text-brand">
      {message}
    </p>
  )
}
