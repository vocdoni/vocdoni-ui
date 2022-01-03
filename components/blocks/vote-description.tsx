import React, { forwardRef, useEffect, ForwardedRef } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'

import { VoteStatus } from '@lib/util'

import { colors } from 'theme/colors'

import { SectionText, TextSize } from '@components/elements/text'
import { ProcessStatusLabelV2 } from '@components/blocks/process-status-label-v2'

import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { CalendarCard } from '@components/blocks/calendar-card'
import { SettingsCard } from '@components/blocks/settings-card'
import { LinkButton } from '@components/elements-v2/link-button'
import { useIsMobile } from '@hooks/use-window-size'
import { ExpandableContainer } from './expandable-container'
import { Col, Row } from '@components/elements-v2/grid'

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
      // MAIN ROW
      <Row gutter='xxxl'>
        {/* TAG AND DESCRIPCTION */}
        <Col xs={12}>
          {/* INSIDE ROW TO AJUST GUTTER */}
          <Row gutter='xl'>
            <Col xs={12}>
              <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
                {startDate &&
                  <ProcessStatusLabelV2 status={voteStatus} startDate={startDate} endDate={endDate} />
                }
              </FlexContainer>
            </Col>

            {description &&
              <Col xs={12}>
                <ExpandableContainer
                  lines={5}
                  buttonText={i18n.t('vote.show_more')}
                  buttonExpandedText={i18n.t('vote.show_less')}
                >
                  {description}
                </ExpandableContainer>
              </Col>
            }
          </Row>
        </Col>
        {/* DATE AND SETTINGS CARDS */}
        {((startDate && endDate) || isWeighted !== undefined || isAnonymous !== undefined) &&
          <Col xs={12}>
            {/* INSIDE ROW TO ADJUST GUTTER */}
            <Row gutter='lg'>
              {startDate && endDate &&
                <Col xs={12} md={6}>
                  <CalendarCard startDate={startDate} endDate={endDate} />
                </Col>
              }
              {(isWeighted !== undefined || isAnonymous !== undefined) &&
                <Col xs={12} md={6}>
                  <SettingsCard isWeigthed={isWeighted} />
                </Col>
              }
            </Row>
          </Col>
        }

        {/* VIDEO */}
        {hasVideo &&
          <Col xs={12}>
            {/* INSIDE ROW TO ADJUST GUTTER BETWEEN TITLE AND VIDEO*/}
            <Row gutter='md'>
              <Col xs={12}>
                <SectionText size={TextSize.Big} color={colors.blueText}>
                  {i18n.t('vote.live_stream')}
                </SectionText>
              </Col>
              <Col xs={12}>
                <LiveStreamVideoContainer ref={ref}>
                  {liveStreamUrl && (
                    <ReactPlayer url={liveStreamUrl} width="100%" />
                  )}
                </LiveStreamVideoContainer>
              </Col>
            </Row>
          </Col>
        }

        {/* LINKS */}
        {(discussionUrl || attachmentUrl) &&
          <Col xs={12}>
            {/* INSIDE ROW TO ADJUST GUTTER BETWEEN TITLE AND LINKS*/}
            <Row gutter='md'>
              <Col xs={12}>
                <SectionText size={TextSize.Big} color={colors.blueText}>
                  {i18n.t('vote.extra_information')}
                </SectionText>
              </Col>
              <Col xs={12}>
                {/* INSIDE ROW TO ADJUST GUTTER BETWEEN 2 LINKS */}
                <Row gutter='lg'>
                  {discussionUrl &&
                    <Col xs={12} md={6}>
                      <LinkButton
                        href={discussionUrl}
                        target="_blank"
                        icon={isMobile ? pdfIcon : pdfIconOutlined}
                      >
                        {i18n.t('vote.access_to_the_documentation')}
                      </LinkButton>
                    </Col>
                  }
                  {attachmentUrl &&
                    <Col xs={12} md={6}>
                      <LinkButton
                        icon={isMobile ? questionIcon : questionIconOutlined}
                        href={attachmentUrl}
                        target="_blank"
                      >
                        {i18n.t('vote.questions_and_answers')}
                      </LinkButton>
                    </Col>
                  }
                </Row>
              </Col>
            </Row>
          </Col>
        }
      </Row>
      // </Grid >
    )
  }
)


const LiveStreamVideoContainer = styled.div`
  height: 360px;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    height: 300px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    height: 160px;
  }
`
