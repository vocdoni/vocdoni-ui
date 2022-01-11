import { Col, Row } from "@components/elements-v2/grid"
import { Spacer } from "@components/elements-v2/spacer"
import { Text } from "@components/elements-v2/text"
import { Choice, Question } from "@lib/types"
import { questionsValidator } from "@lib/validators/questions-validator"
import { theme } from "@theme/global"
import { JsonFeedTemplate } from "dvote-js"
import { useTranslation } from "react-i18next"
import { ProgressBar, } from "react-rainbow-components"
import styled from "styled-components"
import { useState, useEffect } from "react"
import { ProgressBarProps } from "react-rainbow-components/components/ProgressBar"
import { useIsMobile } from "@hooks/use-window-size"
import { i18n } from "i18next"
import { useProcessInfo } from "@hooks/use-process-info"
import { useUrlHash } from "use-url-hash"



export type QuestionsResultsProps = {
  question: Question
  index: number
}
type StyledProgressBarProps = ProgressBarProps & { disabled: boolean }
type StyledCardProps = {
  isMobile: boolean
}

export const QuestionResults = (props: QuestionsResultsProps) => {
  const { i18n } = useTranslation()
  const processId = useUrlHash().slice(1)
  const { totalVotes } = useProcessInfo(processId)
  const [sortedChoices, setSortedChoices] = useState<Choice[]>([])
  const [hasWinner, setHasWinner] = useState<boolean>(false)
  const isMobile = useIsMobile()
  useEffect(() => {
    setSortedChoices(props.question.choices.sort((a, b) => b.value - a.value))
  }, [totalVotes])
  useEffect(() => {
    if (sortedChoices.length > 1) {
      if (sortedChoices[0].value === sortedChoices[1].value) {
        setHasWinner(false)
      } else {
        setHasWinner(true)
      }
    }
  }, [sortedChoices])
  return (
    <Card isMobile={isMobile}>
      {/* TITLE */}
      <Row gutter="none">
        <Col xs={12}>
          <Row gutter="xs">
            <Col xs={12}>
              <Text size="md" color="primary" weight="bold">
                {i18n.t('vote.results_question', { index: props.index + 1 })}
              </Text>
            </Col>
            <Col xs={12}>
              <Text size="xxl" color="dark-blue" weight="bold">
                {props.question.title.default}
              </Text>
            </Col>
            {props.question.description &&
              <Col xs={12}>
                <Text size="sm" color="dark-gray" weight="regular">
                  {props.question.description.default}
                </Text>
              </Col>
            }
          </Row>
        </Col>
        {/* SPACING */}
        <Col xs={12}>
          <Spacer direction="vertical" size={isMobile ? 'lg' : 'xl'} />
        </Col>
        <Col xs={12}>
          <Spacer direction="vertical" size={isMobile ? 'lg' : 'xl'} />
        </Col>
        {/* QUESTIONS */}
        <Col xs={12}>
          <Row gutter='lg'>
            {sortedChoices.map(
              (choice: Choice, index: number) =>
                <Col xs={12}>
                  <Row gutter={isMobile ? 'xs' : 'lg'} align="center">
                    <Col xs={10} md={4}>
                      <Text
                        size="lg"
                        weight={index === 0 && hasWinner ? 'bold' : 'regular'}
                        color="dark-blue"
                      >
                        {choice.title.default}
                      </Text>
                    </Col>
                    <Col hiddenSmAndDown md={2}>
                      <Text
                        size="lg"
                        weight="bold"
                        color="dark-blue"
                      >
                        {((choice.value / totalVotes) * 100).toFixed(2)}%
                      </Text>
                      <Text
                        size="sm"
                        color="dark-gray"
                        weight="regular"
                      >
                        {i18n.t('vote.vote_count', { count: choice.value.toLocaleString(i18n.language) as any })}
                      </Text>
                    </Col>
                    <Col xs={12} md={6}>
                      <StyledProgressBar
                        value={getProgressPercent(choice.value, totalVotes)}
                        size={isMobile ? 'medium' : 'large'} style={{ background: '#E4E7EB' }}
                        disabled={choice.value === 0}
                      />
                    </Col>
                    <Col xs={12} hiddenSmAndUp>
                      <Row align="end" gutter="md">
                        <Col>
                          <Text
                            size="lg"
                            weight="bold"
                            color="dark-blue"
                          >
                            {((choice.value / totalVotes) * 100).toFixed(2)}%
                          </Text>
                        </Col>
                        <Col>
                          <Text
                            size="sm"
                            color="dark-gray"
                            weight="regular"
                          >
                            {i18n.t('vote.vote_count', { count: choice.value.toLocaleString(i18n.language) as any })}
                          </Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

const getTranslatedValue = (value: number, i18n: i18n): string => {
  return value.toLocaleString(i18n.language)
}
const getProgressPercent = (votes: number, totalVotes: number): number => {
  if (votes === 0) {
    return 1.5
  }
  return (votes / totalVotes) * 100
}
const getBarColor = (props: StyledProgressBarProps) => {
  if (props.disabled) {
    return '#52606D'
  }
  return theme.accent1
}
const getPadding = (props: StyledCardProps) => {
  if (props.isMobile) {
    return '24px 24px 32px'
  }
  return '40px'
}
const Card = styled.div<StyledCardProps>`
  border-radius: 16px;
  background: ${theme.background};
  padding: ${getPadding};
`
const StyledProgressBar = styled(ProgressBar) <StyledProgressBarProps>`
  background: #E4E7EB;
  & > span{
    background: ${getBarColor};
  }
`