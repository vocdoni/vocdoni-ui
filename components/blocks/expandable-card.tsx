import { TextButton } from '@components/elements-v2/text-button'
import { Button, IButtonProps } from '@components/elements-v2/button'
import { FlexAlignItem, FlexContainer, FlexContainerProps, FlexDirection, FlexJustifyContent } from '@components/elements/flex'
import { colors } from '@theme/colors'
import { initial } from 'lodash'
import { StringifyOptions } from 'querystring'
import { ForwardedRef, forwardRef, ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components'
import { CalendarCard } from './calendar-card'
import { MarkDownViewer } from './mark-down-viewer'
import { Else, Then, If, When } from 'react-if'
import { Grid, Column } from '@components/elements/grid'
import { NoResultsCard } from './NoResultsCard'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@hooks/use-window-size'


interface IExpandableCardProps {
  children?: ReactNode
  title: string
  icon?: ReactNode

  buttonText: string
  buttonTextActive: string
  buttonProps?: IButtonProps
  buttonPropsActive?: IButtonProps
  isOpen?: boolean
  onButtonClick?: () => void
  onComponentMounted?: (ref: ForwardedRef<HTMLDivElement>) => void
}


export const ExpandableCard = forwardRef<HTMLDivElement, IExpandableCardProps>(
  (props: IExpandableCardProps,
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const i18n = useTranslation()
    const isMobile = useIsMobile()
    const DesktopHeader = () => {
      return (
        <FlexContainer alignItem={FlexAlignItem.Center} justify={FlexJustifyContent.SpaceBetween}>
          <FlexContainer alignItem={FlexAlignItem.Center}>
            <When condition={props.icon !== undefined}>
              {props.icon}
              <HorizontalSpacer />
            </When>
            <Title>{props.title}</Title>
          </FlexContainer>
          <If condition={props.isOpen}>
            <Then>
              <Button
                onClick={() => props.onButtonClick()}
                {...props.buttonPropsActive}
              >
                {props.buttonTextActive}
              </Button>
            </Then>
            <Else>
              <Button
                onClick={() => props.onButtonClick()}
                {...props.buttonProps}
              >
                {props.buttonText}
              </Button>
            </Else>
          </If>
        </FlexContainer>
      )
    }
    const MobileHeader = () => {
      return (
        <FlexContainer direction={FlexDirection.Column} justify={FlexJustifyContent.Center}>
          <When condition={props.icon !== undefined}>
            <Center>
              {props.icon}
              <VerticalSpacer />
            </Center>
          </When>
          <Title>{props.title}</Title>
        </FlexContainer>
      )
    }
    if (isMobile) {
      return (
        <Grid>
          <Column sm={12}>
            <MobileHeader />
          </Column>
          <Column sm={12}>
            {props.children}
          </Column>
        </Grid>
      )
    }
    return (
      <StyledGrid ref={ref}>
        <Column sm={12}>
          <DesktopHeader />
        </Column>
        <When condition={props.isOpen}>
          <Column sm={12}>
            {props.children}
          </Column>
        </When>
      </StyledGrid>
      // <div>
      //   <TextContainer
      //     isExpanded={isExpanded}
      //     lines={props.lines}
      //     maxHeight={props.maxHeight}
      //   >
      //     <Text>
      //       <MarkDownViewer content={props.children} />
      //     </Text>
      //   </TextContainer>
      //   <TextButton onClick={() => setIsExpanded(!isExpanded)}>
      //     {isExpanded ? props.buttonExpandedText : props.buttonText}
      //   </TextButton>
      // </div>
    )
  }
)
const HorizontalSpacer = styled.div`
  padding: 0 12px;
`
const VerticalSpacer = styled.div`
  padding: 8px 0px ;
`
const Center = styled.div`
  align-self:center;
`
const Title = styled.span`
  font-weight: 600;
  align-self:center;
  font-size: 20px;
  font-family: Manrope;
  color: ${colors.blueText};
`
const StyledGrid = styled(Grid)`
  padding: 32px 32px;
  margin: 0px;
  background: ${colors.white};
  border: 2px solid ${colors.lightBorder};
  border-radius: 16px;
  box-sizing: border-box;
  box-shadow: 0px 6px 6px rgba(180, 193, 228, 0.35);
`
