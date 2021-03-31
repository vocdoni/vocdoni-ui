import styled from "styled-components"
import { useResponsive } from "../hooks/use-window-size"

export type ColumnProps = {
  /** Number of grid columns to use (1 to 12) */
  span?: number
  tabletSpan?: number
  mobileSpan?: number
  children: React.ReactNode
}

export const GRID_COLUMNS = 12
export const GRID_GUTTER = 20

export const Grid = styled.div`
  margin: 0 -${GRID_GUTTER / 2}px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`

export const Column = (props: ColumnProps) => {

  return <ColumnDiv {...props} />
}

export const ColumnDiv = styled.div<ColumnProps>`
  margin: ${GRID_GUTTER / 2}px;
  box-sizing: border-box;
  width: calc(${props => resolveResponsiveSpan(props).mobile * 100 / GRID_COLUMNS}% - ${GRID_GUTTER}px);

  @media ${({ theme }) => theme.screenMin.tablet} {
    width: calc(${props => resolveResponsiveSpan(props).tablet * 100 / GRID_COLUMNS}% - ${GRID_GUTTER}px);
  }
  @media ${({ theme }) => theme.screenMin.laptop} {
    width: calc(${props => resolveResponsiveSpan(props).span * 100 / GRID_COLUMNS}% - ${GRID_GUTTER}px);
  }
`

// HELPERS

function resolveResponsiveSpan(props: ColumnProps) {
  return {
    mobile: props.mobileSpan || GRID_COLUMNS,
    tablet: props.tabletSpan || props.mobileSpan || GRID_COLUMNS,
    span: props.span || props.tabletSpan || props.mobileSpan || GRID_COLUMNS,
  }
}

function resolveSpan(value: number) {
  if (value < 1) return 1
  else if (value > GRID_COLUMNS) return GRID_COLUMNS

  return Math.round(value)
}
