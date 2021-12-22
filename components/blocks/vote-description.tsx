import React, { RefObject, ReactNode, forwardRef, useEffect, ForwardedRef } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'

import { VoteStatus } from '@lib/util'

import { colors } from 'theme/colors'

import { SectionText, TextSize } from '@components/elements/text'
import { Button, JustifyContent, LinkTarget } from '@components/elements/button'
import { Column, Grid } from '@components/elements/grid'
import { ProcessStatusLabel } from '@components/blocks/process-status-label'
import { When } from 'react-if'

import { MarkDownViewer } from './mark-down-viewer'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'

interface IVotePageProps {
  description: string
  hasVideo?: boolean
  liveStreamUrl?: string
  attachmentUrl?: string
  discussionUrl?: string
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
      voteStatus,
      timeComment,
      onLogOut,
      onComponentMounted,
    }: IVotePageProps,
    ref
  ) => {
    const { i18n } = useTranslation()
    useEffect(() => {
      onComponentMounted && onComponentMounted(ref)
    }, [ref])

    const pdfIcon = (
      <img src="/images/vote/faq.png" alt={i18n.t('vote.pdf_image_alt')} />
    )
    const questionIcon = (
      <img
        src="/images/vote/pdf.png" alt={i18n.t('vote.question_image_alt')}
      />
    )

    return (
      <Grid>
        <Column>
          <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
            <ProcessStatusLabel status={voteStatus} />
            <LogOutContainer>
              { onLogOut && <Button small border onClick={() => onLogOut()}>{i18n.t('app.header.disconnect_account')}</Button>}
            </LogOutContainer>
          </FlexContainer>
        </Column>

        <Column>{timeComment}</Column>

        <Column>
          <MarkDownViewer content={description} />
        </Column>

        <When condition={discussionUrl || attachmentUrl || !!hasVideo}>
          <Column>
            <SectionText size={TextSize.Big} color={colors.blueText}>
              {i18n.t('vote.extra_information')}
            </SectionText>
          </Column>
        </When>

        <When condition={discussionUrl}>
          <Column sm={12}>
            <Button
              border
              wide
              icon={questionIcon}
              href={discussionUrl}
              target={LinkTarget.Blank}
              justify={JustifyContent.Left}
            >
              <ButtonText>
                {i18n.t('vote.access_to_the_documentation')}
              </ButtonText>
            </Button>
          </Column>
        </When>

        <When condition={attachmentUrl}>
          <Column sm={12}>
            <Button
              border
              wide
              icon={pdfIcon}
              href={attachmentUrl}
              target={LinkTarget.Blank}
              justify={JustifyContent.Left}
            >
              <ButtonText>{i18n.t('vote.questions_and_answers')}</ButtonText>
            </Button>
          </Column>
        </When>

        <When condition={hasVideo}>
          <Column>
            <LiveStreamVideoContainer ref={ref}>
              {liveStreamUrl && (
                <ReactPlayer url={liveStreamUrl} width="100%" />
              )}
            </LiveStreamVideoContainer>
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
