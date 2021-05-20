const show = () => {
  window.Beacon('init', process.env.HELPSCOUT_PROJECT_ID)
}

const hide = () => {
  window.Beacon('destroy')
}

const open = () => {
  window.Beacon('open')
<<<<<<< HEAD
}

export function useHelpCenter() {
  return { show, hide, open}
=======
}

export function useHelpCenter() {
  return useContext(HelpCenterTextContext)
}

export const HelpCenterTextContext = createContext({
  show: () => {},
  hide: () => {},
  open: () => {},
})

export function UseHelpCenterProvider({ children }) {
  return (
    <HelpCenterTextContext.Provider value={{ show, hide, open }}>
      {children}
    </HelpCenterTextContext.Provider>
  )
>>>>>>> Open helpscout when error appearts twice
}
