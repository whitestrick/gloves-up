import { NavLink, Link, useNavigate } from 'react-router-dom'
import Button from './Button'
import useAuth from '../hooks/useAuth'
import useToast from '../hooks/useToast'
import { logoutUser } from '../services/authService'

const links = [
  { to: '/drills', label: 'Drills' },
  { to: '/routines', label: 'Routines' },
  { to: '/history', label: 'History' },
]

export default function Navbar() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logoutUser()
      showToast('You have been logged out')
      navigate('/login')
    } catch {
      showToast('Could not log out. Try again.')
    }
  }

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
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-neutral-600 sm:inline">{user.email}</span>
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        ) : (
          <Link to="/login" className="font-semibold text-brand">
            Log in
          </Link>
        )}
      </div>
    </header>
  )
}
