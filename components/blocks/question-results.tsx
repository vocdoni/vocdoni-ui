import { Col, Row } from "@components/elements-v2/grid"
import { Spacer } from "@components/elements-v2/spacer"
import { Text } from "@components/elements-v2/text"
import { Choice, Question } from "@lib/types"
import { questionsValidator } from "@lib/validators/questions-validator"
import { theme } from "@theme/global"
import { JsonFeedTemplate, MultiLanguage, SingleChoiceQuestionResults } from "dvote-js"
import { useTranslation } from "react-i18next"
import { ProgressBar, } from "react-rainbow-components"
import styled from "styled-components"
import { useState, useEffect } from "react"
import { ProgressBarProps } from "react-rainbow-components/components/ProgressBar"
import { useIsMobile } from "@hooks/use-window-size"
import { i18n } from "i18next"
import { useProcessWrapper } from "@hooks/use-process-wrapper"
import { useUrlHash } from "use-url-hash"
import { BigNumber } from "ethers"
import { colorsV2 } from "@theme/colors-v2"


export type QuestionsResultsProps = {
  question: Question
  results: SingleChoiceQuestionResults
  index: number
}
type StyledProgressBarProps = ProgressBarProps & { disabled: boolean }
type StyledCardProps = {
  isMobile: boolean
}
type ChoiceResult = {
  title: MultiLanguage<string>;
  votes: BigNumber;
}
export const QuestionResults = (props: QuestionsResultsProps) => {
  const { i18n } = useTranslation()
  const processId = useUrlHash().slice(1)
  const { votesWeight } = useProcessWrapper(processId)
  const [sortedChoices, setSortedChoices] = useState<ChoiceResult[]>([])
  const [hasWinner, setHasWinner] = useState<boolean>(false)
  const isMobile = useIsMobile()
  useEffect(() => {
    // sort all the responses by number of votes higher to lower
    const sortedChoices = props.results.voteResults.sort((a, b) => {
      const diff = b.votes.sub(a.votes)
      if (b.votes.eq(a.votes)) return 0
      else if (diff.lt(0)) return -1
      return 1
    })
    setSortedChoices(sortedChoices)
    // Check if is one response that is winning
    if (sortedChoices.length > 1) {
      if (sortedChoices[0].votes.eq(sortedChoices[1].votes)) {
        setHasWinner(false)
      } else {
        setHasWinner(true)
      }
    }
  }, [votesWeight])
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
              <Text size="2xl" color="dark-blue" weight="bold">
                {props.results.title.default}
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
              (choice: ChoiceResult, index: number) =>
                <Col xs={12} key={index}>
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
                        {getStringPercent(getPercent(choice.votes, votesWeight))}%
                      </Text>
                      <Text
                        size="sm"
                        color="dark-gray"
                        weight="regular"
                      >
                        {i18n.t('vote.vote_count', { count: choice.votes.toString() as any })}
                      </Text>
                    </Col>
                    <Col xs={12} md={6}>
                      <StyledProgressBar
                        value={getBarPercent(choice.votes, votesWeight)}
                        size={isMobile ? 'medium' : 'large'} style={{ background: colorsV2.neutral[100] }}
                        disabled={choice.votes.eq(0)}
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
                            {getStringPercent(getPercent(choice.votes, votesWeight))}%
                          </Text>
                        </Col>
                        <Col>
                          <Text
                            size="sm"
                            color="dark-gray"
                            weight="regular"
                          >
                            {i18n.t('vote.vote_count', { count: choice.votes.toString() as any })}
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
const getBarPercent = (votes: BigNumber, totalVotes: BigNumber): number => {
  if (votes.eq(0)) {
    return 1.5
  }
  return getPercent(votes, totalVotes)
}
const getPercent = (votes: BigNumber, totalVotes: BigNumber): number => {
  // used to avoid losing decimal precision
  const ratio = votes.mul(10000)
  return ratio.div(totalVotes).toNumber() /100
}
const getStringPercent = (percent: number): string => {
  const decimal = percent % 1
  if (decimal == 0) {
    return percent.toFixed(0)
  }
  return percent.toFixed(2)
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
const cosmeticProps = ['isMobile']
const styledConfig = {
  shouldForwardProp: (prop) => !cosmeticProps.includes(prop)
}
const Card = styled.div.withConfig(styledConfig)<StyledCardProps>`
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
