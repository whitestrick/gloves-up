import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Drills from './pages/Drills'
import Routines from './pages/Routines'
import RoutineForm from './pages/RoutineForm'
import Workout from './pages/Workout'
import History from './pages/History'

export default function App() {
  const { pathname } = useLocation()
  const showNavbar = pathname !== '/login' && !pathname.startsWith('/workout')

  return (
    <div className="min-h-dvh bg-cream text-ink">
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
