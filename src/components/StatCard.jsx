// One big number with a label, e.g. "Sessions 3". Both arrive through props.
export default function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border-[1.5px] border-accent bg-white p-4">
      <p className="text-sm text-neutral-600">{label}</p>
      <p className="text-3xl font-extrabold text-accent">{value}</p>
    </div>
  )
}
