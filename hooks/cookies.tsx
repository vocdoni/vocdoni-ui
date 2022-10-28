import React, {
  ReactNode,
  useEffect,
  createContext,
  useContext,
  useState,
} from 'react'
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
  hide: true,
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

interface IUseCookiesProvider {
  children: ReactNode
  hideInPaths?: RegExp[]
}

export const UseCookiesProvider: React.FC<IUseCookiesProvider> = ({
  hideInPaths,
  children,
}: IUseCookiesProvider) => {
  const [accepted, setAccepted] = useState<boolean>(false)
  const [hide, setHide] = useState<boolean>(true)

  const router = useRouter()
  const { trackLoad, trackReset, trackPage, setAccepted:setAcceptedRudder } = useRudderStack()
  const { show } = useHelpCenter()

  useEffect(() => {
    if (!router.pathname.includes(COOKIES_PATH)) setHide(false)

    const cookieAcceptance = localStorage.getItem(COOKIES_STORE_KEY)

    if (
      cookieAcceptance ||
      (hideInPaths && hideInPaths?.some((path) => router.pathname.match(path)))
    ) {
      setAccepted(cookieAcceptance === CookiesStatus.Accept)
      setAcceptedRudder(cookieAcceptance === CookiesStatus.Accept)
      setHide(true)
    } else {
      setHide(false)
    }
  }, [])

  useEffect(() => {
    if (
      !hide &&
      hideInPaths &&
      hideInPaths?.some((path) => router.pathname.match(path))
    ) {
      setHide(true)
    }
  }, [router.pathname])

  useEffect(() => {
    setAcceptedRudder(accepted)
  }, [accepted])

  const acceptCookies = () => {
    if (!router.pathname.includes(VOTING_PATH)) show()
    setAccepted(true)
    setAcceptedRudder(true)
    trackLoad()
    trackPage()
    setHide(true)
    localStorage.setItem(COOKIES_STORE_KEY, CookiesStatus.Accept)
  }

  const rejectCookies = () => {
    trackReset()
    setAccepted(false)
    setAcceptedRudder(false)
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
