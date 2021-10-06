import { VOTING_PATH } from '@const/routes'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { useHelpCenter } from './help-center'

const COOKIES_STORE_KEY = 'cookies-acceptance'

enum CookiesStatus {
  Accept = 'accept',
  Reject = 'reject',
}
export function useCookies() {
  const [accepted, setAccepted] = useState<boolean>(false)
  const [hide, setHide] = useState<boolean>(false)

  const { show } = useHelpCenter()
  const router = useRouter()

  useEffect(() => {
    const cookieAcceptance = localStorage.getItem(COOKIES_STORE_KEY)

    if (cookieAcceptance) {
      setAccepted(cookieAcceptance === CookiesStatus.Accept)
    }
  }, [])

  const acceptCookies = () => {
    if (!router.pathname.includes(VOTING_PATH)) show()

    rudderanalytics.isTrackable = true
    rudderanalytics.page()

    setAccepted(true)
    setHide(true)
    localStorage.setItem(COOKIES_STORE_KEY, CookiesStatus.Accept)
  }

  const rejectCookies = () => {
    setAccepted(false)
    setHide(true)
    localStorage.setItem(COOKIES_STORE_KEY, CookiesStatus.Reject)
  }

  return { acceptCookies, rejectCookies, accepted, hide }
}
