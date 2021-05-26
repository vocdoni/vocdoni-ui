import React, { useState } from 'react'
import styled from 'styled-components'
import { ProcessStatus, IProcessInfo, DigestedProcessResults, VotingApi } from 'dvote-js'

import i18n from '@i18n'
import { colors } from 'theme/colors'
import { VOTING_AUTH_FORM_PATH } from '@const/routes'
import RouterService from '@lib/router'
import { Question } from '@lib/types'

import {
  FlexContainer,
  FlexJustifyContent,
  FlexAlignItem,
} from '@components/flex'
import { SectionText, SectionTitle } from '@components/text'
import { Grid, Column } from '@components/grid'
import { Button } from '@components/button'
import { PageCard } from '@components/cards'
import { DashedLink } from '@components/common/dashed-link'
import { ProcessStatusLabel } from '@components/process-status-label'
import { VoteQuestionCard } from '@components/common/vote-question-card'
import { GeneratePdfCard } from './generate-pdf-card'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { useMessageAlert } from '@hooks/message-alert'
import { useBlockStatus, usePool } from '@vocdoni/react-hooks'
import { getVoteStatus, VoteStatus } from '@lib/util'
import { When } from 'react-if'
import { DateDiffType, localizedStrDateDiff } from '@lib/date'

interface IProcessDetailProps {
  process: IProcessInfo
  results: DigestedProcessResults
  refreshProcessInfo: (processId: string) => Promise<IProcessInfo>
}

export const ViewDetail = ({ process, results, refreshProcessInfo }: IProcessDetailProps) => {
  const [cancelingVote, setCancelingVote] = useState<boolean>(false)
  const [endingVote, setEndingVote] = useState<boolean>(false)
  const [endedOrCanceled, setEndedOrCanceled] = useState<boolean>(false)
  const { poolPromise } = usePool()
  const { wallet } = useWallet({ role: WalletRoles.ADMIN })
  const { setAlertMessage } = useMessageAlert()

  const voteLink = RouterService.instance.get(VOTING_AUTH_FORM_PATH, {
    processId: process?.id,
  })
  const totalVotes = results?.totalVotes || 0

  const { blockStatus } = useBlockStatus()
  const blockHeight = blockStatus?.blockNumber || 0

  const status: VoteStatus = getVoteStatus(
    process,
    blockHeight
  )

  const voteActive = status == VoteStatus.Active
  const canCancelorEnd = wallet?.address && !cancelingVote && !endingVote && !endedOrCanceled &&
    (status == VoteStatus.Active || status == VoteStatus.Paused)

  const handleCancelVote = () => {
    if (!wallet) {
      setAlertMessage(i18n.t('error.wallet_not_available'))
      return
    }
    else if (process.parameters.status.isEnded) return

    const warning = i18n.t("confirm.by_canceling_a_process_you_will_unlist_it_and_drop_all_of_its_votes_and_results") + ". " +
      i18n.t("confirm.this_action_cannot_be_undone") + ".\n\n" +
      i18n.t("confirm.do_you_want_to_continue")
    if (!confirm(warning)) return

    return poolPromise
      .then((pool) => {
        wallet.connect(pool.provider)
        setCancelingVote(true)
        return VotingApi.setStatus(
          process.id,
          ProcessStatus.CANCELED,
          wallet,
          pool
        )
      })
      .then(() => refreshProcessInfo(process.id))
      .then(() => {
        setEndedOrCanceled(true)
        setCancelingVote(false)
      })
  }

  const handleEndVote = () => {
    if (!wallet) {
      setAlertMessage(i18n.t('error.wallet_not_available'))
      return
    }
    else if (process.parameters.status.isEnded) return

    const warning = i18n.t("confirm.by_ending_a_process_no_new_votes_will_be_accepted_and_results_will_be_computed") + ". " +
      i18n.t("confirm.this_action_cannot_be_undone") + ".\n\n" +
      i18n.t("confirm.do_you_want_to_continue")
    if (!confirm(warning)) return

    return poolPromise
      .then((pool) => {
        setEndingVote(true)
        wallet.connect(pool.provider)
        return VotingApi.setStatus(
          process.id,
          ProcessStatus.ENDED,
          wallet,
          pool
        )
      })
      .then(() => refreshProcessInfo(process.id))
      .then(() => {
        setEndedOrCanceled(true)
        setEndingVote(false)
      })
  }

  // TODO handleGeneratePdfResult return not implemented an make button not clickable
  const handleGeneratePdfResult = () => { }

  let dateDiffStr = ""
  if (process?.parameters?.startBlock && (status == VoteStatus.Active || status == VoteStatus.Paused)) {
    if (process?.parameters?.startBlock > blockHeight) {
      const date = VotingApi.estimateDateAtBlockSync(process?.parameters?.startBlock, blockStatus)
      dateDiffStr = localizedStrDateDiff(DateDiffType.Start, date)
    }
    else { // starting in the past
      const date = VotingApi.estimateDateAtBlockSync(process?.parameters?.startBlock + process?.parameters?.blockCount, blockStatus)
      dateDiffStr = localizedStrDateDiff(DateDiffType.End, date)
    }
  }

  return (
    <PageCard>
      <Grid>
        <Column>
          <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
            <div>
              <SectionTitle>{i18n.t('vote_detail.vote_details')}</SectionTitle>
              <SectionText color={colors.accent1}>
                {i18n.t(
                  'vote_detail.view_and_manage_the_status_of_the_process'
                )}
              </SectionText>
            </div>

            <When condition={voteActive && (process.parameters.status.isReady || process.parameters.status.isPaused)}>
              <FlexContainer height="100px" alignItem={FlexAlignItem.Center}>
                <ButtonContainer>
                  <Button
                    color={colors.accent2B}
                    border
                    wide
                    disabled={!canCancelorEnd}
                    spinner={cancelingVote}
                    onClick={handleCancelVote}
                  >
                    {i18n.t('vote_detail.cancel_vote')}
                  </Button>
                </ButtonContainer>

                <ButtonContainer>
                  <Button
                    color={colors.accent1}
                    disabled={!canCancelorEnd}
                    spinner={endingVote}
                    wide
                    border
                    onClick={handleEndVote}
                  >
                    {i18n.t('vote_detail.end_vote')}
                  </Button>
                </ButtonContainer>
              </FlexContainer>
            </When>
          </FlexContainer>
        </Column>
      </Grid>

      <Grid>
        <Column md={9} sm={12}>
          <SectionContainer>
            <SectionText color={colors.blueText}>
              {i18n.t('vote_detail.vote_link')}
            </SectionText>
            <DashedLink link={voteLink} />
          </SectionContainer>

          <SectionContainer>
            <DateContainer>
              <ProcessStatusLabel status={status}></ProcessStatusLabel>
              <div>{dateDiffStr}</div>
            </DateContainer>
          </SectionContainer>

          <SectionContainer>
            <SectionText>{process.metadata.title.default}</SectionText>

            <SectionText color={colors.lightText}>
              {process.metadata.description.default}
            </SectionText>
          </SectionContainer>

          <div>
            <SectionText color={colors.blueText}>
              {i18n.t('vote_detail.vote_results')}
            </SectionText>

            {process.metadata.questions.map(
              (question: Question, index: number) => (
                <VoteQuestionCard
                  key={index}
                  question={question}
                  questionIdx={index}
                  hasVoted={true}
                  totalVotes={totalVotes}
                  processStatus={process?.parameters.status}
                  result={results?.questions[index]}
                  selectedChoice={0}
                />
              )
            )}
          </div>
        </Column>

        <Column md={3} sm={12}>
          <GeneratePdfCard onClick={handleGeneratePdfResult} />
        </Column>
      </Grid>
      {/* </Loader> */}
    </PageCard>
  )
}

const ButtonContainer = styled.div`
  margin: 0 10px;
  width: 180px;
`
const SectionContainer = styled.div`
  margin-bottom: 16px;
`
const DateContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
