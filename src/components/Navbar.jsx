import { NavLink } from 'react-router-dom'

const links = [
  { to: '/drills', label: 'Drills' },
  { to: '/routines', label: 'Routines' },
  { to: '/history', label: 'History' },
]

export default function Navbar() {
  return (
    <header className="border-b-2 border-neutral-300 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-6 px-6 py-3">
        <span className="text-xl font-extrabold tracking-wide text-brand">GLOVES UP</span>
        <nav aria-label="Main" className="flex flex-1 gap-6">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `border-b-4 py-1 ${isActive ? 'border-brand font-bold' : 'border-transparent'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
