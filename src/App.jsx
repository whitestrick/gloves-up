import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Drills from './pages/Drills'
import Routines from './pages/Routines'
import RoutineForm from './pages/RoutineForm'
import Workout from './pages/Workout'
import History from './pages/History'

// The page name for each address. Screen readers read the page title when a page opens,
// so without this every page would be announced as just "Gloves Up".
function titleForPath(pathname) {
  if (pathname === '/login') return 'Log in'
  if (pathname === '/drills') return 'Drill library'
  if (pathname === '/routines') return 'My routines'
  if (pathname === '/routines/new') return 'New routine'
  if (pathname.endsWith('/edit')) return 'Edit routine'
  if (pathname.startsWith('/workout')) return 'Workout'
  if (pathname === '/history') return 'Training history'
  return ''
}

export default function App() {
  const { pathname } = useLocation()
  const showNavbar = pathname !== '/login' && !pathname.startsWith('/workout')

  // Update the browser tab title every time the address changes
  useEffect(() => {
    const title = titleForPath(pathname)
    document.title = title ? `${title} | Gloves Up` : 'Gloves Up'
  }, [pathname])

  return (
    <div className="min-h-dvh bg-cream text-ink">
      {/* Skip link: invisible until a keyboard user presses Tab, then it jumps past the navbar */}
      {showNavbar && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-brand"
        >
          Skip to main content
        </a>
      )}
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public page: anyone can open it */}
        <Route path="/login" element={<Login />} />

        {/* Protected pages: ProtectedRoute checks the login first.
            It has no path, so it only acts as a guard around the routes inside it. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/drills" element={<Drills />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/routines/new" element={<RoutineForm />} />
          <Route path="/routines/:id/edit" element={<RoutineForm />} />
          <Route path="/workout/:id" element={<Workout />} />
          <Route path="/history" element={<History />} />
        </Route>

        {/* Anything else goes to /login (a logged-in user is then sent on to /routines) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}
