import { Margins, Screens } from "./types"

export const sizes = {
  mobileS: 320, // XS
  mobileM: 375,
  mobileL: 440, // SM
  tablet: 768,  // MD
  tabletL: 900,
  laptop: 1024, // LG
  laptopL: 1440, // XL
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
  mobileS: `(max-width: ${sizes.mobileS}px)`,
  mobileM: `(max-width: ${sizes.mobileM}px)`,
  mobileL: `(max-width: ${sizes.mobileL}px)`,
  tablet: `(max-width: ${sizes.tablet}px)`,
  tabletL: `(max-width: ${sizes.tabletL}px)`,
  laptop: `(max-width: ${sizes.laptop}px)`,
  laptopL: `(max-width: ${sizes.laptopL}px)`,
  desktop: `(max-width: ${sizes.desktop}px)`,
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
