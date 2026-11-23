// Shown when there is nothing to display yet.
// "children" lets the page add a button, e.g. "Create your first routine".
export default function EmptyState({ title, message, children }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border-[1.5px] border-dashed border-neutral-400 bg-white p-8">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-neutral-600">{message}</p>
      {children}
    </div>
  )
}
