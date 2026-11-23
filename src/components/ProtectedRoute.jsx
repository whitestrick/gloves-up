import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from './Loader'
import useAuth from '../hooks/useAuth'

// Wraps every page that needs a logged-in user.
// If the user is not logged in, they are sent to /login instead.
export default function ProtectedRoute() {
  const { user, loading } = useAuth() // from AuthContext
  const location = useLocation() // the page the user was trying to open

  // Firebase needs a moment to restore the session after a page refresh.
  // While it checks, we must NOT redirect, or a logged-in user would be
  // thrown to /login on every refresh.
  // The shared Loader replaces the plain text: same spinner and look as everywhere else.
  if (loading) {
    return <Loader label="Checking your login..." />
  }

  // Not logged in: go to /login and remember where they wanted to go.
  // "replace" stops the Back button from returning to the blocked page.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Logged in: Outlet renders the page inside this route (Routines, History, ...)
  return <Outlet />
}
