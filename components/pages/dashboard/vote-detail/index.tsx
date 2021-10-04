import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  ProcessResultsSingleChoice,
  ProcessDetails,
  VochainProcessStatus,
  VotingApi,
  EntityMetadata,
} from 'dvote-js'

import { colors } from 'theme/colors'
import { VOTING_AUTH_FORM_PATH, VOTING_AUTH_LINK_PATH, VOTING_AUTH_MNEMONIC_PATH } from '@const/routes'
import RouterService from '@lib/router'
import { Question } from '@lib/types'

import { FlexAlignItem, FlexContainer, FlexJustifyContent, FlexWrap } from '@components/elements/flex'
import { SectionText, SectionTitle, TextSize } from '@components/elements/text'
import { Column, Grid } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { Line } from '@components/elements/line'
import { PageCard } from '@components/elements/cards'
import { DashedLink } from '@components/blocks/dashed-link'
import { ProcessStatusLabel } from '@components/blocks/process-status-label'
import { VoteQuestionCard } from '@components/blocks/vote-question-card'
import { GeneratePdfCard } from './generate-pdf-card'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { useMessageAlert } from '@hooks/message-alert'
import { useBlockStatus, usePool } from '@vocdoni/react-hooks'
import { getVoteStatus, VoteStatus } from '@lib/util'
import { Else, If, Then, When } from 'react-if'
import { HelpText } from '@components/blocks/help-text'
import { DateDiffType, localizedStrDateDiff } from '@lib/date'
import { MarkDownViewer } from '@components/blocks/mark-down-viewer'

interface IProcessDetailProps {
  process: ProcessDetails
  results: ProcessResultsSingleChoice
  entityMetadata: EntityMetadata
  cancelProcess: () => Promise<void>
  endProcess: () => Promise<void>
}

export const ViewDetail = ({
  process,
  results,
  entityMetadata,
  cancelProcess,
  endProcess
}: IProcessDetailProps) => {
  const { i18n } = useTranslation()
  const [cancelingVote, setCancelingVote] = useState<boolean>(false)
  const [endingVote, setEndingVote] = useState<boolean>(false)
  const [endedOrCanceled, setEndedOrCanceled] = useState<boolean>(false)
  const { wallet } = useWallet({ role: WalletRoles.ADMIN })
  const { setAlertMessage } = useMessageAlert()
  const linkCensus = !process?.metadata?.meta?.formFieldTitles
  const voteLink = linkCensus
    ? RouterService.instance.get(VOTING_AUTH_LINK_PATH, {
        processId: process.id,
        key: 'PRIVATE_KEY',
      })
    : RouterService.instance.get(VOTING_AUTH_FORM_PATH, {
        processId: process.id,
      })
  const menmonicUrl = linkCensus
    ? RouterService.instance.get(VOTING_AUTH_MNEMONIC_PATH, {
        processId: process.id,
      })
    : ''

  const totalVotes = results?.totalVotes || 0

  const { blockStatus } = useBlockStatus()
  const blockHeight = blockStatus?.blockNumber || 0

  const status: VoteStatus = getVoteStatus(process?.state, blockHeight)
  const voteActive = status == VoteStatus.Active
  const canCancelorEnd =
    wallet?.address &&
    !cancelingVote &&
    !endingVote &&
    !endedOrCanceled &&
    (status == VoteStatus.Active || status == VoteStatus.Paused)

  const handleCancelVote = () => {
    if (!wallet) {
      setAlertMessage(i18n.t('error.wallet_not_available'))
      return
    } else if (process?.state?.status === VochainProcessStatus.ENDED) return

    const warning =
      i18n.t(
        'confirm.by_canceling_a_process_you_will_unlist_it_and_drop_all_of_its_votes_and_results'
      ) +
      '. ' +
      i18n.t('confirm.this_action_cannot_be_undone') +
      '.\n\n' +
      i18n.t('confirm.do_you_want_to_continue')
    if (!confirm(warning)) return

    setEndedOrCanceled(false)
    setCancelingVote(true)

    return cancelProcess()
      .then(() => {
        setEndedOrCanceled(true)
        setCancelingVote(false)
      }).catch(() => {
        setAlertMessage(i18n.t('error.we_cant_check_the_new_status_process'))
        setCancelingVote(false)
      })
  }

  const handleEndVote = () => {
    if (!wallet) {
      setAlertMessage(i18n.t('error.wallet_not_available'))
      return
    } else if (process?.state?.status === VochainProcessStatus.ENDED) return

    const warning =
      i18n.t(
        'confirm.by_ending_a_process_no_new_votes_will_be_accepted_and_results_will_be_computed'
      ) +
      '. ' +
      i18n.t('confirm.this_action_cannot_be_undone') +
      '.\n\n' +
      i18n.t('confirm.do_you_want_to_continue')
    if (!confirm(warning)) return

    setEndedOrCanceled(false)
    setEndingVote(true)

    return endProcess()
      .then(() => {
        setEndedOrCanceled(true)
        setEndingVote(false)
      }).catch(() => {
        setAlertMessage(i18n.t('error.we_cant_check_the_new_status_process'))
        setEndingVote(false)
      })
  }

  // TODO handleGeneratePdfResult return not implemented an make button not clickable
  const handleGeneratePdfResult = () => {}

  let dateDiffStr = ''
  if (
    process?.state?.startBlock &&
    (status == VoteStatus.Active ||
      status == VoteStatus.Paused ||
      status == VoteStatus.Upcoming ||
      status == VoteStatus.Ended)
  ) {
    if (process?.state?.startBlock > blockHeight) {
      const date = VotingApi.estimateDateAtBlockSync(
        process?.state?.startBlock,
        blockStatus
      )
      dateDiffStr = localizedStrDateDiff(DateDiffType.Start, date)
    } else {
      // starting in the past
      const date = VotingApi.estimateDateAtBlockSync(
        process?.state?.endBlock,
        blockStatus
      )
      dateDiffStr = localizedStrDateDiff(DateDiffType.End, date)
    }
  }

  return (
    <PageCard>
      <Grid>
        <Column>
          <FlexContainer justify={FlexJustifyContent.SpaceBetween} wrap={FlexWrap.Wrap}>
            <div>
              <SectionTitle>{i18n.t('vote_detail.vote_details')}</SectionTitle>
              <SectionText color={colors.accent1}>
                {i18n.t(
                  'vote_detail.view_and_manage_the_status_of_the_process'
                )}
              </SectionText>
            </div>

            <When
              condition={
                voteActive &&
                (process.state?.status === VochainProcessStatus.READY ||
                  process.state?.status === VochainProcessStatus.PAUSED)
              }
            >
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

      <Line color={colors.lightBorder} />

      <Grid>
        <Column md={9} sm={12}>
          <SectionContainer>
            <If condition={!linkCensus}>
              <Then>
                <SectionSpacer>
                  <SectionText color={colors.blueText} size={TextSize.Big}>
                    {i18n.t('vote_detail.link')}
                  </SectionText>
                </SectionSpacer>
                <DashedLink link={voteLink} />
              </Then>
              <Else>
                <SectionContainer>
                  <SectionText color={colors.blueText}>
                    {i18n.t(
                      'vote.this_is_the_link_that_you_need_to_send_your_community_members_replacing_the_corresponding_private_key'
                    )}
                    <HelpText
                      text={i18n.t(
                        'vote.this_is_the_link_that_you_need_to_send_your_community_members_replacing_the_corresponding_private_key_helper'
                      )}
                    />
                  </SectionText>

                  <DashedLink link={voteLink} />
                </SectionContainer>

                <SectionContainer>
                  <SectionText color={colors.blueText}>
                    {i18n.t(
                      'vote.this_is_the_link_that_your_community_members_can_use_to_access_via_mnemonic'
                    )}
                    <HelpText
                      text={i18n.t(
                        'vote.this_is_the_link_that_your_community_members_can_use_to_access_via_mnemonic_helper'
                      )}
                    />
                  </SectionText>
                  <DashedLink link={menmonicUrl} />
                </SectionContainer>
              </Else>
            </If>
          </SectionContainer>

          <SectionSpacer>
            <SectionText color={colors.blueText} size={TextSize.Big}>
              {i18n.t('vote_detail.details')}
            </SectionText>
          </SectionSpacer>

          <SectionContainer>
            <DateContainer>
              <ProcessStatusLabel status={status}></ProcessStatusLabel>
              <DateDiffText>{dateDiffStr}</DateDiffText>
            </DateContainer>
          </SectionContainer>

          <SectionContainer>
            <TitleText>{process?.metadata?.title.default}</TitleText>
            <MarkDownViewer content={process?.metadata?.description.default} />
          </SectionContainer>

          <div>
            <SectionSpacer>
              <SectionText color={colors.blueText} size={TextSize.Big}>
                {i18n.t('vote_detail.results')}
              </SectionText>
            </SectionSpacer>

            {process?.metadata && process?.metadata?.questions.map(
              (question: Question, index: number) => (
                <VoteQuestionCard
                  key={index}
                  question={question}
                  questionIdx={index}
                  hasVoted={true}
                  totalVotes={totalVotes}
                  processStatus={process?.state?.status}
                  result={results?.questions[index]}
                  selectedChoice={0}
                />
              )
            )}
          </div>

          <SectionText>
            {i18n.t('vote.total_votes')}: {totalVotes}
          </SectionText>

        </Column>

        <Column md={3} sm={12}>
          <GeneratePdfCard 
            process={process} 
            results={results} 
            entityMetadata={entityMetadata}
          />
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
const SectionSpacer = styled.div`
  margin-top: 28px;
`
const DateContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const TitleText = styled.div`
  font-size: 20px;
  font-weight: 600;
`
const DescriptionText = styled.div`
  text-align: justify;
  text-justify: inter-word;
`
const DateDiffText = styled.div`
  font-style: italic;
`
