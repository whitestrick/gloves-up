export default function FormInput({ id, label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-neutral-600">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-11 rounded-lg border-[1.5px] bg-white px-3 text-base ${error ? 'border-brand' : 'border-neutral-500'}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-brand">
          {error}
        </p>
      )}
    </div>
  )
}
