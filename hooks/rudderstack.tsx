import { createContext, useContext, useEffect, useState } from 'react'
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
  setAccepted: (accepted:boolean) => {},
})

export function useRudderStack() {
  return useContext(UseRudderStackContext)
}

export function UseRudderStackProvider({ children }) {
  const router = useRouter()
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (accepted) {
      trackLoad()
      router.events.on('routeChangeStart', trackPage)
    }
    else {
      trackReset()
      router.events.off('routeChangeStart', trackPage)
    }
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

  return <UseRudderStackContext.Provider value={{ trackLoad, trackReset, trackEvent, trackPage, setAccepted }}>
    {children}
  </UseRudderStackContext.Provider>
}
