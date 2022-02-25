import { useIsMobile } from "@hooks/use-window-size"
import { useTranslation } from "react-i18next"
import { When } from "react-if"
import { Tag } from '@components/elements-v2/tag'
import { Col, Row } from "@components/elements-v2/grid"
import { Text } from "@components/elements-v2/text"
import { Card } from "@components/elements-v2/card"
import { useUrlHash } from "use-url-hash"
import { VotingType } from "@lib/types"
import { useProcessWrapper } from "@hooks/use-process-wrapper"
import { CogIcon } from "@components/elements-v2/icons"

interface SettingsCardProps {
  votingType: VotingType
  isAnonymous: boolean
}

export const SettingsCard = (props: SettingsCardProps) => {
  const { i18n } = useTranslation()
  const isMobile = useIsMobile()
  return (
    <Card padding="sm" variant="gray">
      <Row gutter={isMobile ? 'md' : 'lg'} >
        <Col xs={12}>
          <Row align='center' gutter='md'>
            <Col>
              <CogIcon size={24} />
            </Col>
            <Col>
              <Text size='lg' color='dark-blue' weight='regular'>
                {i18n.t('vote.settings')}
              </Text>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row justify='start' align='center' gutter='sm'>
            {props.votingType === VotingType.Weighted &&
              <Col>
                <Tag variant="neutral" size="large" fontWeight="regular">
                  {i18n.t("vote.tag_is_weighted")}
                </Tag>
              </Col>
            }
            {props.votingType === VotingType.Normal &&
              <Col>
                <Tag variant="neutral" size="large" fontWeight="regular">
                  {i18n.t("vote.tag_is_normal")}
                </Tag>
              </Col>
            }
            {props.isAnonymous &&
              <Col>
                <Tag variant="neutral" size="large" fontWeight="regular">
                  {i18n.t("vote.tag_is_anonymous")}
                </Tag>
              </Col>
            }
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

