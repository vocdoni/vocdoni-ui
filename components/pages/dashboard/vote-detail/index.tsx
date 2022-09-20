import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { PROCESS_PATH, VOTING_AUTH_FORM_PATH, VOTING_AUTH_LINK_PATH } from '@const/routes'
import RouterService from '@lib/router'
import { VotingType } from '@lib/types'
import { VoteStatus } from '@lib/util'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { useMessageAlert } from '@hooks/message-alert'
import { Button, Card, Spacer } from '@components/elements-v2'
import { GeneratePdfCard } from './generate-pdf-card-v2'
import { IColProps, Col, Row, Text, LinkButton } from '@components/elements-v2'
import { ProcessStatusLabel } from '@components/blocks-v2'
import { theme } from '@theme/global'
import { DocumentOutlinedIcon, PieChartIcon, QuestionCircleIcon, QuestionOutlinedIcon } from '@components/elements-v2/icons'
import { ExpandableContainer } from '@components/blocks/expandable-container'
import { DetailsCard } from './details-card'
import { CopyLinkCard } from './copy-link-card'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useUrlHash } from 'use-url-hash'
import { ExpandableCard } from '@components/blocks/expandable-card'
import { ResultsCard } from '@components/pages/pub/votes/components/results-card'
import { QuestionsCard } from '@components/blocks-v2/questions-card'
import { useIsMobile } from '@hooks/use-window-size'
import { colorsV2 } from '@theme/colors-v2'
import { Modal } from '@components/blocks-v2/modal'
import moment from 'moment'


export const ViewDetail = () => {
  // Hooks
  const processId = useUrlHash().slice(1) // Skip "/"
  const { wallet } = useWallet({ role: WalletRoles.ADMIN })
  const { setAlertMessage } = useMessageAlert()
  const isMobile = useIsMobile()
  const { i18n } = useTranslation()
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false)
  const [isEndModalOpen, setIsEndModalOpen] = useState<boolean>(false)
  const [isCancellledOrEnded, setIsCancelledOrEnded] = useState<boolean>(false)
  const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false)
  const [isEndLoading, setIsEndLoading] = useState<boolean>(false)
  const [isResultsCardOpen, setIsResultsCardOpen] = useState<boolean>(false)
  const [isQuestionsCardOpen, setIsQuestionsCardOpen] = useState<boolean>(false)
  const resultsCardRef = useRef(null)
  const {
    processInfo,
    title,
    censusSize,
    description,
    startDate,
    endDate,
    votingType,
    status: processStatus,
    liveStreamUrl,
    discussionUrl,
    attachmentUrl,
    hasEnded,
    methods,
    isAnonymous
  } = useProcessWrapper(processId)
  const toCalendarFormat = (date: Date) => {
    let momentDate = moment(date).locale('es').format("MMM DD - YYYY (HH:mm)")
    return momentDate.charAt(0).toUpperCase() + momentDate.slice(1)
  }

  useEffect(() => {
    if (processStatus == VoteStatus.Ended) {
      setIsResultsCardOpen(true)
    }
  }, [processStatus])

  // Constants
  const linkCensus = !processInfo?.metadata?.meta?.formFieldTitles
  const voteLink = linkCensus
    ? RouterService.instance.get(VOTING_AUTH_LINK_PATH, {
      processId: processId,
      key: 'PRIVATE_KEY',
    })
    : RouterService.instance.get(VOTING_AUTH_FORM_PATH, {
      processId: processId,
    })
  const canCancelorEnd =
    wallet?.address &&
    !isCancelLoading &&
    !isEndLoading &&
    !isCancellledOrEnded &&
    (processStatus == VoteStatus.Active || processStatus == VoteStatus.Paused)
  // Show conditions
  const showPreviewButton = [VoteStatus.Upcoming, VoteStatus.Active, VoteStatus.Ended].includes(processStatus)
  const showCancelButton = [VoteStatus.Upcoming, VoteStatus.Active].includes(processStatus)
  const showEndButton = processStatus === VoteStatus.Active
  const showResultsCard = [VoteStatus.Upcoming, VoteStatus.Active, VoteStatus.Ended].includes(processStatus)

  const processLink = RouterService.instance.get(PROCESS_PATH, { processId: processId })
  // compute voting type string
  const voteTypeString = () => {
    if (votingType === VotingType.Weighted) {
      return i18n.t('vote_detail.settings_card.weighted_voting')
    }
    return i18n.t('vote_detail.settings_card.normal_voting')
  }
  // compute options stringg
  const voteOptionsString = () => {
    const strArray = []
    if (isAnonymous) {
      strArray.push(i18n.t('vote_detail.settings_card.anonymous_voting'))
    }
    if (strArray.length > 0) {
      return strArray.join(' / ')
    }
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
        // {
        //   title: i18n.t('vote_detail.census_card.filename'),
        //   value: 'list_of_voters.csv'
        // }
      ]
    }
  ]

  // Handlers
  const handleSeeResultsClick = () => {
    setIsResultsCardOpen(true)
    setTimeout(() => {
      resultsCardRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }, 200)
  }
  // open results card
  const handleResultsCardButtonClick = () => {
    setIsResultsCardOpen(!isResultsCardOpen)
  }
  // open questions card
  const handleQuestionsCardButtonClick = () => {
    setIsQuestionsCardOpen(!isQuestionsCardOpen)
  }
  // end vote
  const handleEndVote = async () => {
    // If not wallet return
    if (!wallet) {
      setAlertMessage(i18n.t('error.wallet_not_available'))
      return
    }
    // If process is already ended return
    if (processStatus === VoteStatus.Ended) return
    // show confirmation dialog
    const warning = `${i18n.t('confirm.by_ending_a_process_no_new_votes_will_be_accepted_and_results_will_be_computed')}. ${i18n.t('confirm.this_action_cannot_be_undone')}.\n\n ${i18n.t('confirm.do_you_want_to_continue')} `
    if (!confirm(warning)) return
    // set loading to true
    setIsEndLoading(true)
    methods.pauseProcess(processId, wallet).then(() => {
      // if every thing goes well set loading to false and close the modal
      setIsEndLoading(false)
      setIsEndModalOpen(false)
    }).catch(() => {
      // if not set loading to false, close the modal and show an error message
      setIsEndLoading(false)
      setIsEndModalOpen(false)
      setAlertMessage(i18n.t('error.we_cant_check_the_new_status_process'))
    })
  }
  // cancel vote
  const handleCancelVote = async () => {
    if (!wallet) {
      setAlertMessage(i18n.t('error.wallet_not_available'))
      return
    }
    if (processStatus === VoteStatus.Ended) return
    // show confirmation dialog
    const warning = `${i18n.t('confirm.by_canceling_a_process_you_will_unlist_it_and_drop_all_of_its_votes_and_results')}. ${i18n.t('confirm.this_action_cannot_be_undone')}.\n\n ${i18n.t('confirm.do_you_want_to_continue')} `
    if (!confirm(warning)) return
    // set is loading to true
    setIsCancelLoading(true)
    methods.cancelProcess(processId, wallet).then(() => {
      // if every thing goes well set loading to false and close the modal
      setIsCancelLoading(false)
      setIsCancelModalOpen(false)
    }).catch(() => {
      // if not set loading to false, close the modal and show an error message
      setIsCancelLoading(false)
      setIsCancelModalOpen(false)
      setAlertMessage(i18n.t('error.we_cant_check_the_new_status_process'))
    })
  }

  const handleCloseCancelModal = () => {
    if (isCancelLoading) {
      return
    }
    setIsCancelModalOpen(false)
  }
  const handleCloseEndModal = () => {
    if (isEndLoading) {
      return
    }
    setIsEndModalOpen(false)
  }


  return (
    <>
      <Card padding={isMobile ? '20px' : '48px 72px'} variant='white' >
        <Row wrap={isMobile ? true : false} justify='space-between' gutter={isMobile ? 'lg' : 'none'}>
          {/* TITLES */}
          <Col xs={12} md={4}>
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
          {/* BUTTONS */}
          <Col>
            <Row gutter={isMobile ? 'xs' : 'lg'}>
              {showPreviewButton &&
                <Col xs={12} md="auto">
                  <Button
                    onClick={() => window.open(processLink, '_ blank')}
                    variant='white'
                    iconLeft={{ name: 'eye', size: 24 }}
                  >
                    {i18n.t('vote_detail.preview')}
                  </Button>
                </Col>
              }
              {showCancelButton &&
                <Col xs={12} md="auto">
                  <Button
                    variant='white-error'
                    onClick={() => setIsCancelModalOpen(true)}
                    color={theme.blueText}
                    iconLeft={{ name: 'trash', size: 24 }}
                    disabled={!canCancelorEnd}
                  >
                    {i18n.t('vote_detail.cancel_vote')}
                  </Button>
                </Col>
              }
              {showEndButton &&
                <Col xs={12} md="auto">
                  <Button
                    variant='white-error'
                    onClick={() => setIsEndModalOpen(true)}
                    color={theme.blueText}
                    iconLeft={{ name: 'paper-check', size: 24 }}
                    disabled={!canCancelorEnd}
                  >
                    {i18n.t('vote_detail.end_vote')}
                  </Button>
                </Col>
              }
            </Row>
          </Col>
        </Row>
        <Spacer showDivider size='5xl' direction='vertical' />
        <Row gutter='2xl'>
          <Col xs={12}>
            <Row gutter='2xl'>
              {/* LABEL AND DESCRIPTION */}
              <Col xs={12} md={8}>
                <Row gutter='xl'>
                  <Col xs={12}>
                    <ProcessStatusLabel />
                  </Col>
                  <Col xs={12}>
                    <Row gutter='md'>
                      <Col xs={12}>
                        <Text size='lg' >
                          {title}
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
              {/* SIDE BAR */}
              <StickyCol xs={12} md={4} hiddenSmAndDown disableFlex>
                <GeneratePdfCard onSeeResultsClick={handleSeeResultsClick} />
              </StickyCol>
            </Row>
          </Col>
          {/* <Spacer size='2xl' direction='vertical' /> */}
          {/* VOTE DETAILS */}
          <Col xs={12}>
            <Row gutter='lg'>
              {
                voteDetails.map((detail, index) => (
                  <Col xs={12} md={4} lg={index === 2 ? 2 : 5}>
                    <DetailsCard
                      title={detail.title}
                      options={detail.options}
                    />
                  </Col>
                ))
              }
            </Row>
          </Col>
          <Col xs={12}>

            <Row gutter='lg'>
              {/* VOTING LINK */}
              <Col xs={12} md={4} lg={5}>
                <Row gutter='md'>
                  <Col xs={12}>
                    <Text size='md' color='dark-blue' weight='regular'>
                      {i18n.t('vote_detail.voting_link.title')}
                    </Text>
                  </Col>
                  <Col xs={12}>
                    <CopyLinkCard url={voteLink} />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={8} lg={7}>
                {/* EXTERNAL LINKS */}
                <Row gutter='md'>
                  <Col xs={12}>
                    <Text size='md' color='dark-blue' weight='regular'>
                      {i18n.t('vote_detail.external_links.title')}
                    </Text>
                  </Col>
                  <Col xs={12}>
                    <Row gutter='lg'>
                      <Col xs={12} md={4}>
                        <LinkButton
                          href={attachmentUrl}
                          disabled={!attachmentUrl}
                          target='_blank'
                          icon={<DocumentOutlinedIcon />}
                        >
                          {i18n.t('vote_detail.external_links.document')}
                        </LinkButton>
                      </Col>
                      <Col xs={12} md={4}>
                        <LinkButton
                          href={discussionUrl}
                          disabled={!discussionUrl}
                          target='_blank'
                          icon={<QuestionOutlinedIcon />}
                        >
                          {i18n.t('vote_detail.external_links.q_and_a')}
                        </LinkButton>
                      </Col>
                      <Col xs={12} md={4}>
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
          </Col>

          <Col xs={12}>
            <Row gutter='md'>
              {/* RESULTS CARD */}
              {showResultsCard &&
                <Col xs={12}>
                  <ExpandableCard
                    ref={resultsCardRef}
                    isOpen={isResultsCardOpen}
                    onButtonClick={handleResultsCardButtonClick}
                    title={i18n.t("vote_detail.results_card.title")}
                    icon={<PieChartIcon size={40} />}
                    buttonProps={{
                      variant: 'white',
                      iconRight: { name: 'chevron-up-down', size: 24 },
                      children: i18n.t("vote_detail.results_card.show")
                    }}
                    buttonPropsOpen={{
                      variant: 'white',
                      iconRight: { name: 'chevron-up-down', size: 24 },
                      children: i18n.t("vote_detail.results_card.hide")
                    }}
                  >
                    <ResultsCard />
                  </ExpandableCard>
                </Col>
              }
              {/* QUESTIONS CARD */}
              <Col xs={12}>
                <ExpandableCard
                  isOpen={isQuestionsCardOpen}
                  onButtonClick={handleQuestionsCardButtonClick}
                  title={i18n.t("vote_detail.questions_card.title")}
                  icon={<QuestionCircleIcon size={40} />}
                  buttonProps={{
                    variant: 'white',
                    iconRight: { name: 'chevron-up-down', size: 24 },
                    children: i18n.t("vote_detail.results_card.show")
                  }}
                  buttonPropsOpen={{
                    variant: 'white',
                    iconRight: { name: 'chevron-up-down', size: 24 },
                    children: i18n.t("vote_detail.results_card.hide")
                  }}
                >
                  <QuestionsCard />
                </ExpandableCard>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      {/* CANCEL MODAL */}
      <Modal
        hideCloseButton
        loading={isCancelLoading}
        isOpen={isCancelModalOpen}
        onRequestClose={handleCloseCancelModal}
        onAccept={handleCancelVote}
        icon='alert-circle'
        title={i18n.t("vote_detail.cancel_dialog.title")}
        subtitle={i18n.t("vote_detail.cancel_dialog.subtitle")}
        acceptIcon='trash'
        acceptText={i18n.t("vote_detail.cancel_dialog.acceptText")}
        closeText={i18n.t("vote_detail.cancel_dialog.backText")}
      />
      {/* END MODAL */}
      <Modal
        hideCloseButton
        loading={isEndLoading}
        isOpen={isEndModalOpen}
        onRequestClose={handleCloseEndModal}
        onAccept={handleEndVote}
        icon='alert-circle'
        title={i18n.t("vote_detail.end_dialog.title")}
        subtitle={i18n.t("vote_detail.end_dialog.subtitle")}
        acceptIcon='trash'
        acceptText={i18n.t("vote_detail.end_dialog.acceptText")}
        closeText={i18n.t("vote_detail.end_dialog.backText")}
      />

    </>
  )
}

const StickyCol = styled(Col) <IColProps>`
  position: sticky;
  top: 20px;
`
