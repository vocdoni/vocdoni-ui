import { createContext, useContext, useState } from 'react'
import { useCookies } from '@hooks/cookies'

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
  trackEvent: (event: string, data?: object) => {},
  trackPage: () => {},
})

export function useRudderStack() {
  return useContext(UseRudderStackContext)
}

export function UseRudderStackProvider({ children }) {
  const { accepted } = useCookies()

  const trackEvent = (event: string, data?: object) => {
    console.log("trackEvent", accepted, event, data)
    if(typeof rudderanalytics !== 'undefined' && accepted) {
      rudderanalytics.track(event, data);
    }
  }

  const trackPage = () => {
    console.log("trackPage", accepted)
    if(typeof rudderanalytics !== 'undefined' && accepted) {
      rudderanalytics.page()
    }
  }

  return <UseRudderStackContext.Provider value={{ trackEvent, trackPage }}>
    {children}
  </UseRudderStackContext.Provider>
}
