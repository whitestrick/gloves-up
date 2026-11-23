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
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 sm:px-6">
        <span className="text-xl font-extrabold tracking-wide text-brand">GLOVES UP</span>

        {/* PHONE: "order-last w-full" pushes the links onto their own full-width row under the logo.
            "sm:" (640px and up): back to normal order, sitting between the logo and the user. */}
        <nav
          aria-label="Main"
          className="order-last flex w-full justify-around sm:order-none sm:w-auto sm:flex-1 sm:justify-start sm:gap-6"
        >
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              // min-h-11 = 44px: a comfortable height for a finger
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center border-b-4 px-2 ${
                  isActive ? 'border-brand font-bold' : 'border-transparent'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            {/* The email is hidden on phones to save space */}
            <span className="hidden text-sm text-neutral-600 sm:inline">{user.email}</span>
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        ) : (
          <Link to="/login" className="inline-flex min-h-11 items-center font-semibold text-brand">
            Log in
          </Link>
        )}
      </div>
    </header>
  )
}
