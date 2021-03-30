import styled from "styled-components"

export type ColumnProps = {
  /** Span (1 to 12) */
  span?: number
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

export const Column = styled.div<ColumnProps>`
  margin: ${GRID_GUTTER / 2}px;
  box-sizing: border-box;
  ${props => props.span ? `width: calc(${props.span * 100 / GRID_COLUMNS}% - ${GRID_GUTTER}px);` : "width: 100%;"}
`
