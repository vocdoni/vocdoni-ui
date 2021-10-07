import { DefaultTheme } from 'styled-components'

import { margins, screenMin, screenMax } from './sizes'
import { colors } from './colors'

export * from './global'

interface IOverrideTheme {
  accent1?: string
  accent1B?: string
  accent2?: string
  accent2B?: string
  textAccent1?: string
  textAccent1B?: string
  customLogo?: string
}

export const overrideTheme = (customTheme: IOverrideTheme): DefaultTheme => {
  const overriddenTheme = {}

  for (let propertyKey in customTheme) {
    const value = customTheme[propertyKey]
    if (value) {
      overriddenTheme[propertyKey] = value
    }
  }

  return {
    ...colors,
    ...overriddenTheme,
    screenMin,
    screenMax,
    margins,
  }
}
