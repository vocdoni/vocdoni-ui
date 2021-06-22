import React, { useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import {
  useEntity,
  useBlockHeight,
  useBlockStatus,
  useProcess,
} from '@vocdoni/react-hooks'

import i18n from '@i18n'

import { Question } from '@lib/types'
import { useVoting } from '@hooks/use-voting'
import { useWallet, WalletRoles } from '@hooks/use-wallet'

import { VOTING_PATH } from '@const/routes'

import { Column, Grid } from '@components/elements/grid'
import { Card, PageCard } from '@components/elements/cards'
import { Button } from '@components/elements/button'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { VoteQuestionCard } from '@components/blocks/vote-question-card'
import { MetadataFields } from '@components/pages/votes/new/metadata'

import { VotePageHeader } from '@components/blocks/vote-page-header'
import { VoteDescription } from '@components/blocks/vote-description'

import { ConfirmModal } from './components/confirm-modal'
import { VoteRegisteredCard } from './components/vote-registered-card'
import { VoteStatus, getVoteStatus } from '@lib/util'
import { Else, If, Then, When } from 'react-if'
import { SectionText, TextAlign } from '@components/elements/text'
import { useUrlHash } from 'use-url-hash'
import { VotingApi } from 'dvote-js'
import { DateDiffType, localizedStrDateDiff } from '@lib/date'
import { overrideTheme } from 'theme'

export const VotingPageView = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const { methods, choices, allQuestionsChosen, hasVoted, results, nullifier } =
    useVoting(processId)
  const { process: processInfo, error, loading } = useProcess(processId)
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata } = useEntity(processInfo?.state?.entityId)
  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  // const votePageLink = `${VOTING_PATH}/${processInfo?.id?}`

  const readOnly = !wallet?.address
  const totalVotes = results?.totalVotes || 0
  const { blockStatus } = useBlockStatus()
  const blockHeight = blockStatus?.blockNumber
  const voteStatus: VoteStatus = getVoteStatus(
    processInfo?.state,
    blockHeight
  )
  const explorerLink = process.env.EXPLORER_URL + '/envelope/' + nullifier

  let dateDiffStr = ''
  if (
    processInfo?.state?.startBlock &&
    (voteStatus == VoteStatus.Active || voteStatus == VoteStatus.Paused)
  ) {
    if (processInfo?.state?.startBlock > blockHeight) {
      const date = VotingApi.estimateDateAtBlockSync(
        processInfo?.state?.startBlock,
        blockStatus
      )
      dateDiffStr = localizedStrDateDiff(DateDiffType.Start, date)
    } else {
      // starting in the past
      const date = VotingApi.estimateDateAtBlockSync(
        processInfo?.state?.endBlock,
        blockStatus
      )
      dateDiffStr = localizedStrDateDiff(DateDiffType.End, date)
    }
  }

  return (
    <ThemeProvider
      theme={overrideTheme({
        accent1: processInfo?.metadata?.meta[MetadataFields.BrandColor],
        accent1B: processInfo?.metadata?.meta[MetadataFields.BrandColor],
        accent2: processInfo?.metadata?.meta[MetadataFields.BrandColor],
        accent2B: processInfo?.metadata?.meta[MetadataFields.BrandColor],
        textAccent1: processInfo?.metadata?.meta[MetadataFields.BrandColor],
        textAccent1B: processInfo?.metadata?.meta[MetadataFields.BrandColor],
      })}
    >
      <PageCard>
        <VotePageHeader
          processTitle={processInfo?.metadata?.title.default}
          processImage={processInfo?.metadata?.media.header}
          entityName={metadata?.name.default}
          entityImage={metadata?.media.avatar}
        />

        <Grid>
          <Column sm={12}>
            <VoteDescription
              description={processInfo?.metadata?.description.default}
              liveStream={processInfo?.metadata?.media.streamUri}
              discussionUrl={
                processInfo?.metadata?.meta[MetadataFields.DiscussionLink]
              }
              attachmentUrl={
                processInfo?.metadata?.meta[MetadataFields.AttachmentLink]
              }
              timeComment={dateDiffStr}
              voteStatus={voteStatus}
            />
          </Column>

          <If condition={readOnly}>
            <Then>
              <Card sm={12}>
                <TextContainer align={TextAlign.Center}>
                  {i18n.t('vote.you_are_connected_as_a_guest')}
                </TextContainer>
              </Card>
            </Then>
          </If>
        </Grid>

        {hasVoted && <VoteRegisteredCard explorerLink={explorerLink} />}

        {processInfo?.metadata?.questions.map(
          (question: Question, index: number) => (
            <VoteQuestionCard
              questionIdx={index}
              key={index}
              question={question}
              hasVoted={hasVoted}
              totalVotes={totalVotes}
              result={results?.questions[index]}
              processStatus={processInfo?.state?.status}
              selectedChoice={choices.length > index ? choices[index] : -1}
              readOnly={readOnly}
              onSelectChoice={(selectedChoice) => {
                methods.onSelect(index, selectedChoice)
              }}
            />
          )
        )}

        <When condition={!hasVoted && !readOnly}>
          <SubmitButtonContainer justify={FlexJustifyContent.Center}>
            <Button
              positive
              // color={processInfo?.metadata?.meta[MetadataFields.PrimaryColor]}
              disabled={!allQuestionsChosen || voteStatus != VoteStatus.Active}
              onClick={() => setConfirmModalOpened(true)}
            >
              {i18n.t('vote.submit_my_vote')}
            </Button>
          </SubmitButtonContainer>
        </When>
      </PageCard>

      <ConfirmModal
        isOpen={confirmModalOpened}
        onClose={() => setConfirmModalOpened(false)}
      />
    </ThemeProvider>
  )
}

const SubmitButtonContainer = styled(FlexContainer)`
  margin: 30px 0 20px;
`
const TextContainer = styled(SectionText)`
  margin: 12px 0;
  font-size: 16px;
`