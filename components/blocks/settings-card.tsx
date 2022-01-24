import { useIsMobile } from "@hooks/use-window-size"
import { useTranslation } from "react-i18next"
import { When } from "react-if"
import { Tag } from "../elements-v2/tag"
import { Col, Row } from "@components/elements-v2/grid"
import { Text } from "@components/elements-v2/text"
import { Card } from "@components/elements-v2/card"
import { useUrlHash } from "use-url-hash"
import { VotingType } from "@lib/types"
import { useProcessInfo } from "@hooks/use-process-info"
import { SettingsIcon } from "@components/elements-v2/icons"

export const SettingsCard = () => {
  const { i18n } = useTranslation()
  const isMobile = useIsMobile()
  const processId = useUrlHash().slice(1)
  const { votingType } = useProcessInfo(processId)
  return (
    <Card padding="sm" variant="gray">
      <Row gutter={isMobile ? 'md' : 'lg'} >
        <Col xs={12}>
          <Row align='center' gutter='md'>
            <Col>
              <SettingsIcon />
            </Col>
            <Col>
              <Text size='lg' color='dark-blue' weight='regular'>
                {i18n.t('vote.settings')}
              </Text>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row justify='space-between' align='center' gutter='sm'>
            <When condition={votingType === VotingType.Weighted}>
              <Col>
                <Tag variant="neutral" size="large" fontWeight="regular">
                  {i18n.t("vote.tag_is_weighted")}
                </Tag>
              </Col>
            </When>
            <When condition={votingType === VotingType.Normal}>
              <Col>
                <Tag variant="neutral" size="large" fontWeight="regular">
                  {i18n.t("vote.tag_is_normal")}
                </Tag>
              </Col>
            </When>
            <When condition={votingType === VotingType.Anonymous}>
              <Col>
                <Tag variant="neutral" size="large" fontWeight="regular">
                  {i18n.t("vote.tag_is_anonymous")}
                </Tag>
              </Col>
            </When>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

