import { createContext, useContext, useState } from 'react'

const show = () => {
  window.Beacon('init', '5f78b511-0d81-4f7d-b452-40f020f4445e')
}

const hide = () => {
  window.Beacon('destroy')
}

export function useHelpCenter() {
  return useContext(HelpCenterTextContext)
}

export const HelpCenterTextContext = createContext({show: () => {}, hide: () => {}})

export function UseHelpCenterProvider({ children }) {
  return <HelpCenterTextContext.Provider value={{ show, hide }}>
    {children}
  </HelpCenterTextContext.Provider>
}
