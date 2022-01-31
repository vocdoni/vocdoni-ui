import { Card, Col, Row, Text } from "@components/elements-v2"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export const AnonymousMessage = () => {
  const i18n = useTranslation()
  const messages: string[] = i18n.t('votes.new.anonymous_messages', { returnObjects: true }) as string[]
  return (
    <Card padding="sm" variant="gray">
      <Row gutter="md">
        <Col xs={12}>
          <Text
            size="xs"
            weight="bold"
            color="dark-blue"
            innerHTML={i18n.t('votes.new.by_activating_the_anonymous_voting_option')}
          />
        </Col>
        <Col xs={12}>
          {messages.map((message) =>
            <StyledText
              size="xs"
              color="dark-blue"
              innerHTML={message}
            />
          )
          }
        </Col>
      </Row>

    </Card>
  )
}
const StyledText = styled(Text)`
  line-height: 21px;
`
