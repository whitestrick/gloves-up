// Shows ONE drill. It gets its data through props and has no state of its own,
// which makes it easy to reuse (the routine builder can use it too).
export default function DrillCard({ drill }) {
  return (
    <article className="flex h-full flex-col gap-2 rounded-lg border-[1.5px] border-neutral-300 bg-white p-5">
      {/* Category badge uses the teal accent colour (complement of the red brand colour) */}
      <span className="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
        {drill.category}
      </span>
      <h2 className="text-xl font-bold">{drill.name}</h2>
      <p className="text-neutral-600">{drill.description}</p>
    </article>
  )
}
