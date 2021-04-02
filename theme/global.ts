import { createGlobalStyle, DefaultTheme } from 'styled-components'
import { colors } from './colors'
import { margins, screenMin, screenMax } from './sizes'

export const FixedGlobalStyle = createGlobalStyle`

body {
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-family: 'Roboto', Arial, Helvetica, sans-serif !important;
  background-color: ${({ theme }) => theme.background} !important;
  color: ${({ theme }) => theme.text};
}

h1, h2, h3, h4, h5, h6 {
  letter-spacing: 0.01em;
}

h1 {
  font-size: 35px;
  font-weight: 900;
  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 24px;
    font-weight: 800;
  }
}

h2 {
  font-size: 20px;
  font-weight: 900;
  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 20px;
    font-weight: 700;
  }
}

h3 {
  font-size: 18px;
  font-weight: 900;
  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 18px;
    font-weight: 700;
  }
}

h4 {
  font-size: 16px;
  font-weight: 500;
  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 15px;
  }
}

h5 {
  font-size: 14px;
  font-weight: 500;
}

h6 {
  font-size: 13px;
  font-weight: 500;
}

p {
  font-size: 14px;
  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 12px;
  }

}

a {
  color: ${props => props.theme.accent1};
  text-decoration: none;
  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 12px;
  }
}

input, textarea {
  outline-width: 0;
}

textarea {
  min-height: 72px;
}

@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Roboto'), local('Roboto-Regular'), url(/fonts/roboto-regular.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: local('Roboto Medium'), local('Roboto-Medium'), url(/fonts/roboto-medium.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: local('Roboto Black'), local('Roboto-Black'), url(/fonts/roboto-black.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Overpass';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/overpass/v5/qFdA35WCmI96Ajtm81kOcc7D4hoiiVI6DLE.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: 'Overpass';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/overpass/v5/qFdA35WCmI96Ajtm81kOcc7N4hoiiVI6.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

`

export const theme: DefaultTheme = {
  ...colors,
  screenMin,
  screenMax,
  margins: margins,
}
