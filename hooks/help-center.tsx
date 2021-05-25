import { useState } from 'react'

export function useHelpCenter() {
  const [initialized, setInitialized] = useState<boolean>(false)

  const show = () => {
    if (!initialized) {
      window.Beacon('init', process.env.HELPSCOUT_PROJECT_ID)
      setInitialized(true)
    }
  }

  const hide = () => {
    if (initialized) {
      window.Beacon('destroy')
      setInitialized(false)
    }
  }

  const open = () => {
    window.Beacon('open')
  }

  return { show, hide, open }
}
