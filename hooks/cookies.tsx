import React, { useEffect, createContext, useContext, useState } from 'react'
import { COOKIES_PATH, VOTING_PATH } from '@const/routes'
import { useRouter } from 'next/router'

import { useHelpCenter } from './help-center'
import { useRudderStack } from '@hooks/rudderstack'

const COOKIES_STORE_KEY = 'cookies-acceptance'

interface ICookiesContext {
  accepted: boolean
  hide: boolean
  acceptCookies: () => void
  rejectCookies: () => void
}

const CookiesContext = createContext<ICookiesContext>({
  accepted: false,
  hide: false,
  acceptCookies: () => {},
  rejectCookies: () => {},
})

enum CookiesStatus {
  Accept = 'accept',
  Reject = 'reject',
}

export function useCookies() {
  const { accepted, hide, acceptCookies, rejectCookies } = useContext(
    CookiesContext
  )

  return { acceptCookies, rejectCookies, accepted, hide }
}

export const UseCookiesProvider: React.FC = ({ children }) => {
  const [accepted, setAccepted] = useState<boolean>(false)
  const [hide, setHide] = useState<boolean>(false)

  const router = useRouter()
  const { trackLoad, trackReset, trackPage } = useRudderStack()
  const { show } = useHelpCenter()

  useEffect(() => {
    if (router.pathname.includes(COOKIES_PATH)) setHide(true)

    const cookieAcceptance = localStorage.getItem(COOKIES_STORE_KEY)

    if (cookieAcceptance) {
      setAccepted(cookieAcceptance === CookiesStatus.Accept)
      setHide(true)
      trackLoad()
    }
  }, [])

  const acceptCookies = () => {
    if (!router.pathname.includes(VOTING_PATH)) show()
    setAccepted(true)
    trackLoad()
    trackPage()
    setHide(true)
    localStorage.setItem(COOKIES_STORE_KEY, CookiesStatus.Accept)
  }

  const rejectCookies = () => {
    trackReset()
    setAccepted(false)
    setHide(true)
    localStorage.setItem(COOKIES_STORE_KEY, CookiesStatus.Reject)
  }

  return (
    <CookiesContext.Provider
      value={{ accepted, hide, acceptCookies, rejectCookies }}
    >
      {children}
    </CookiesContext.Provider>
  )
}
