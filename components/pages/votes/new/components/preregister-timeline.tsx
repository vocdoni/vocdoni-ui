import { Steps } from "@components/blocks-v2/steps"
import { Card, Col, Row } from "@components/elements-v2"
import moment from "moment"
import { useTranslation } from "react-i18next"


interface PreregistrationTimelineProps {
  startDate?: Date
  endDate?: Date
}
const DATE_FORMAt = 'll'
export const PreregisterTimeline = (props: PreregistrationTimelineProps) => {
  const { i18n } = useTranslation()
  const steps = [
    {
      label: moment(Date.now()).locale(i18n.language).format('l'),
      title: i18n.t('votes.new.preregister_step_1.title'),
      subtitle: i18n.t('votes.new.preregister_step_1.subtitle'),
    },
    {
      label: props.startDate ? moment(props.startDate).locale(i18n.language).format('l') : '?',
      title: i18n.t('votes.new.preregister_step_2.title'),
      subtitle: i18n.t('votes.new.preregister_step_2.subtitle'),
    },
    {
      label: props.endDate ? moment(props.endDate).locale(i18n.language).format('l') : '?',
      title: i18n.t('votes.new.preregister_step_3.title'),
      subtitle: i18n.t('votes.new.preregister_step_3.subtitle'),
    }
  ]
  return (
    <Card variant="gray" padding="sm">
      <Row>
        <Col xs={12}>
          <Steps
            steps={steps}
            activeIndex={0}
            showProgress
          />
        </Col>
      </Row>
    </Card>
  )
}
