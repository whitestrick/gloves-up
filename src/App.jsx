import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
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
    <div className="min-h-screen bg-cream text-ink">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/drills" element={<Drills />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/routines/new" element={<RoutineForm />} />
        <Route path="/routines/:id/edit" element={<RoutineForm />} />
        <Route path="/workout/:id" element={<Workout />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}
