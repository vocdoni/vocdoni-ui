import { createContext, useState } from "react";
import { ThemeProvider, DefaultTheme } from 'styled-components'

import { theme } from '../theme';

export type IVocdoniTheme = DefaultTheme & {
  customLogo?: string;
}

interface IThemeContext {
  theme: IVocdoniTheme,
  setAppTheme?: (theme: IVocdoniTheme) => void
}

export const UseThemeContext = createContext<IThemeContext>({
  theme
})

export const UseThemeContextProvider = ({ children }) => {
  const [appTheme, setAppTheme] = useState<IVocdoniTheme>(theme)

  return (
    <UseThemeContext.Provider value={{ theme: appTheme, setAppTheme }}>
      <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
    </UseThemeContext.Provider>
  )
}