import Button from './Button'

// Shows ONE drill. Data arrives through props and the card has no state of its own.
// "selected" and "onToggle" are optional: the button only appears if onToggle is given.
export default function DrillCard({ drill, selected = false, onToggle }) {
  return (
    <article
      className={`flex h-full flex-col gap-2 rounded-lg border-[1.5px] bg-white p-5 ${
        selected ? 'border-accent' : 'border-neutral-300'
      }`}
    >
      {/* Category badge uses the teal accent colour (complement of the red brand colour) */}
      <span className="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
        {drill.category}
      </span>
      <h2 className="text-xl font-bold">{drill.name}</h2>
      <p className="text-neutral-600">{drill.description}</p>
      {onToggle && (
        <Button
          variant={selected ? 'danger' : 'secondary'}
          className="mt-auto"
          onClick={() => onToggle(drill.id)}
        >
          {selected ? 'Remove from routine' : 'Add to routine'}
          {/* Hidden from the screen, but read aloud so each button has a unique name */}
          <span className="sr-only">: {drill.name}</span>
        </Button>
      )}
    </article>
  )
}
