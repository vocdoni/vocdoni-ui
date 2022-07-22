import { createGlobalStyle, DefaultTheme } from 'styled-components'
import { colors } from './colors'
import { margins, screenMin, screenMax } from './sizes'

export const FixedGlobalStyle = createGlobalStyle`
/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

body {
  margin: 0;
}

main {
  display: block;
}

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

a {
  background-color: transparent;
}

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

b,
strong {
  font-weight: bolder;
}

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

img {
  border-style: none;
}

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

button,
input { /* 1 */
  overflow: visible;
}

button,
select { /* 1 */
  text-transform: none;
}

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

progress {
  vertical-align: baseline;
}

textarea {
  overflow: auto;
}

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}


::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

details {
  display: block;
}

summary {
  display: list-item;
}


template {
  display: none;
}

[hidden] {
  display: none;
}

html,
body {
  height: 100%;
}

#__next {
  min-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

body {
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-family: 'Manrope', 'Roboto', Arial, Helvetica, sans-serif !important;
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
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Manrope'), local('Manrope-Regular'), url(/fonts/manrope-regular.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: local('Manrope Medium'), local('Manrope-Medium'), url(/fonts/manrope-medium.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: local('Manrope Semi Bold'), local('Manrope-Semi-Bold'), url(/fonts/manrope-semi-bold.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local('Manrope Bold'), local('Manrope-Bold'), url(/fonts/manrope-bold.woff2) format('woff2');
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
