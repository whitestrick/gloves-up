import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

// Wraps every page that needs a logged-in user.
// If the user is not logged in, they are sent to /login instead.
export default function ProtectedRoute() {
  const { user, loading } = useAuth() // from AuthContext
  const location = useLocation() // the page the user was trying to open

  // Firebase needs a moment to restore the session after a page refresh.
  // While it checks, we must NOT redirect, or a logged-in user would be
  // thrown to /login on every refresh.
  if (loading) {
    return (
      <p role="status" className="p-6 text-neutral-600">
        Checking your login...
      </p>
    )
  }

  // Not logged in: go to /login and remember where they wanted to go.
  // "replace" stops the Back button from returning to the blocked page.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Logged in: Outlet renders the page inside this route (Routines, History, ...)
  return <Outlet />
}
