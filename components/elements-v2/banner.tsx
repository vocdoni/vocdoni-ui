import { FlexAlignItem, FlexContainer, FlexJustifyContent } from "@components/elements/flex";
import { Column, Grid } from "@components/elements/grid";
import { useIsMobile } from "@hooks/use-window-size";
import { theme } from "@theme/global";
import { ReactNode } from "react";
import styled from "styled-components";
import { IButtonProps, Button } from "./button";
import { Col, Row } from "./grid";


interface IBannerProps {
  children: string | ReactNode
  image?: ReactNode
  variant?: BannerVariant
  buttonProps?: IButtonProps
  subtitle?: string | ReactNode
  titleSize?: TextSize
  titleWeight?: TextWeight
  subtitleSize?: TextSize
  subtitleWeight?: TextWeight
}

type BannerVariant = 'primary'
type TextSize = 'regular' | 'large' | 'small'
type TextWeight = 'regular' | 'bold'
type colSize = 'xs' | 'md' | 'lg'
interface StyledTextProps {
  size?: TextSize
  weight?: TextWeight
}


const getTextColSize = (props: IBannerProps, size: colSize) => {
  switch (size) {
    case 'xs':
      if (props.image && props.buttonProps === undefined) {
        return 9
      } else if (props.image === undefined && props.buttonProps) {
        return 12
      } else if (props.image === undefined && props.buttonProps === undefined) {
        return 12
      }
      return 9
    case 'md':
      if (props.image && props.buttonProps === undefined) {
        return 10
      } else if (props.image === undefined && props.buttonProps) {
        return 9
      } else if (props.image === undefined && props.buttonProps === undefined) {
        return 12
      }
      return 7
    case 'lg':
      if (props.image && props.buttonProps === undefined) {
        return 11
      } else if (props.image === undefined && props.buttonProps) {
        return 9
      } else if (props.image === undefined && props.buttonProps === undefined) {
        return 12
      }
      return 8
  }
}

export const Banner = (props: IBannerProps) => {
  const isMobile = useIsMobile()
  return (
    <BannerContainer variant={props.variant}>
      <Row align='center' gutter={isMobile ? 'md' : 'lg'}>
        {props.image &&
          <Col xs={3} md={2} lg={1} justify='end'>
            {props.image}
          </Col>
        }
        <Col xs={getTextColSize(props, 'xs')} md={getTextColSize(props, 'md')} lg={getTextColSize(props, 'lg')}>
          <Text weight={props.titleWeight || 'bold'} size={props.titleSize || 'large'}>
            {props.children}
          </Text>
          {props.subtitle &&
            <>
              <VerticalSpacer></VerticalSpacer>
              <Text weight={props.subtitleWeight || 'regular'} size={props.subtitleSize || 'regular'}>
                {props.subtitle}
              </Text>
            </>
          }
        </Col>
        <Col xs={12} md={3} disableFlex>
          <Button
            {...props.buttonProps}
          >
            {props.buttonProps.children}
          </Button>
        </Col>
      </Row>
    </BannerContainer >
  )
}


const getBackgroundColor = ({ variant }: { variant: BannerVariant }) => {
  switch (variant) {
    case 'primary':
      return `linear-gradient(110.89deg, ${theme.accentLight1B} 0%, ${theme.accentLight1} 100%)`
    default:
      return `linear-gradient(110.89deg, ${theme.accentLight1B} 0%, ${theme.accentLight1} 100%)`
  }
}
const getTextSize = (props: StyledTextProps) => {
  switch (props.size) {
    case 'large':
      return '16px'
    case 'regular':
      return '14px'
    case 'small':
      return '12px'
    default:
      return `14px`
  }
}
const getTextWeight = (props: StyledTextProps) => {
  switch (props.weight) {
    case 'bold':
      return '600'
    case 'regular':
      return '400'
    default:
      return `600`
  }
}

const BannerContainer = styled.div<{ variant: BannerVariant }>`
  padding: 24px 40px;
  border-radius: 16px;
  background: ${getBackgroundColor};
  @media ${({ theme }) => theme.screenMax.tablet} {
    padding: 20px;
  }
`
const Text = styled.span<StyledTextProps>`
  font-family: Manrope;
  color: ${theme.blueText};
  font-size: ${getTextSize};
  font-weight: ${getTextWeight};
`

const VerticalSpacer = styled.div`
  margin: 4px 0px;
`
