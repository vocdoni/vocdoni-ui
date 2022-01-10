import { Button, ButtonProps } from '@components/elements-v2/button'
import { ForwardedRef, forwardRef, ReactNode } from 'react'
import { Else, Then, If } from 'react-if'
import { useIsMobile } from '@hooks/use-window-size'
import { Col, Row } from '@components/elements-v2/grid'
import { Text } from '@components/elements-v2/text'
import { Card } from '@components/elements-v2/card'


interface ExpandableCardProps {
  children?: ReactNode
  title: string
  icon?: ReactNode
  buttonProps?: ButtonProps
  buttonPropsOpen?: ButtonProps
  isOpen?: boolean
  onButtonClick?: () => void
  onComponentMounted?: (ref: ForwardedRef<HTMLDivElement>) => void
}


export const ExpandableCard = forwardRef<HTMLDivElement, ExpandableCardProps>(
  (props: ExpandableCardProps, ref) => {
    const isMobile = useIsMobile()
    if (isMobile) {
      return (
        <div ref={ref}>
          <Row gutter='xxxl'>
            <Col xs={12}>
              <Row justify='center' gutter='md'>
                {props.icon !== undefined &&
                  <Col>
                    {props.icon}
                  </Col>
                }
                <Col xs={12} justify='center'>
                  <Text align='center' size='lg' color='dark-blue' weight='bold'>
                    {props.title}
                  </Text>
                </Col>
              </Row >
            </Col>
            <Col xs={12}>
              {props.children}
            </Col>
          </Row>
        </div>
      )
    }
    return (
      <Card ref={ref} padding='md'>
        <Row gutter="xxxl">
          <Col xs={12} >
            <Row align='center' justify='space-between'>
              {/* OUTER COL */}
              <Col>
                { /* INNER Row to adjust paddings*/}
                <Row align='center' gutter='lg'>
                  <Col>
                    {
                      props.icon !== undefined && props.icon
                    }
                  </Col>
                  <Col>
                    <Text size='lg' color='dark-blue' weight='bold'>
                      {props.title}
                    </Text>
                  </Col>
                </Row>
              </Col>
              {/* COL for button */}
              <Col>
                <If condition={props.isOpen}>
                  <Then>
                    <Button
                      onClick={() => props.onButtonClick()}
                      {...props.buttonPropsOpen}
                    >
                      {props.buttonPropsOpen.children}
                    </Button>
                  </Then>
                  <Else>
                    <Button
                      onClick={() => props.onButtonClick()}
                      {...props.buttonProps}
                    >
                      {props.buttonProps.children}
                    </Button>
                  </Else>
                </If>
              </Col>
            </Row >
          </Col>
          {!!props.isOpen && props.children &&
            <Col sm={12}>
              {props.children}
            </Col>}
        </Row>
      </Card>
    )
  }
)
