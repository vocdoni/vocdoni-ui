import { FlexContainer, FlexAlignItem, FlexContainerProps } from "@components/elements/flex";
import { colors } from "@theme/colors";
import react, { ReactNode } from "react";
import { When } from "react-if";
import styled from "styled-components";

type ICardProps = {
  variant?: 'neutral' | 'transparent',
  title?: string,
  icon?: ReactNode
  children?: ReactNode
  matchHeight?: boolean
}
export const Card = (props: ICardProps) => {
  const IconTitle = () => {
    return (
      <FlexContainer alignItem={FlexAlignItem.Center}>
        <When condition={props.icon !== undefined}>
          {props.icon}
          <Spacer />
        </When>
        <Title>{props.title}</Title>
      </FlexContainer>
    )
  }
  switch (props.variant) {
    case 'transparent':
      <TransparentContainer>
        <When condition={props.title !== undefined}>
          <IconTitle />
        </When>
        {props.children}
      </TransparentContainer>
    case 'neutral':
      <NeutralContainer>
        <When condition={props.title !== undefined}>
          <IconTitle />
        </When>
        {props.matchHeight}
        {props.children}
      </NeutralContainer>
    default:
      return (
        <NeutralContainer matchHeight={props.matchHeight}>
          <When condition={props.title !== undefined}>
            <IconTitle />
          </When>
          {props.children}
        </NeutralContainer>
      )
  }
}

const BaseContainer = styled.div`
  border-radius: 16px;
  padding: 24px;
`
const NeutralContainer = styled(BaseContainer) <ICardProps>`
  flex: ${({ matchHeight }) => matchHeight ? 1 : null};
  background-color: ${colors.lightBg}
`
const TransparentContainer = styled(BaseContainer) <ICardProps>`
  flex: ${({ matchHeight }) => matchHeight ? 1 : null};
  background-color: 'transparent'
`
const Title = styled.span`
  font-size: 20px;
  color: ${colors.blueText};
  font-family: Manrope;
`
const Spacer = styled.span`
  padding:0px 8px;
`
