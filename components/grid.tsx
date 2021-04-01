import styled from "styled-components"
import { sizes } from "../theme/sizes"

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
  children?: React.ReactNode
}

export const GRID_COLUMNS = 12
export const GRID_GUTTER = 20

const breakpoints = {
  xs: sizes.mobileS, // XS
  // --: 375,
  sm: sizes.mobileL, // SM
  md: sizes.tablet,  // MD
  // --: 900,
  lg: sizes.laptop, // LG
  xl: sizes.laptopL, // XL
  // --: 1920,
}

// GRID

export const Grid = styled.div`
  margin: 0 -${GRID_GUTTER / 2}px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`

// COLUMN

export const Column = (props: ColumnProps) => {
  return <ColumnDiv {...props} />
}

export const ColumnDiv = styled.div<ColumnProps>`
  margin: ${GRID_GUTTER / 2}px;
  box-sizing: border-box;
  width: calc(${props => resolveResponsiveSpan(props).xs * 100 / GRID_COLUMNS}% - ${GRID_GUTTER}px);

  @media ${({ theme }) => theme.screenMin.mobileL} {
    width: calc(${props => resolveResponsiveSpan(props).sm * 100 / GRID_COLUMNS}% - ${GRID_GUTTER}px);
  }
  @media ${({ theme }) => theme.screenMin.tablet} {
    width: calc(${props => resolveResponsiveSpan(props).md * 100 / GRID_COLUMNS}% - ${GRID_GUTTER}px);
  }
  @media ${({ theme }) => theme.screenMin.laptop} {
    width: calc(${props => resolveResponsiveSpan(props).lg * 100 / GRID_COLUMNS}% - ${GRID_GUTTER}px);
  }
  @media ${({ theme }) => theme.screenMin.laptopL} {
    width: calc(${props => resolveResponsiveSpan(props).xl * 100 / GRID_COLUMNS}% - ${GRID_GUTTER}px);
  }
`

// HELPERS

function resolveResponsiveSpan(props: ColumnProps) {
  return {
    xs: handleSpan(props.span || GRID_COLUMNS),
    sm: handleSpan(props.sm || props.span || GRID_COLUMNS),
    md: handleSpan(props.md || props.sm || props.span || GRID_COLUMNS),
    lg: handleSpan(props.lg || props.md || props.sm || props.span || GRID_COLUMNS),
    xl: handleSpan(props.xl || props.lg || props.md || props.sm || props.span || GRID_COLUMNS),
  }
}

function handleSpan(value: number) {
  if (value < 1) return 1
  else if (value > GRID_COLUMNS) return GRID_COLUMNS

  return Math.round(value)
}
