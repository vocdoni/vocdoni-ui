import { Card } from "@components/elements-v2/card";
import { useIsMobile } from "@hooks/use-window-size";
import { ReactNode } from "react";
import { CardVariant, Spacer, Text, TextProps, Button, ButtonProps, Col, Row } from ".";


type BannerProps = {
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
}


export const Banner = (props: BannerProps) => {
  const isMobile = useIsMobile()
  return (
    <Card padding={isMobile ? '20px' : '24px 40px'} variant={props.variant || "primary"}>
      <Row align='center' justify="space-between" gutter="md">
        <Col xs={12} md={9}>
          <Row gutter={isMobile ? 'md' : 'lg'} align="center" wrap={false}>
            {props.image &&
              <Col>
                {props.image}
              </Col>
            }
            <Col>
              <Text weight={props?.titleProps?.weight || 'bold'} size={props?.titleProps?.size || 'md'} color="dark-blue">
                {props.children}
              </Text>
              {props.subtitleProps &&
                <>
                  <Spacer size="xxs" direction="vertical" />
                  <Text weight={props.subtitleProps.weight || 'regular'} size={props.subtitleProps.size || 'sm'} color='dark-blue'>
                    {props.subtitleProps.children}
                  </Text>
                </>
              }
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

