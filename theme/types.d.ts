export type Color = string;

export interface ColorsV2 {
  support: SupportColors
  neutral: ColorV2
}

export interface ColorV2 {
  0?: string
  100: string
  50?: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export interface SupportColors {
  info: ColorV2
  success: ColorV2
  warning: ColorV2
  critical: ColorV2
}

export interface NeutralColors {
  neutral: ColorV2
}


export interface Colors {
  text: Color;
  lightText: Color;
  lighterText: Color;
  blueText: Color;
  warningText: Color;

  /** Background color of the body */
  background: Color;

  /** Main positive text color */
  textAccent1: Color;
  /** Lighter positive text color */
  textAccent1B: Color;
  /** Another positive text color variant */
  textAccent1C: Color;
  /** Disabled positive text color */
  textAccent1Grayed: Color;

  /** Main negative text color */
  textAccent2: Color;
  /** Lighter negative text color */
  textAccent2B: Color;

  /** Main positive background color (solid) */
  accent1: Color;
  /** Lighter positive background color (solid) */
  accent1B: Color;
  /** Another positive variant color (solid) */
  accent1C: Color;
  /** Disabled positive background color (solid) */
  accent1Grayed: Color;

  /** Main negative background color (solid) */
  accent2: Color;
  /** Main negative background color (solid) */
  accent2B: Color;

  /** Light accent background color (light) */
  accentLight1: Color;
  /** Lighter accent background color (light) */
  accentLight1B: Color;

  /** Main negative background color (light) */
  accentLight2: Color;
  /** Main negative background color (light) */
  accentLight2B: Color;

  /** Error color */
  danger: Color;
  /** Success color */
  success: Color;

  error: Color;
  /* Error color updated */
  errorV2: Color;


  white: Color;
  darkFg: Color;
  darkMidFg: Color;
  darkLightFg: Color;
  lightBg: Color;
  lightBg2: Color;
  lightBorder: Color;

  FCBBlue: Color;
}

export interface Screens {
  mobileS: string;
  mobileM: string;
  mobileL: string;
  tablet: string;
  tabletL: string;
  laptop: string;
  laptopL: string;
  desktop: string;
}

export interface Margins {
  mobile: {
    horizontal: string;
    vertical: string;
  };
  desktop: {
    horizontal: string;
    vertical: string;
  };
}

declare module "styled-components" {
  export interface DefaultTheme extends Colors {
    // Screens for media queries
    screenMin: Screens;
    screenMax: Screens;
    margins: Margins;
  }
}
