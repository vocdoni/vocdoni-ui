
import { If, Then, Else, Switch, Case } from "react-if"
import { VoteStatus } from "@lib/util"
import { Row, Col } from "@components/elements-v2"
import { TotalVotesCard } from "@components/blocks/total-votes-card"
import { useProcessWrapper } from "@hooks/use-process-wrapper"
import { Question } from "@lib/types"
import { useUrlHash } from "use-url-hash"
import { NoResultsCard } from "@components/blocks/NoResultsCard"
import { useTranslation } from "react-i18next"
import { QuestionResults } from "@components/blocks/question-results"
import { SingleChoiceQuestionResults } from "dvote-js"

export const ResultsCard = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const { status, liveResults, votesWeight, questions, results } = useProcessWrapper(processId)
  const { i18n } = useTranslation()
  if (!questions) {
    return null
  }
  return (
    <Switch>
    <Case condition={questions.length > 0 && (status >= VoteStatus.Ended || ((status >= VoteStatus.Active)  && liveResults))}>
      {/* IF RESULTS */}
        <Row gutter='2xl'>
          <Col xs={12}>
            <TotalVotesCard />
          </Col>
          <Col xs={12}>
            <Row gutter="md">
              {results?.questions.map(
                (results: SingleChoiceQuestionResults, index: number) =>
                  <Col xs={12}>
                    <QuestionResults
                      question={questions[index]}
                      results={results}
                      index={index}
                      key={index}
                    />
                  </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Case>
      {/* IF NO RESULTS */}
      <Case condition={status < VoteStatus.Active && liveResults}>
        <NoResultsCard
          title={i18n.t('vote.no_results_title')}
          subtitle={i18n.t('vote.no_results_subtitle_live')}
        />
      </Case>
      <Case condition={status < VoteStatus.Ended && !liveResults}>
        <NoResultsCard
          title={i18n.t('vote.no_results_title')}
          subtitle={i18n.t('vote.no_results_subtitle_end')}
        />
      </Case>
      <Case condition={((status >= VoteStatus.Active && liveResults) || (status >= VoteStatus.Ended)) && (results?.totalVotes === 0 && results.totalWeightedVotes.eq(BigInt(0)) )}>
        <NoResultsCard
          title={i18n.t('vote.no_results_title')}
          subtitle={i18n.t('vote.no_votes_emitted')}
        />
      </Case>
    </Switch>
  )
}
