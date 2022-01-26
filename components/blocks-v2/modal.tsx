import { Modal as RainbowModal } from "react-rainbow-components"
import { ModalProps as RainbowModalProps } from "react-rainbow-components/components/Modal"
import styled from "styled-components"
import { useEffect, useRef } from "react"
import { useIsMobile } from "@hooks/use-window-size"
import { Spacer, Button, Text, Col, Row } from "@components/elements-v2"
import { theme } from "@theme/global"
import { useTranslation } from "react-i18next"
import { AvailableIcons, Icon, LogOutIcon } from "@components/elements-v2/icons"
import { colorsV2 } from "@theme/colors-v2"
type StyledModalProps = {
  isMobile: boolean
}
export interface ModalProps extends RainbowModalProps {
  onAccept?: () => void
  icon: AvailableIcons
  title: string
  subtitle: string
  acceptIcon: AvailableIcons
  acceptText: string
  loading?: boolean
  closeText: string
}
export const Modal = (props: ModalProps) => {
  const modal = useRef(null)
  const isMobile = useIsMobile()
  useEffect(() => {
    if (modal.current?.containerRef?.current) {
      modal.current.containerRef.current.style.backgroundColor = 'rgba(13, 71, 82, 0.86)'
    }
  }, [props.isOpen])
  const { title, ...newProps } = props;
  return (
    <StyledModal isMobile={isMobile} ref={modal} {...newProps} size='medium' >
      <Row justify="center" gutter={isMobile ? 'md' : 'lg'}>
        <Col xs={12}>
          {/** HEADER */}
          <Row justify="center" align="center" gutter="md">
            <Col xs={12}>
              <Row justify="center">
                <Col>
                  <Icon
                    color={colorsV2.support.critical[600]}
                    name={props.icon}
                    size={isMobile ? 48 : 72}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={12} justify="center">
              <Text size="2xl" weight="medium" color='error'>
                {title}
              </Text>
            </Col>
          </Row>
        </Col>
        <Col xs={12} justify="center">
          <Text align="center" size="md" color="dark-gray" innerHTML={props.subtitle} />
        </Col>
        <Col xs={12}>
          <Spacer size="md" direction="vertical" />
        </Col>
        <Col xs={12}>
          <Row justify='space-between'>
            {/** ACTIONS */}
            <Col>
              <Button
                variant='outlined'
                loading={props.loading}
                color={colorsV2.support.critical[600]}
                onClick={() => props.onAccept()}
              >
                {props.acceptText}
              </Button>
            </Col>
            <Col>
              <Button
                variant='white'
                disabled={props.loading}
                onClick={() => props.onRequestClose()}>
                {props.closeText}
              </Button>
            </Col>
          </Row >
        </Col>
      </Row>
    </ StyledModal >
  )
}
const getPadding = (props: StyledModalProps) => {
  if (props.isMobile) {
    return '32px 24px'
  }
  return '48px 64px'
}
const StyledModal = styled(RainbowModal) <StyledModalProps>`
  padding: ${getPadding};
`
