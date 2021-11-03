import { createContext, useContext, useEffect } from 'react'
import { useCookies } from '@hooks/cookies'
import { useRouter } from 'next/router'
import { ANALYTICS_KEY, ANALYTICS_URL } from '@const/env'

export enum TrackEvents {
  LOGIN_BUTTON_CLICKED = 'login_button_clicked',
  ENTITY_CREATION_BUTTON_CLICKED = 'entityCreation_button_clicked',
  ENTITY_CREATION_WIZARD_BUTTON_CLICKED = 'entityCreationWizard_button_clicked',
  ENTITY_CREATED = 'entity_created',
  PROCESS_CREATION_BUTTON_CLICKED = 'processCreation_button_clicked',
  PROCESS_CREATION_WIZARD_BUTTON_CLICKED = 'processCreationWizard_button_clicked',
  PROCESS_CREATED = 'process_created',
}

const UseRudderStackContext = createContext({
  trackLoad: () => {},
  trackReset: () => {},
  trackEvent: (event: string, data?: object) => {},
  trackPage: () => {},
})

export function useRudderStack() {
  return useContext(UseRudderStackContext)
}

export function UseRudderStackProvider({ children }) {
  const { accepted } = useCookies()
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', trackPage)

    return () => router.events.off('routeChangeStart', trackPage)
  }, [accepted])

  const trackLoad = () => {
    if(typeof rudderanalytics !== 'undefined') {
      rudderanalytics.load(ANALYTICS_KEY, ANALYTICS_URL)
    }
  }

  const trackReset = () => {
    if(typeof rudderanalytics !== 'undefined') {
      rudderanalytics.reset()
    }
  }

  const trackEvent = (event: string, data?: object) => {
    if(typeof rudderanalytics !== 'undefined' && accepted) {
      rudderanalytics.track(event, data)
    }
  }

  const trackPage = () => {
    if(typeof rudderanalytics !== 'undefined' && accepted) {
      rudderanalytics.page()
    }
  }

  return <UseRudderStackContext.Provider value={{ trackLoad, trackReset, trackEvent, trackPage }}>
    {children}
  </UseRudderStackContext.Provider>
}
