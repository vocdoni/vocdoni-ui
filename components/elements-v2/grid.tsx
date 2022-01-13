import { CalendarCard } from "@components/blocks/calendar-card"
import { theme } from "@theme/global"
import { ReactNode } from "react"
import styled from "styled-components"

type justifyOptions = 'start' | 'end' | 'center' | 'space-between' | 'space-around'
type alignOptions = 'start' | 'end' | 'center'
type textAlignOptions = 'start' | 'end' | 'center' | 'justify'
export type IRowProps = {
  children?: ReactNode
  /**
   * none > 0px
   *
   * xxs > 2px, total 4px
   *
   * xs > 4px, total 8px
   *
   * sm > 6px, total 12pxx
   *
   * md > 8px, total 16px
   *
   * lg > 12px, total 24px
   *
   * xl > 16px, total 32px
   *
   * xxl > 20px, total 40px
   *
   * xxxl > 24px, total 48px
   */
  gutter?: 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
  wrap?: boolean
  justify?: justifyOptions
  align?: alignOptions
}

export type IColProps = {
  xs?: number | string
  sm?: number | string
  md?: number | string
  lg?: number | string
  xl?: number | string
  auto?: boolean
  hidden?: boolean
  hiddenXs?: boolean
  hiddenSm?: boolean
  hiddenMd?: boolean
  hiddenLg?: boolean
  hiddenXl?: boolean
  hiddenXsAndUp?: boolean
  hiddenSmAndUp?: boolean
  hiddenMdAndUp?: boolean
  hiddenLgAndUp?: boolean
  hiddenXlAndUp?: boolean
  hiddenXsAndDown?: boolean
  hiddenSmAndDown?: boolean
  hiddenMdAndDown?: boolean
  hiddenLgAndDown?: boolean
  hiddenXlAndDown?: boolean
  disableFlex?: boolean
  justify?: justifyOptions
  align?: alignOptions
}

const getRowMargin = (props: IRowProps) => {
  switch (props.gutter) {
    case 'none':
      return 0
    case 'xxs':
      return 2
    case 'xs':
      return 4
    case 'sm':
      return 6
    case 'md':
      return 8
    case 'lg':
      return 12
    case 'xl':
      return 16
    case 'xxl':
      return 20
    case 'xxxl':
      return 24
    default:
      return 4
  }
}
const getRowJustify = (props: IRowProps) => {
  switch (props.justify) {
    case 'center':
      return 'center'
    case 'start':
      return 'flex-start'
    case 'end':
      return 'flex-end'
    case 'space-around':
      return 'space-around'
    case 'space-between':
      return 'space-between'
    default:
      return 'flex-start'
  }
}
const getRowAlign = (props: IRowProps) => {
  switch (props.align) {
    case 'center':
      return 'center'
    case 'start':
      return 'flex-start'
    case 'end':
      return 'flex-end'
    default:
      return 'flex-start'
  }
}
const getRowWrap = (props: IRowProps) => {
  if (props.wrap === false) {
    return 'nowrap'
  }
  return 'wrap'
}
const getColJustify = (props: IColProps) => {
  switch (props.justify) {
    case 'center':
      return 'center'
    case 'start':
      return 'flex-start'
    case 'end':
      return 'flex-end'
    case 'space-around':
      return 'space-around'
    case 'space-between':
      return 'space-between'
    default:
      return ''
  }
}
const getColAlign = (props: IColProps) => {
  switch (props.align) {
    case 'center':
      return 'center'
    case 'start':
      return 'flex-start'
    case 'end':
      return 'flex-end'
    default:
      return ''
  }
}
const getColDisplayXL = (props: IColProps) => {
  if (
    props.hidden ||
    props.hiddenXl ||
    props.hiddenXlAndUp ||
    props.hiddenXlAndDown ||
    props.hiddenLgAndUp ||
    props.hiddenMdAndUp ||
    props.hiddenSmAndUp ||
    props.hiddenXsAndUp
  ) {
    return 'none'
  }
  return 'block'
}
const getColDisplayLg = (props: IColProps) => {
  if (
    props.hidden ||
    props.hiddenLg ||
    props.hiddenLgAndUp ||
    props.hiddenLgAndDown ||
    props.hiddenXlAndDown ||
    props.hiddenMdAndUp ||
    props.hiddenSmAndUp ||
    props.hiddenXsAndUp
  ) {
    return 'none'
  }
  return 'block'
}
const getColDisplayMd = (props: IColProps) => {
  if (
    props.hidden ||
    props.hiddenMd ||
    props.hiddenMdAndUp ||
    props.hiddenMdAndDown ||
    props.hiddenXlAndDown ||
    props.hiddenLgAndDown ||
    props.hiddenSmAndUp ||
    props.hiddenXsAndUp
  ) {
    return 'none'
  }
  return 'block'
}
const getColDisplaySm = (props: IColProps) => {
  if (
    props.hidden ||
    props.hiddenSm ||
    props.hiddenSmAndUp ||
    props.hiddenSmAndDown ||
    props.hiddenXlAndDown ||
    props.hiddenLgAndDown ||
    props.hiddenMdAndDown ||
    props.hiddenXsAndUp
  ) {
    return 'none'
  }
  return 'block'
}
const getColDisplayXs = (props: IColProps) => {
  if (
    props.hidden ||
    props.hiddenXs ||
    props.hiddenXsAndUp ||
    props.hiddenXsAndDown ||
    props.hiddenXlAndDown ||
    props.hiddenLgAndDown ||
    props.hiddenMdAndDown ||
    props.hiddenSmAndDown
  ) {
    return 'none'
  }
  return 'block'
}
const getColChildFlex = (props: IColProps) => {
  if (props.disableFlex) {
    return ''
  }
  return 'flex'
}
const COLUMNS = 12
const validateColWidth = (value: number | string) => {
  if (typeof value === 'string') {
    return 'auto'
  }
  if (value < 1) return 1
  else if (value > COLUMNS) return COLUMNS
  return Math.round(value)
}

const getColsWidth = (props: IColProps) => {
  const widthXs = validateColWidth(props.xs)
  const widthSm = validateColWidth(props.sm || props.xs)
  const widthMd = validateColWidth(props.md || props.sm || props.xs)
  const widthLg = validateColWidth(props.lg || props.md || props.sm || props.xs)
  const widthXl = validateColWidth(props.xl || props.lg || props.md || props.sm || props.xs)
  return {
    xs: typeof widthXs === 'string' ? 'auto' : `calc(${widthXs * 100 / COLUMNS}% - var(--row-margin))`,
    sm: typeof widthSm === 'string' ? 'auto' : `calc(${widthSm * 100 / COLUMNS}% - var(--row-margin))`,
    md: typeof widthMd === 'string' ? 'auto' : `calc(${widthMd * 100 / COLUMNS}% - var(--row-margin))`,
    lg: typeof widthLg === 'string' ? 'auto' : `calc(${widthLg * 100 / COLUMNS}% - var(--row-margin))`,
    xl: typeof widthXl === 'string' ? 'auto' : `calc(${widthXl * 100 / COLUMNS}% - var(--row-margin))`,
  }
}

export const Row = styled.div<IRowProps>`
  margin: -${getRowMargin}px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: ${getRowJustify};
  align-items: ${getRowAlign};
  flex-wrap: ${getRowWrap};
  box-sizing: border-box;
  --row-margin: ${(props) => getRowMargin(props) * 2}px;
  &>div {
    margin: ${getRowMargin}px;
  }
`

export const Col = styled.div<IColProps>`
  box-sizing: border-box;
  @media ${theme.screenMin.desktop} {
    display: ${getColDisplayXL};
    width: ${(props)=>getColsWidth(props).xl}
  }
  @media ${theme.screenMin.laptopL} and ${theme.screenMax.desktop} {
    display: ${getColDisplayLg};
    width: ${(props)=>getColsWidth(props).lg}
  }
  @media ${theme.screenMin.tablet} and ${theme.screenMax.laptopL}{
    display: ${getColDisplayMd};
    width: ${(props)=>getColsWidth(props).md}
  }
  @media ${theme.screenMin.mobileL} and ${theme.screenMax.tablet}{
    display: ${getColDisplaySm};
    width: ${(props)=>getColsWidth(props).sm}
  }
  @media ${theme.screenMax.mobileL} {
    display: ${getColDisplayXs};
    width: ${(props)=>getColsWidth(props).xs}
  }
  & > *{
    display: ${getColChildFlex};
    justify-content: ${getColJustify};
    align-items: ${getColAlign};
  }
`
