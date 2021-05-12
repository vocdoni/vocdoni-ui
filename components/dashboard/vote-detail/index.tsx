import React, { useState } from 'react'
import styled from 'styled-components'
import { ProcessStatus } from 'dvote-solidity'
import { ProcessInfo, usePool } from '@vocdoni/react-hooks'
import { DigestedProcessResults, VotingApi } from 'dvote-js'

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
import { useLoadingAlert } from '@hooks/loading-alert'
import { useBlockHeight } from '@vocdoni/react-hooks'
import { getVoteStatus, VoteStatus } from '@lib/util'

interface IProcessDetailProps {
  process: ProcessInfo
  results: DigestedProcessResults
}

export const ViewDetail = ({ process, results }: IProcessDetailProps) => {
  const { setLoadingMessage, hideLoading } = useLoadingAlert()
  const { poolPromise } = usePool()
  const { wallet } = useWallet({ role: WalletRoles.ADMIN })
  const { setAlertMessage } = useMessageAlert()

  const voteActive = process.parameters.status.value === ProcessStatus.READY
  const voteLink = RouterService.instance.get(VOTING_AUTH_FORM_PATH, {
    processId: process.id,
  })
  const totalVotes = results?.totalVotes || 0

  const { blockHeight } = useBlockHeight()

  const status: VoteStatus = getVoteStatus(process.parameters.status, process.parameters.startBlock, blockHeight)


  const handleCancelVote = () => {
    if (!wallet) {
      setAlertMessage(i18n.t('error.wallet_not_available'))
      return
    }
    // TODO which states allow for canceling?
    if (process.parameters.status.isCanceled || process.parameters.status.isEnded) {
      setAlertMessage(i18n.t('error.process_cannot_be_canceled'))
    }
    //TODO make loader work or add spinner
    setLoadingMessage(i18n.t('votes.show.updating'))
    return poolPromise.then(pool => {
      wallet.connect(pool.provider)
      return VotingApi.setStatus(process.id, ProcessStatus.CANCELED, wallet, pool)
    }).then(() => hideLoading())
  }

  const handleEndVote = () => {
    if (!wallet) {
      setAlertMessage(i18n.t('error.wallet_not_available'))
      return
    }
    if (process.parameters.status.isEnded) {
      setAlertMessage(i18n.t('error.process_already_ended'))
    }
    //TODO make loader work or add spinner
    setLoadingMessage(i18n.t('votes.show.updating'))
    return poolPromise.then(pool => {
      wallet.connect(pool.provider)
      return VotingApi.setStatus(process.id, ProcessStatus.ENDED, wallet, pool)
    }).then(() => hideLoading)
  }
  // TODO handleGeneratePdfResult return not implemented an make button not clickable
  const handleGeneratePdfResult = () => { }
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

            {voteActive && (
              <FlexContainer height="100px" alignItem={FlexAlignItem.Center}>
                <ButtonContainer>
                  <Button
                    color={colors.accent2B}
                    border
                    wide
                    onClick={handleCancelVote}
                  >
                    {i18n.t('vote_detail.cancel_vote')}
                  </Button>
                </ButtonContainer>

                <ButtonContainer>
                  <Button color={colors.accent1} wide border onClick={handleEndVote}>
                    {i18n.t('vote_detail.end_vote')}
                  </Button>
                </ButtonContainer>
              </FlexContainer>
            )}
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
            <ProcessStatusLabel
              status={status}
            ></ProcessStatusLabel>
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
                  index={index}
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
