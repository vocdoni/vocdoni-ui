import styled from 'styled-components'
import { sizes } from '../../theme/sizes'

export type ColumnProps = {
  /** [XL] Number of grid columns to use (1 to 12) */
  xl?: number
  /** [LG] Number of grid columns to use (1 to 12) */
  lg?: number
  /** [MD] Number of grid columns to use (1 to 12) */
  md?: number
  /** [SM] Number of grid columns to use (1 to 12) */
  sm?: number
  /** [XS] Number of grid columns to use (1 to 12) */
  span?: number
  /**  Remove the gutters from the columns */
  noGutter?: boolean
  hiddenXl?: boolean
  hiddenLg?: boolean
  hiddenMd?: boolean
  hiddenSm?: boolean
  children?: React.ReactNode
}

export const GRID_COLUMNS = 12
export const GRID_GUTTER = 20

const breakpoints = {
  xs: sizes.mobileS, // XS
  // --: 375,
  sm: sizes.mobileL, // SM
  md: sizes.tablet, // MD
  // --: 900,
  lg: sizes.laptop, // LG
  xl: sizes.laptopL, // XL
  // --: 1920,
}

// GRID
export type GridProps = {
  /**  Remove the gutters from the grid */
  noGutter?: boolean
  center?: boolean
}
export const Grid = styled.div<GridProps>`
  margin: 0 -${({ noGutter }) => (noGutter ? 0 : GRID_GUTTER / 2)}px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

// COLUMN

export const Column = (props: ColumnProps) => {
  return <ColumnDiv {...props} />
}

export const ColumnDiv = styled.div<ColumnProps>`
  margin: ${({ noGutter }) => (noGutter ? 0 : GRID_GUTTER / 2)}px;
  box-sizing: border-box;
  display: flex; /** Added to allow same height columns */
  flex-direction: column;
  width: calc(
    ${(props) => (resolveResponsiveSpan(props).xs * 100) / GRID_COLUMNS}% -
      ${({ noGutter }) => (noGutter ? 0 : GRID_GUTTER)}px
  );

  @media ${({ theme }) => theme.screenMax.laptop} {
    display: ${({ hiddenLg }) => (hiddenLg ? 'none' : 'block')};
  }

  @media ${({ theme }) => theme.screenMax.tablet} {
    display: ${({ hiddenMd }) => (hiddenMd ? 'none' : 'block')};
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    display: ${({ hiddenSm }) => (hiddenSm ? 'none' : 'block')};
  }

  @media ${({ theme }) => theme.screenMin.mobileL} {
    width: calc(
      ${(props) => (resolveResponsiveSpan(props).sm * 100) / GRID_COLUMNS}% -
        ${({ noGutter }) => (noGutter ? 0 : GRID_GUTTER)}px
    );
  }
  @media ${({ theme }) => theme.screenMin.tablet} {
    width: calc(
      ${(props) => (resolveResponsiveSpan(props).md * 100) / GRID_COLUMNS}% -
        ${({ noGutter }) => (noGutter ? 0 : GRID_GUTTER)}px
    );
  }
  @media ${({ theme }) => theme.screenMin.laptop} {
    width: calc(
      ${(props) => (resolveResponsiveSpan(props).lg * 100) / GRID_COLUMNS}% -
        ${({ noGutter }) => (noGutter ? 0 : GRID_GUTTER)}px
    );
  }
  @media ${({ theme }) => theme.screenMin.laptopL} {
    width: calc(
      ${(props) => (resolveResponsiveSpan(props).xl * 100) / GRID_COLUMNS}% -
        ${({ noGutter }) => (noGutter ? 0 : GRID_GUTTER)}px
    );
  }
`

// HELPERS

function resolveResponsiveSpan(props: ColumnProps) {
  return {
    xs: handleSpan(props.span || GRID_COLUMNS),
    sm: handleSpan(props.sm || props.span || GRID_COLUMNS),
    md: handleSpan(props.md || props.sm || props.span || GRID_COLUMNS),
    lg: handleSpan(
      props.lg || props.md || props.sm || props.span || GRID_COLUMNS
    ),
    xl: handleSpan(
      props.xl || props.lg || props.md || props.sm || props.span || GRID_COLUMNS
    ),
  }
}

function handleSpan(value: number) {
  if (value < 1) return 1
  else if (value > GRID_COLUMNS) return GRID_COLUMNS

  return Math.round(value)
}
