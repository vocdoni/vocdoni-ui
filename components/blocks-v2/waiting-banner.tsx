import { Card, Col, Row, Text, TextProps } from '@components/elements-v2'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useIsMobile } from '@hooks/use-window-size'
import { QuestionOutlinedIcon } from '@components/elements-v2/icons'
import { useTranslation } from 'react-i18next'
interface AnimatedTextProps extends TextProps {
  show: boolean
}
interface WaitingBannerProps {
  messages: string[]
  intervalTime?: number
  forceMobile?: boolean
}
export const WaitingBanner = (props: WaitingBannerProps) => {
  const [showMessage, setShowMessage] = useState(true)
  const [messageIndex, setMessageIndex] = useState(Math.floor(Math.floor(Math.random() * props.messages.length)))
  const isMobile = useIsMobile()
  const intervalTime = props.intervalTime !== undefined ? props.intervalTime : 14000
  const { i18n } = useTranslation()
  useEffect(() => {
    // set as a varaible to avoid a memory leak
    const interval = setInterval(() => {
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
  if (isMobile || props.forceMobile) {
    return (
      <Card
        padding='24px 32px'
        variant="white"
        borderColor='light-gray'
        borderWidth='md'
      >
        <Row gutter='xs'>
          <Col xs={12}>
            <Row gutter='md' align='center'>
              <Col>
                <QuestionOutlinedIcon size="24px" />
              </Col>
              <Col>
                <Text weight='bold' size='sm' color='secondary'>
                  {i18n.t('waiting_banner.title')}
                </Text>
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <AnimatedText
              size='sm'
              weight='regular'
              show={showMessage}
              color='dark-blue'
              innerHTML={props.messages[messageIndex]}
            />
          </Col>
        </Row>
      </Card>
    )
  }
  return (
    <Card
      variant="white"
      borderColor='light-gray'
      borderWidth='md'
      padding='32px 48px'
    >
      <Row gutter='4xl' enableWrap={false} >
        <Col>
          <img src='/images/common/waiting-banner/head.svg'></img>
        </Col>
        <Col>
          <Row gutter='xs'>
            <Col xs={12}>
              <Text size='lg' color='secondary' weight='bold'>
                {i18n.t('waiting_banner.title')}
              </Text>
            </Col>
            <Col xs={12}>
              <AnimatedText
                size='sm'
                weight='regular'
                show={showMessage}
                color='dark-blue'
                innerHTML={props.messages[messageIndex]}
              />
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
