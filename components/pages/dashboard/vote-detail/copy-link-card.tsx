import { Card, Col, Row, Button, Text } from '@components/elements-v2'
import { LinkIcon } from '@components/elements-v2/icons'
import { theme } from '@theme/global'
import copy from 'copy-to-clipboard'
import { useMessageAlert } from '@hooks/message-alert'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useState } from 'react'

interface CopyLinkCardProps {
  url: string
}

export const CopyLinkCard = (props: CopyLinkCardProps) => {
  const { i18n } = useTranslation()
  const { setAlertMessage } = useMessageAlert()
  const [buttonText, setButtontext] = useState<string>(i18n.t('vote.copy'))
  const [disabled, setDisabled] = useState(false)
  const handleCopy = () => {
    setButtontext(i18n.t('vote.copied'))
    setDisabled(true)
    setTimeout(() => {
      setDisabled(false)
      setButtontext(i18n.t('vote.copy'))
    }, 2000)
    copy(props.url)
    setAlertMessage(i18n.t("copy.the_link_has_been_copied_to_the_clipboard"))
  }
  return (
    <Card padding='16px' variant='dashed'>
      <Row align="center" justify='space-between' enableWrap={false} gutter='md'>
        <Col xs="auto">
          <LinkIcon />
        </Col>
        <Col xs={12}>
          <Row align='center' justify='space-between' gutter='xs' enableWrap={false}>
            <Col xs={9}>
              <EllipsisText size='sm' color='dark-blue'> {props.url} </EllipsisText>
            </Col>
            <Col xs={6} md={4}>
              <Button
                variant='white'
                color={theme.accent1}
                size='sm'
                disabled={disabled}
                onClick={handleCopy}
              >
                {buttonText}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

const EllipsisText = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 296px;
  display: block;
  white-space: nowrap;
  @media ${theme.screenMin.desktop} {
    max-width: 300px;
  }
  @media ${theme.screenMin.laptopL} and ${theme.screenMax.desktop} {
    max-width: 256px;
  }
  @media ${theme.screenMin.tablet} and ${theme.screenMax.laptopL}{
    max-width: 150px;
  }
  @media ${theme.screenMin.mobileL} and ${theme.screenMax.tablet}{
    max-width: 128px;
  }
  @media ${theme.screenMax.mobileL} {
    max-width: 128px;
  }
`
