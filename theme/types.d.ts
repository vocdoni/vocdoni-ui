export type Color = string;

export interface Colors {
  text1: Color;
  text2: Color;
  text3: Color;
  accent1: Color;
  accent2: Color;
  accent2Disabled: Color;
  negative1: Color;
  negative2: Color;
  white: Color;
  darkFg: Color;
  darkMidFg: Color;
  darkLightFg: Color;
  lightBg: Color;
  lightBg2: Color;
  lightBorder: Color;

  lightText: Color;
  mainText: Color;
  lighterText: Color;
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
