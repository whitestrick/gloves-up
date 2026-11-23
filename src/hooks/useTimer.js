import { useEffect, useRef, useState } from 'react'
import { startingState, nextPhase, tick } from '../utils/timerLogic'

// Runs a boxing round timer: work, rest, work, rest... then finished.
// Usage: const timer = useTimer({ rounds: 3, roundSeconds: 180, restSeconds: 60 })
// It starts PAUSED. Call timer.resume() to begin.
//
// Note: the settings are read when the hook is first used, so mount it
// only AFTER the routine has loaded (the Workout page will do that).
export default function useTimer({ rounds, roundSeconds, restSeconds }) {
  // The timer state. The function form of useState runs only on the first render.
  const [state, setState] = useState(() => startingState({ roundSeconds }))
  // Is the clock ticking? Separate from "state" because pausing does not change the state.
  const [running, setRunning] = useState(false)

  // A ref remembers the interval id between renders WITHOUT causing a re-render.
  // (A normal variable would be lost on each render, and state would re-render for nothing.)
  const intervalRef = useRef(null)

  // The timer can only run if it has not finished. Worked out on every render, no extra state.
  const isRunning = running && state.phase !== 'finished'

  useEffect(() => {
    // Paused or finished: no interval needed
    if (!isRunning) return

    const config = { rounds, roundSeconds, restSeconds }

    // Every 1000 ms, ask the pure function for the next state.
    // (current) => ... always starts from the latest state, so nothing goes stale.
    intervalRef.current = setInterval(() => {
      setState((current) => tick(current, config))
    }, 1000)

    // Cleanup: React runs this when we pause, finish, change settings, or leave the page.
    // Without it, old intervals would keep running and the timer would speed up.
    return () => {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isRunning, rounds, roundSeconds, restSeconds])

  function pause() {
    setRunning(false)
  }

  function resume() {
    setRunning(true)
  }

  // Jump to the next phase right now (work -> rest, rest -> next round, last work -> finished)
  function skip() {
    setState((current) => nextPhase(current, { rounds, roundSeconds, restSeconds }))
  }

  // Back to the start, paused
  function reset() {
    setRunning(false)
    setState(startingState({ roundSeconds }))
  }

  return {
    phase: state.phase,
    round: state.round,
    secondsLeft: state.secondsLeft,
    elapsedSeconds: state.elapsedSeconds,
    isRunning,
    pause,
    resume,
    skip,
    reset,
  }
}
