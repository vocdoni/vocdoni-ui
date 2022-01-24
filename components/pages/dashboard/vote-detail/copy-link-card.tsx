import { Card, Col, Row, Button, Text } from '@components/elements-v2'
import { LinkIcon } from '@components/elements-v2/icons'
import { theme } from '@theme/global'
import copy from 'copy-to-clipboard'
import { useMessageAlert } from '@hooks/message-alert'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface CopyLinkCardProps {
  url: string
}

export const CopyLinkCard = (props: CopyLinkCardProps) => {
  const { i18n } = useTranslation()
  const { setAlertMessage } = useMessageAlert()
  const handleCopy = () => {
    copy(props.url)
    setAlertMessage(i18n.t("copy.the_link_has_been_copied_to_the_clipboard"))
  }
  return (
    <Card padding='16px' flat variant='dashed'>
      <Row align="center" justify='space-between' wrap={false} gutter='md'>
        <Col xs="auto">
          <LinkIcon />
        </Col>
        <Col xs={12}>
          <Row align='center' justify='space-between' gutter='xs' wrap={false}>
            <Col xs={9}>
              <EllipsisText size='sm' color='dark-blue'> {props.url} </EllipsisText>
            </Col>
            <Col xs={4}>
              <Button variant='white' color={theme.accent1} size='sm' onClick={handleCopy}>
                {i18n.t('vote.copy')}
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
`
