import { Margins, Screens } from "./types"

export const sizes = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 440,
  tablet: 768,
  tabletL: 900,
  laptop: 1024,
  laptopL: 1440,
  desktop: 1920,
}

export const screenMin: Screens = {
  mobileS: `(min-width: ${sizes.mobileS}px)`,
  mobileM: `(min-width: ${sizes.mobileM}px)`,
  mobileL: `(min-width: ${sizes.mobileL}px)`,
  tablet: `(min-width: ${sizes.tablet}px)`,
  tabletL: `(min-width: ${sizes.tabletL}px)`,
  laptop: `(min-width: ${sizes.laptop}px)`,
  laptopL: `(min-width: ${sizes.laptopL}px)`,
  desktop: `(min-width: ${sizes.desktop}px)`,
}

export const screenMax: Screens = {
  mobileS: `(min-width: ${sizes.mobileS}px)`,
  mobileM: `(min-width: ${sizes.mobileM}px)`,
  mobileL: `(min-width: ${sizes.mobileL}px)`,
  tablet: `(min-width: ${sizes.tablet}px)`,
  tabletL: `(min-width: ${sizes.tabletL}px)`,
  laptop: `(min-width: ${sizes.laptop}px)`,
  laptopL: `(min-width: ${sizes.laptopL}px)`,
  desktop: `(min-width: ${sizes.desktop}px)`,
}

export const margins: Margins = {
  desktop: {
    horizontal: '40px',
    vertical: '',
  },
  mobile: {
    horizontal: '15px',
    vertical: '',
  },
}
