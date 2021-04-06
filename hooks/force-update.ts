import { useState, useCallback } from "react"

export const forceUpdate = () => {
  const [, updateState] = useState<any>({})
  return useCallback(() => updateState({}), [])
}
