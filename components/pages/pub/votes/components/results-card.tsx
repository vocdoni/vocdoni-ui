
import { If, Then, Else } from "react-if"
import { VoteStatus } from "@lib/util"
import { Row, Col } from "@components/elements-v2"
import { TotalVotesCard } from "@components/blocks/total-votes-card"
import { useProcessInfo } from "@hooks/use-process-info"
import { Question } from "@lib/types"
import { useUrlHash } from "use-url-hash"
import { NoResultsCard } from "@components/blocks/NoResultsCard"
import { useTranslation } from "react-i18next"
import { QuestionResults } from "@components/blocks/question-results"

export const ResultsCard = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const { status, liveResults, totalVotes, questions } = useProcessInfo(processId)
  const { i18n } = useTranslation()
  if (questions) {
    return (
      <If condition={(status === VoteStatus.Ended || liveResults) && totalVotes > 0 && questions.length > 0}>
        {/* IF RESULTS */}
        <Then>
          <Row gutter='xxl'>
            <Col xs={12}>
              <TotalVotesCard />
            </Col>
            <Col xs={12}>
              {questions.map(
                (question: Question, index: number) =>
                  <QuestionResults
                    question={question}
                    index={index}
                    key={index}
                  />
              )}
            </Col>
          </Row>
        </Then>
        {/* IF NO RESULTS */}
        <Else>
          <NoResultsCard
            title={i18n.t('vote.no_results_title')}
            subtitle={i18n.t('vote.no_results_subtitle')}
          />
        </Else>
      </If>
    )
  }
  return null
}
