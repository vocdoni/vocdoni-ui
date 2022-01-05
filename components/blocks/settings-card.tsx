import { useIsMobile } from "@hooks/use-window-size"
import { useTranslation } from "react-i18next"
import { If, Then, Else } from "react-if"
import { Tag } from "../elements-v2/tag"
import { Col, Row } from "@components/elements-v2/grid"
import { Text } from "@components/elements-v2/text"
import { Card } from "@components/elements-v2/card"

type ISettingsCardProps = {
  isWeigthed?: boolean
  isAnonymous?: boolean
}
export const SettingsCard = (props: ISettingsCardProps) => {
  const { i18n } = useTranslation()
  const isMobile = useIsMobile()
  const settingsIcon = (
    <img
      src="/images/vote/settings.svg"
    />
  )
  const CardTitle = () => {
    return (
      <Row align='center' gutter='md'>
        <Col>
          {settingsIcon}
        </Col>
        <Col>
          <Text size='lg' color='dark-blue' weight='bold'>
            {i18n.t('vote.settings')}
          </Text>
        </Col>
      </Row>
    )
  }
  const CardContent = () => {
    return (
      <Row justify='space-between' align='center' gutter='sm'>
        <If condition={props.isWeigthed}>
        <Then>
          <Col>
            <Tag variant="neutral" size="large" fontWeight="regular">
              {i18n.t("vote.tag_is_weighted")}
            </Tag>
          </Col>
        </Then>
        <Else>
          <Col>
            <Tag variant="neutral" size="large" fontWeight="regular">
              {i18n.t("vote.tag_is_normal")}
            </Tag>
          </Col>
        </Else>
      </If>
        {props.isAnonymous &&
          <Col>
            <Tag variant="neutral" size="large" fontWeight="regular">
              {i18n.t("vote.tag_is_anonymous")}
            </Tag>
          </Col>
        }
      </Row>
    )
  }
  return (
    <Card padding="sm" variant="gray">
      <Row gutter={isMobile ? 'md' : 'lg'} >
        <Col xs={12}>
          <CardTitle />
        </Col>
        <Col xs={12}>
          <CardContent />
        </Col>
      </Row>
    </Card>
  )
}

