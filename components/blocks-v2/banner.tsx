import { Card } from "@components/elements-v2/card";
import { useIsMobile } from "@hooks/use-window-size";
import { ReactNode } from "react";
import { CardVariant, Spacer, Text, TextProps, Button, ButtonProps, Col, Row, JustifyOptions, RowGutter } from "../elements-v2";


export interface BannerProps {
  /**
   * Children
   */
  children: string | ReactNode
  /**
   * React node with the image
   */
  image?: ReactNode
  /**
   * Card components variants are accepted
   */
  variant?: CardVariant
  /**
   * Object with the button props, icons are
   * accepted
   */
  buttonProps?: ButtonProps
  /**
   * Object with the text props for the title
   * only `size` and `weight` are supported
   */
  subtitleProps?: TextProps
  /**
   * Object with the text props for the subtitle
   * only `size` and `weight` are supported
   */
  titleProps?: TextProps
  /**
   * Padding of the card
   * md -> 24px 40px desktop (default)
   *       20px mobile
   * lg -> 32px 48px desktop
   *       20px mobile
   * @type {BannerPadding}
   */
  padding?: BannerPadding
  /**
   * Gutter of the main row
   *
   * @type {RowGutter}
   */
  gutter?: RowGutter
  innerGutter?: RowGutter
}
type BannerPadding = 'md' | 'lg'
function getBannerPadding(isMobile: boolean, padding?: BannerPadding) {
  switch (padding) {
    case 'lg':
      if (isMobile) {
        return '20px'
      }
      return '32px 48px'

    default:
      if (isMobile) {
        return '20px'
      }
      return '24px 40px'
  }
}
function getInnerRowGutter(isMobile: boolean, gutter?: RowGutter) {
  if (gutter) {
    return gutter
  }
  if (isMobile) {
    return 'md'
  }
  return 'lg'
}
export const Banner = (props: BannerProps) => {
  const isMobile = useIsMobile()
  return (
    <Card
      // padding={getBannerPadding(isMobile, props.padding)}
      variant={props.variant ? props.variant : "primary"}
    >
      <Row align='center' justify="space-between" gutter={props.gutter ? props.gutter : 'md'}>
        <Col xs={12} md={props.buttonProps ? 9 : 12}>
          <Row gutter={getInnerRowGutter(isMobile, props.innerGutter)} align="center" wrap={false} >
            {props.image &&
              <Col>
                {props.image}
              </Col>
            }
            <Col>
              <Row gutter="xs">
                <Col xs={12}>
                  <Text
                    weight={props?.titleProps?.weight ? props?.titleProps?.weight : 'bold'}
                    size={props?.titleProps?.size ? props?.titleProps?.size : 'md'}
                    color={props?.titleProps?.color ? props?.titleProps?.color : 'dark-blue'}
                  >
                    {props.children}
                  </Text>
                </Col>
                <Col xs={12} hidden={props.subtitleProps === undefined}>
                  <Text
                    weight={props?.subtitleProps?.weight ? props?.subtitleProps?.weight : 'regular'}
                    size={props?.subtitleProps?.size ? props?.subtitleProps?.size : 'sm'}
                    color={props?.subtitleProps?.color ? props?.subtitleProps?.color : 'dark-blue'}
                  >
                    {props?.subtitleProps?.children}
                  </Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        {props.buttonProps &&
          <Col xs={12} md={3}>
            <Button
              {...props.buttonProps}
            >
              {props.buttonProps.children}
            </Button>
          </Col>
        }
      </Row>
    </Card >
  )
}

