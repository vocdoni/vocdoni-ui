import { useRef } from "react"

/** Provides a lock handler that is updated immediately and does not wait for a re-render cycle */
export const useLock = () => {
  const lockRef = useRef(false)

  const lock = () => {
    lockRef.current = true
  }
  const unlock = () => {
    lockRef.current = false
  }

  return {
    locked: () => lockRef.current,
    lock,
    unlock
  }
}
