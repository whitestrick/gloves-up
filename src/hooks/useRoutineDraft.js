import { useContext } from 'react'
import { RoutineDraftContext } from '../context/routineDraftContext'

// Shortcut so components write useRoutineDraft() instead of useContext(...)
export default function useRoutineDraft() {
  return useContext(RoutineDraftContext)
}
