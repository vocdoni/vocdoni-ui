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
import { GeneratePdfCard as GeneratePdfCardV2 } from './generate-pdf-card-v2'
import { Col, Row, Text, LinkButton } from '@components/elements-v2'
import { ProcessStatusLabel as ProcessStatusLabelV2 } from '@components/blocks-v2'
import { theme } from '@theme/global'
import { DocumentOutlinedIcon, LightningSlashIcon, QuestionOutlinedIcon, TrashIcon } from '@components/elements-v2/icons'
import { ExpandableContainer } from '@components/blocks/expandable-container'
import { DetailsCard } from './details-card'
import { CopyLinkCard } from './copy-link-card'
import { useProcessInfo } from '@hooks/use-process-info'
import { useUrlHash } from 'use-url-hash'
import { useCalendar } from '@hooks/use-calendar'
import { stream } from 'xlsx/types'

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
  const processId = useUrlHash().slice(1) // Skip "/"
  const {
    censusSize,
    description,
    startDate,
    endDate,
    votingType,
    liveStreamUrl,
    discussionUrl,
    attachmentUrl
  } = useProcessInfo(processId)
  const { toCalendarFormat } = useCalendar()
  // compute voting type string
  const voteTypeString = () => {
    if(votingType === VotingType.Weighted) {
      return i18n.t('vote_detail.settings_card.weighted_voting')
    }
    return i18n.t('vote_detail.settings_card.normal_voting')
  }
  // compute options stringg
  const voteOptionsString = () => {
    // here goes the logic to check if is anonymous, can abstanin, etc...
    return '-'
  }
  // compute vote details
  const voteDetails = [
    {
      title: i18n.t('vote_detail.calendar_card.title'),
      options: [
        {
          title: i18n.t('vote_detail.calendar_card.start_date'),
          value: toCalendarFormat(startDate)
        },
        {
          title: i18n.t('vote_detail.calendar_card.end_date'),
          value: toCalendarFormat(endDate)
        }
      ]
    },
    {
      title: i18n.t('vote_detail.settings_card.title'),
      options: [
        {
          title: i18n.t('vote_detail.settings_card.type'),
          value: voteTypeString()
        },
        {
          title: i18n.t('vote_detail.settings_card.options'),
          value: voteOptionsString()
        }
      ]
    },
    {
      title: i18n.t('vote_detail.census_card.title'),
      options: [
        {
          title: i18n.t('vote_detail.census_card.size'),
          value: i18n.t('vote_detail.census_card.voters', { censusSize: censusSize.toLocaleString(i18n.language) })
        },
        {
          title: i18n.t('vote_detail.census_card.filename'),
          value: 'list_of_voters.csv'
        }
      ]
    }
  ]

  return (
    <>
      <CardV2 padding="48px 72px" flat>
        <Row wrap={false} justify='space-between'>
          <Col>
            <Row gutter='xs'>
              <Col xs={12}>
                <Text size='display-1' color='dark-blue' weight='medium'>
                  {i18n.t('vote_detail.vote_details')}
                </Text>
              </Col>
              <Col xs={12}>
                <Text size='lg' color='dark-gray' weight='regular'>
                  {i18n.t('vote_detail.view_and_manage_the_status_of_the_process')}
                </Text>
              </Col>
            </Row>
          </Col>
          <Col>
            <ButtonV2 variant='outlined' color={theme.errorV2} iconRight={<TrashIcon />}>
              {i18n.t('vote_detail.cancel_vote')}
            </ButtonV2>
          </Col>
        </Row>
        <Spacer showDivider size='5xl' direction='vertical' />
        <Row>
          <Col xs={8}>
            <Row gutter='xl'>
              <Col xs={12}>
                <ProcessStatusLabelV2 />
              </Col>
              <Col xs={12}>
                <Row gutter='md'>
                  <Col xs={12}>
                    <Text size='lg' >
                      { }
                    </Text>
                  </Col>
                  <Col xs={12}>
                    <ExpandableContainer
                      lines={5}
                      buttonText={i18n.t('vote.show_more')}
                      buttonExpandedText={i18n.t('vote.show_less')}
                    >
                      {description}
                    </ExpandableContainer>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs={4}>
            <GeneratePdfCardV2>

            </GeneratePdfCardV2>
            <CardV2 variant='gray'>

            </CardV2>
          </Col>
        </Row>
        <Spacer size='2xl' direction='vertical' />
        {/* VOTE DETAILS */}
        <Row gutter='lg'>
          {
            voteDetails.map((detail) => (
              <Col xs={4}>
                <DetailsCard
                  title={detail.title}
                  options={detail.options}
                />
              </Col>
            ))
          }
        </Row>
        <Spacer size='2xl' direction='vertical' />

        <Row gutter='lg'>
          {/* VOTING LINK */}
          <Col xs={5}>
            <Row gutter='md'>
              <Col xs={12}>
                <Text size='md' color='dark-blue' weight='regular'>
                  {i18n.t('vote_detail.voting_link.title')}
                </Text>
              </Col>
              <Col xs={12}>
                <CopyLinkCard url="https://akjdaskljjdsakljdsakljdklsajdklasjkldajskldjklasjdklasjskldajdlkjaskldjakjdksajdaksurl" />
              </Col>
            </Row>
          </Col>
          <Col xs={7}>
            {/* EXTERNAL LINKS */}
            <Row gutter='md'>
              <Col xs={12}>
                <Text size='md' color='dark-blue' weight='regular'>
                  {i18n.t('vote_detail.external_links.title')}
                </Text>
              </Col>
              <Col xs={12}>
                <Row gutter='lg'>
                  <Col xs={4}>
                    <LinkButton
                      href={attachmentUrl}
                      disabled={!attachmentUrl}
                      target='_blank'
                      icon={<DocumentOutlinedIcon />}
                    >
                      {i18n.t('vote_detail.external_links.document')}
                    </LinkButton>
                  </Col>
                  <Col xs={4}>
                    <LinkButton
                      href={discussionUrl}
                      disabled={!discussionUrl}
                      target='_blank'
                      icon={<QuestionOutlinedIcon />}
                    >
                      {i18n.t('vote_detail.external_links.q_and_a')}
                    </LinkButton>
                  </Col>
                  <Col xs={4}>
                    <LinkButton
                      href={liveStreamUrl}
                      disabled={!liveStreamUrl}
                      target='_blank'
                      icon={<DocumentOutlinedIcon />}
                    >
                      {i18n.t('vote_detail.external_links.stream')}
                    </LinkButton>
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
