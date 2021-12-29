import { FlexContainer, FlexAlignItem, FlexJustifyContent } from "@components/elements/flex";
import { colors } from "@theme/colors";
import { ReactNode } from "react";
import { When } from "react-if";
import styled from "styled-components";

export interface IButtonProps {
  children?: string
  onClick?: () => void
  iconLeft?: ReactNode
  iconRight?: ReactNode
  variant?: 'light' | 'primary' | 'outlined'
  disabled?: boolean
  color?: string
  width?: number | string
}

interface StyledButtonProps {
  color?: string
  width?: number | string
}

export const Button = (props: IButtonProps) => {
  const ButtonContent = () => {
    return (
      <FlexContainer
        alignItem={FlexAlignItem.Center}
        justify={FlexJustifyContent.SpaceBetween}
      >
        <When condition={props.iconLeft !== undefined}>
          {props.iconLeft}
        </When>
        {props.children}
        <When condition={props.iconRight !== undefined}>
          {props.iconRight}
        </When>
      </FlexContainer>
    )
  }
  switch (props.variant) {
    case 'light':
      return (
        <LightButton onClick={props.onClick} color={props.color} width={props.width}>
          <ButtonContent />
        </LightButton>
      )
    case 'outlined':
      return (
        <OutlinedButton onClick={props.onClick} color={props.color} width={props.width}>
          <ButtonContent />
        </OutlinedButton>
      )
    case 'primary':
      return (
        <LightButton onClick={props.onClick} color={props.color} width={props.width}>
          <ButtonContent />
        </LightButton>
      )
    default:
      return (
        <LightButton onClick={props.onClick} color={props.color} width={props.width}>
          <ButtonContent />
        </LightButton>
      )
  }
}
const BaseButton = styled.button<StyledButtonProps>`
cursor: pointer;
border-radius: 8px;
padding: 12px 20px;
font-family: Manrope;
font-weight: 600;
font-size: 16px;
`
const LightButton = styled(BaseButton)<StyledButtonProps>`
background: ${colors.white};
border: 2px solid ${colors.lightBorder};
color: ${({ color }) => color ? color : colors.blueText};
width: ${({ width }) => width ? width : 'auto'};
`
const OutlinedButton = styled(BaseButton)<StyledButtonProps>`
background: ${colors.white};
border: 2px solid ${({ color }) => color ? color : colors.accent1};
color: ${({ color }) => color ? color : colors.accent1};
width: ${({ width }) => width ? width : 'auto'};
`
