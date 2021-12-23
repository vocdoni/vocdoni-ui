import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
import { ReactNode } from 'react'
import { When } from 'react-if'
import styled from 'styled-components'


interface ITagProps {
  variant?: "neutral" | "success" | "error" | "info"
  large?: boolean
  label?: string
  children: ReactNode
}
export const Tag = (props: ITagProps) => {
  switch (props.variant) {
    case 'neutral':
      return (
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <NeutralTag large={props.large}>
            <Text large={props.large}>{props.children}</Text>
          </NeutralTag>
          <When condition={props.label !== undefined}>
            <Label>{props.label}</Label>
          </When>
        </FlexContainer>
      )
    case 'error':
      return (
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <ErrorTag large={props.large}>
            <Text large={props.large}>{props.children}</Text>
          </ErrorTag>
          <When condition={props.label !== undefined}>
            <Label>{props.label}</Label>
          </When>
        </FlexContainer>
      )
    case 'success':
      return (
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <SuccessTag large={props.large}>
            <Text large={props.large}>{props.children}</Text>
          </SuccessTag>
          <When condition={props.label !== undefined}>
            <Label>{props.label}</Label>
          </When>
        </FlexContainer>
      )
    case 'info':
      return (
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <InfoTag large={props.large}>
            <Text large={props.large}>{props.children}</Text>
          </InfoTag>
          <When condition={props.label !== undefined}>
            <Label>{props.label}</Label>
          </When>
        </FlexContainer>
      )
    default:
      return (
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <InfoTag large={props.large}>
            <Text large={props.large}>{props.children}</Text>
          </InfoTag>
          <When condition={props.label !== undefined}>
            <Label>{props.label}</Label>
          </When>
        </FlexContainer>
      )
  }
}

const BaseTag = styled.div<ITagProps>`
  border-radius: 4px;
  text-align:center;
  padding: 0px 12px;
  display: flex;
  height: ${({ large }) => large ? '32px' : '24px'};
  align-items: center;
`
const Text = styled.span<ITagProps>`
  font-family: Manrope;
  font-size: ${({ large }) => large ? '16px' : '14px'};
  font-weight: ${({ large }) => large ? '400' : '700'};
  display: inline-block;
  vertical-align: middle;
  line - height: normal;
`
const Label = styled.span`
  font-family: Manrope;
  font-weight: 600;
  font-size: 16px;
  color: #7A859F;
  margin-left: 16px;
`
const NeutralTag = styled(BaseTag) <ITagProps>`
  background: #E4E7EB;
  color: #0D4752;
`
const ErrorTag = styled(BaseTag) <ITagProps>`
  background: #B31B35;
  color: white;
`
const SuccessTag = styled(BaseTag) <ITagProps>`
background: #8ECC0A;
color: white;
`
const InfoTag = styled(BaseTag) <ITagProps>`
background: #0D4752;
color: white;
`
