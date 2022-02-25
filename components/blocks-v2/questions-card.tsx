import { Card, Col, Row, Text } from "@components/elements-v2"
import { useProcessWrapper } from "@hooks/use-process-wrapper"
import i18n from "@i18n"
import { useUrlHash } from "use-url-hash"

export const QuestionsCard = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const { questions } = useProcessWrapper(processId)
  if (!questions) return null
  return (
    <Row gutter="md">
      {questions.map((question, index) => (
        <Col xs={12} key={index}>
          <Card padding="24px 32px" variant="gray">
            <Row gutter="xl">
              <Col xs={12}>
                <Row gutter="xs">
                  <Col xs={12}>
                    <Text size="md" color="primary" weight="bold">
                      {i18n.t('vote_detail.questions_card.question', { number: index + 1 })}
                    </Text>
                  </Col>
                  <Col xs={12}>
                    <Text size="lg" color="dark-blue">
                      {question.title.default}
                    </Text>
                  </Col>
                </Row>
              </Col>
              <Col xs={12}>
                <Row gutter="xs">
                  <Col xs={12}>
                    <Text size="md" color="primary" weight="bold">
                      {i18n.t('vote_detail.questions_card.options')}
                    </Text>
                  </Col>
                  {question.choices.map((choice, index) => (
                    <Col xs={12}>
                      <Text size="sm" color="dark-blue">
                        {index + 1}. {choice.title.default}
                      </Text>
                    </Col>
                  ))
                  }
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
