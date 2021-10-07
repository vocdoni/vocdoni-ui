import { createContext, useState, useContext } from "react";
import { ThemeProvider, DefaultTheme } from 'styled-components'

import { overrideTheme, theme } from '../theme';

export type IVocdoniTheme = DefaultTheme & {
  customLogo?: string;
}

interface IThemeContext {
  theme: IVocdoniTheme,
  setAppTheme?: (theme: IVocdoniTheme) => void
  updateAppTheme?: (theme: any) => void
}

const ThemeContext = createContext<IThemeContext>({
  theme
})

export const ThemeContextProvider = ({ children }) => {
  const [appTheme, setAppTheme] = useState<IVocdoniTheme>(theme)

  const updateAppTheme = (theme: any) => {
    setAppTheme(overrideTheme(theme))
  }

  return (
    <ThemeContext.Provider value={{ theme: appTheme, setAppTheme, updateAppTheme }}>
      <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = (): IThemeContext => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}