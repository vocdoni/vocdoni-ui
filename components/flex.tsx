import styled from "styled-components";

export enum FlexJustifyContent {
  Center = 'center',
  Start = 'flex-start',
  End = 'flex-end',
  SpaceBetween = 'space-between',
  SpaceAround = 'space-around',
  SpaceEvenly = 'space-evenly'
}

export enum FlexAlignItem {
  Start = 'flex-start',
  End = 'flex-end',
  Center = 'center',
  Stretch = 'stretch',
  Baseline = 'baseline'
}

export enum FlexDirection {
  Row = 'row',
  Column = 'column'
}

export enum FlexWrap {
  Wrap = 'wrap',
  Nowrap = 'nowrap'
}

export type FlexContainerProps = {
  justify?: FlexJustifyContent,
  alignItem?: FlexAlignItem,
  direction?: FlexDirection,
  minHeight?: string,
  height?: string,
  wrap?: FlexWrap,
}

export const FlexContainer = styled.div<FlexContainerProps>`
  display: flex;
  flex-wrap: ${({wrap}) => wrap? wrap: FlexWrap.Nowrap};
  flex-direction: ${({direction}) => direction? direction: FlexDirection.Row};
  justify-content: ${({justify}) => justify? justify: FlexJustifyContent.Start};
  align-items: ${({alignItem}) => alignItem? alignItem: FlexAlignItem.Start};
  min-height: ${({minHeight}) => minHeight? minHeight: 'auto'};
  height: ${({height}) => height? height: 'auto'};
`

