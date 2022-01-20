import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Else, If, Then, When } from 'react-if'
import { useBlockStatus, usePool } from '@vocdoni/react-hooks'
import {
  ProcessDetails,
  VochainProcessStatus,
  VotingApi,
  EntityMetadata,
} from 'dvote-js'

import { colors } from 'theme/colors'
import { VOTING_AUTH_FORM_PATH, VOTING_AUTH_LINK_PATH, VOTING_AUTH_MNEMONIC_PATH } from '@const/routes'
import RouterService from '@lib/router'
import { IProcessResults, Question, VotingType } from '@lib/types'
import { getVoteStatus, VoteStatus } from '@lib/util'
import { DateDiffType, localizedStrDateDiff } from '@lib/date'

import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { useMessageAlert } from '@hooks/message-alert'

import { FlexAlignItem, FlexContainer, FlexJustifyContent, FlexWrap } from '@components/elements/flex'
import { SectionText, SectionTitle, TextSize } from '@components/elements/text'
import { Column, Grid } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { Line } from '@components/elements/line'
import { Card, PageCard } from '@components/elements/cards'
import { DashedLink } from '@components/blocks/dashed-link'
import { ProcessStatusLabel } from '@components/blocks/process-status-label'
import { VoteQuestionCard } from '@components/blocks/vote-question-card'
import { HelpText } from '@components/blocks/help-text'
import { MarkDownViewer } from '@components/blocks/mark-down-viewer'
import { TextAlign, Typography, TypographyVariant } from '@components/elements/typography'

import { GeneratePdfCard } from './generate-pdf-card'
import { Col, Row, Text, LinkButton } from '@components/elements-v2'
import { ProcessStatusLabel as ProcessStatusLabelV2 } from '@components/blocks-v2'
import { theme } from '@theme/global'
import { DocumentOutlinedIcon, LightningSlashIcon, QuestionOutlinedIcon } from '@components/elements-v2/icons'
import { ExpandableContainer } from '@components/blocks/expandable-container'
import { DetailsCard } from './details-card'

interface IProcessDetailProps {
  process: ProcessDetails
  results: IProcessResults
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
  
  const processVotingType: VotingType = process?.state?.censusOrigin as any

  const totalVotes =
    VotingType.Weighted === processVotingType
      ? results?.totalWeightedVotes
      : results?.totalVotes

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

            </CardV2>
          </Col>
        </Row>
        <Spacer size='2xl' direction='vertical' />
        <Row gutter='lg'>
          <Col xs={4}>
            <DetailsCard
              title='Calendar'
              options={[
                {
                  title: 'Start',
                  value: '7-8-1995(20:00)'
                },
                {
                  title: 'End',
                  value: '7-8-1995(20:00)'
                }
              ]}
            />
          </Col>
          <Col xs={4}>
            <DetailsCard
              title='Settings'
              options={[
                {
                  title: 'Type',
                  value: 'Normal Voting'
                },
                {
                  title: 'Options',
                  value: 'anonymous/abstain'
                }
              ]}
            />
          </Col>
          <Col xs={4}>
            <DetailsCard
              title='Census details'
              options={[
                {
                  title: 'Size',
                  value: '17.523 voters'
                },
                {
                  title: 'Name',
                  value: 'list_of_voters.csv'
                }
              ]}
            />
          </Col>
        </Row>
        <Spacer size='2xl' direction='vertical' />

        <Row gutter='lg'>
          <Col xs={5}>
            <Row gutter='md'>
              <Col xs={12}>
                <Text size='md' color='dark-blue' weight='regular'>
                  Voting Link
                </Text>
              </Col>
              <Col xs={12}>
                <CardV2 padding='16px' flat>
                  <Row justify='space-between' align="center">
                    <Col>
                <a href="voting link"> https://plaza.vocdoni.app/the/vote</a>
                    </Col>
                    <Col>
                <ButtonV2 variant='light'>
                  Copy
                </ButtonV2>
                    </Col>
                  </Row>
                </CardV2>
              </Col>
            </Row>
          </Col>
          <Col xs={7}>
            <Row gutter='md'>
              <Col xs={12}>
                <Text size='md' color='dark-blue' weight='regular'>
                  External Links
                </Text>
              </Col>
              <Col xs={12}>
                <Row gutter='lg'>
                  <Col xs={4}>
                    <LinkButton href='https://da.docs' target='_blank' icon={<DocumentOutlinedIcon />}>Document</LinkButton>
                  </Col>
                  <Col xs={4}>
                  <LinkButton href='https://da.qya' target='_blank' icon={<QuestionOutlinedIcon />}>Q&A</LinkButton>
                  </Col>
                  <Col xs={4}>
                  <LinkButton href='https://da.stream' target='_blank' icon={<DocumentOutlinedIcon />}>Stream</LinkButton>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>

      </CardV2>

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

          <Grid>
              <Card sm={12}>
                <Typography align={TextAlign.Center} margin='margin: 12px 0' variant={TypographyVariant.Body1}>
                  {processVotingType === VotingType.Weighted
                    ? i18n.t('vote.total_weighted_votes', {
                        totalVotes: results?.totalVotes,
                        totalWeightedVotes: results?.totalWeightedVotes,
                      })
                    : i18n.t('vote.total_votes', {
                        totalVotes: results?.totalVotes,
                      })}
                </Typography>
              </Card>
            </Grid>
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
