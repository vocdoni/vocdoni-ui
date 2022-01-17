import { Card, Col, Row, Text, TextProps } from '@components/elements-v2'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useIsMobile } from '@hooks/use-window-size'
interface AnimatedTextProps extends TextProps {
  show: boolean
}
interface WaitingBannerProps {
  messages: string[]
  intervalTime?: number
}
export const WaitingBanner = (props: WaitingBannerProps) => {
  const [showMessage, setShowMessage] = useState(true)
  const [messageIndex, setMessageIndex] = useState(Math.floor(Math.floor(Math.random() * props.messages.length)))
  const isMobile = useIsMobile()
  const intervalTime = props.intervalTime !== undefined ? props.intervalTime : 7000
  useEffect(() => {
    // set as a varaible to avoid a memory leak
    const interval = setInterval(async () => {
      setShowMessage(false)
      setTimeout(() => {
        setShowMessage(true)
        // logic inside the setMessageIndex function because
        // outside message index is always 0
        setMessageIndex((messageIndex) => {
          if (messageIndex === props.messages.length - 1) {
            return 0
          }
          return messageIndex + 1
        })
      }, 1000)
    }, intervalTime)
    // cleanup
    return () => clearInterval(interval)
  }, [])
  return (
    <Card variant="white-flat" padding={isMobile ? '20px' : '32px 48px'}>
      <Row gutter='4xl' wrap={false} align='center'>
        <Col>
          <img src='/images/common/waiting-banner/head.svg'></img>
        </Col>
        <Col>
          <Row gutter='xs'>
            <Col xs={12}>
              <Text size='lg' color='secondary' weight='bold'>
                Did you know...
              </Text>
            </Col>
            <Col xs={12}>
              <AnimatedText size='sm' weight='regular' show={showMessage} color='dark-blue' innerHTML={props.messages[messageIndex]} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}
const AnimatedText = styled(Text) <AnimatedTextProps>`
  transition: all 1000ms ease-in-out;
  opacity: ${props => props.show ? 1 : 0};
`
