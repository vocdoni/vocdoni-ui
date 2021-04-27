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

export type FlexContainerProps = {
  justify?: FlexJustifyContent,
  alignItem?: FlexAlignItem
}

export const FlexContainer = styled.div<FlexContainerProps>`
  justify-content: ${({justify}) => justify? justify: FlexJustifyContent.Start};
  align-items: ${({alignItem}) => alignItem? alignItem: FlexAlignItem.Start};
  display: flex
`

