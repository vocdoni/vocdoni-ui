import React, { forwardRef, useEffect, ForwardedRef } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'

import { VoteStatus } from '@lib/util'

import { colors } from 'theme/colors'

import { SectionText, TextSize } from '@components/elements/text'
import { Button } from '@components/elements/button'
import { Column, Grid } from '@components/elements/grid'
import { ProcessStatusLabel } from '@components/blocks/process-status-label'
import { When } from 'react-if'

import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { CalendarCard } from '@components/blocks/calendar-card'
import { SettingsCard } from '@components/blocks/settings-card'
import { LinkButton } from '@components/elements-v2/link-button'
import { useIsMobile } from '@hooks/use-window-size'
import { ExpandableContainer } from './expandable-container'

interface IVotePageProps {
  description: string
  hasVideo?: boolean
  liveStreamUrl?: string
  attachmentUrl?: string
  discussionUrl?: string
  startDate?: Date,
  endDate?: Date,
  isWeighted?: boolean
  isAnonymous?: boolean
  voteStatus: VoteStatus
  timeComment: string
  onLogOut?: () => void
  onComponentMounted?: (ref: ForwardedRef<HTMLDivElement>) => void
}

export const VoteDescription = forwardRef<HTMLDivElement, IVotePageProps>(
  (
    {
      description,
      hasVideo,
      liveStreamUrl,
      attachmentUrl,
      discussionUrl,
      startDate,
      endDate,
      voteStatus,
      timeComment,
      isWeighted,
      isAnonymous,
      onLogOut,
      onComponentMounted,
    }: IVotePageProps,
    ref
  ) => {
    const { i18n } = useTranslation()
    const isMobile = useIsMobile()
    useEffect(() => {
      onComponentMounted && onComponentMounted(ref)
    }, [ref])

    const pdfIcon = (
      <img
        src="/images/vote/pdf.svg"
        alt={i18n.t('vote.pdf_image_alt')}
      />
    )
    const questionIcon = (
      <img
        src="/images/vote/question.svg"
        alt={i18n.t('vote.question_image_alt')}
      />
    )
    const pdfIconOutlined = (
      <img
        src="/images/vote/pdf-outlined.svg"
        alt={i18n.t('vote.pdf_image_alt')}
      />
    )
    const questionIconOutlined = (
      <img
        src="/images/vote/question-outlined.svg"
        alt={i18n.t('vote.question_image_alt')}
      />
    )
    return (
      <Grid>
        <Column>
          <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
            <ProcessStatusLabel status={voteStatus} />
            <LogOutContainer>
              {onLogOut && <Button small border onClick={() => onLogOut()}>{i18n.t('app.header.disconnect_account')}</Button>}
            </LogOutContainer>
          </FlexContainer>
        </Column>
        {/* DESCRIPTION */}
        <Column>
          <ExpandableContainer
            lines={5}
            buttonText={i18n.t('vote.show_more')}
            buttonExpandedText={i18n.t('vote.show_less')}
          >
            {description}
          </ExpandableContainer>
        </Column>
        {/* DATE AND SETTINGS */}
        <When condition={startDate !== undefined && endDate !== undefined}>
          <Column sm={12} md={6}>
            <CalendarCard startDate={startDate} endDate={endDate} />
          </Column>
        </When>
        <When condition={isWeighted !== undefined || isAnonymous !== undefined}>
          <Column sm={12} md={6}>
            <SettingsCard isWeigthed={isWeighted} />
          </Column>
        </When>
        {/* LIVE STREAM */}
        <When condition={hasVideo}>
          <Column>
            <SectionText size={TextSize.Big} color={colors.blueText}>
              {i18n.t('vote.live_stream')}
            </SectionText>
          </Column>
          <Column>
            <LiveStreamVideoContainer ref={ref}>
              {liveStreamUrl && (
                <ReactPlayer url={liveStreamUrl} width="100%" />
              )}
            </LiveStreamVideoContainer>
          </Column>
        </When>
        {/* EXTRA INFO */}
        <When condition={discussionUrl || attachmentUrl || !!hasVideo}>
          <Column>
            <SectionText size={TextSize.Big} color={colors.blueText}>
              {i18n.t('vote.extra_information')}
            </SectionText>
          </Column>
        </When>
        <When condition={discussionUrl}>
          <Column sm={12} md={6}>
            <LinkButton
              href={discussionUrl}
              target="_blank"
              icon={isMobile ? pdfIcon : pdfIconOutlined}
            >
              {i18n.t('vote.access_to_the_documentation')}
            </LinkButton>
          </Column>
        </When>
        <When condition={attachmentUrl}>
          <Column sm={12} md={6}>
            <LinkButton
              icon={isMobile ? questionIcon : questionIconOutlined}
              href={attachmentUrl}
              target="_blank"
            >
              {i18n.t('vote.questions_and_answers')}
            </LinkButton>
          </Column>
        </When>
      </Grid>
    )
  }
)

const LogOutContainer = styled.div`
  display: none;

  @media ${({ theme }) => theme.screenMax.tablet} {
    display: block;
  }

`
const ButtonText = styled.p`
  color: ${colors.blueText};
  font-size: 18px;
  font-weight: 500;
  margin: 0 20px;
`

const LiveStreamVideoContainer = styled.div`
  height: 360px;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    height: 300px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    height: 160px;
  }
`
