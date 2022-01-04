import { Modal } from "react-rainbow-components"
import { ModalProps } from "react-rainbow-components/components/Modal"
import { borderRadius } from "react-select/src/theme"
import styled from "styled-components"
import { Col, Row } from "./grid"
import { useRef } from "react"
import { useIsMobile } from "@hooks/use-window-size"
import { Text } from "./text"
import { Button } from "./button"
import { Spacer } from "./spacer"
import { theme } from "@theme/global"
import { useTranslation } from "react-i18next"
type StyledModalProps = {
  isMobile: boolean
}
export interface DisconnectModalProps extends ModalProps {
  onClose?: () => void
  onDisconnect?: () => void
}
export const DisconnectModal = (props: DisconnectModalProps) => {
  const modal = useRef(null)
  const isMobile = useIsMobile()
  const { i18n } = useTranslation()
  if (modal.current?.containerRef?.current) {
    modal.current.containerRef.current.style.backgroundColor = 'rgba(13, 71, 82, 0.86)'
  }

  <img src="/images/vote/disconnect-modal-icon.svg" alt="disconnect" />
  const disconnectModalIcon = (
    <img
      src="/images/vote/disconnect-modal-icon.svg"
      height={isMobile ? '48px' : '72px'}
      width={isMobile ? '48px' : '72px'}
    />
  )
  const ModalHeader = () => {
    return (
      <Row justify="center" align="center" gutter="md">
        <Col xs={12}>
          <Row justify="center">
            <Col>
              {disconnectModalIcon}
            </Col>
          </Row>
        </Col>
        <Col xs={12} justify="center">
          <Text size="xxl" weight="medium" color="error">
            {i18n.t("vote.disconnect_modal_title")}
          </Text>
        </Col>
      </Row>
    )
  }
  const ModalActions = () => {
    return (
      <Row justify='space-between'>
        <Col>
          <Button
            variant='outlined'
            color={theme.warningText}
            onClick={() => props.onDisconnect()}
          >
          {i18n.t("vote.disconnect_modal_confirm_button")}
          </Button>
        </Col>
        <Col>
          <Button
            variant='white'
            onClick={() => props.onRequestClose()}>
            {i18n.t("vote.disconnect_modal_back_button")}
          </Button>
        </Col>
      </Row >
    )
  }
  return (
    <StyledModal isMobile={isMobile} ref={modal} {...props} size='medium'>
      <Row justify="center" gutter={isMobile ? 'md' : 'lg'}>
        <Col xs={12}>
          <ModalHeader />
        </Col>
        <Col xs={12} justify="center">
          <Text align="center" size="md" color="dark-gray">
            {i18n.t("vote.disconnect_modal_subtitle")}
          </Text>
        </Col>
        <Col xs={12}>
          <Spacer size="md" direction="vertical" />
        </Col>
        <Col xs={12}>
          <ModalActions />
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
const StyledModal = styled(Modal) <StyledModalProps>`
  padding: ${getPadding};
`
