import React, { RefObject, ReactNode, forwardRef, useEffect, ForwardedRef } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'

import { VoteStatus } from '@lib/util'

import { Button, JustifyContent, LinkTarget } from '@components/elements/button'
import { Column, Grid } from '@components/elements/grid'
import { ProcessStatusLabel } from '@components/blocks/process-status-label'
import { When } from 'react-if'

import { MarkDownViewer } from './mark-down-viewer'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'

import { VotingState } from '@components/pages/pub/votes/index'

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
  votingState?: VotingState
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
      votingState
    }: IVotePageProps,
    ref
  ) => {
    const { i18n } = useTranslation()
    useEffect(() => {
      onComponentMounted && onComponentMounted(ref)
    }, [ref])

    const getTitleFromState = (status: VotingState) => {
      switch (status) {
        case VotingState.Ended:
          return i18n.t('vote.your_vote_has_been_registered')
      }
    }

    const pdfIcon = (
      <img src="/images/vote/faq.png" width="32" alt={i18n.t('vote.pdf_image_alt')} />
    )
    const questionIcon = (
      <img
        src="/images/vote/pdf.png" width="26" alt={i18n.t('vote.question_image_alt')}
      />
    )

    return (
      <Grid>
        <Column>
          <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
            <div>
              <ProcessStatusLabel status={voteStatus} />
              <TimeComment>{timeComment}</TimeComment>
            </div>
            <VoteStatusText>{getTitleFromState(votingState)}</VoteStatusText>
          </FlexContainer>

          { false && (
            <LogOutContainer>
              { onLogOut && <Button small border onClick={() => onLogOut()}>{i18n.t('app.header.disconnect_account')}</Button>}
            </LogOutContainer>
          )}
        </Column>        

        <Column>
          <MarkDownViewer content={description} />
        </Column>

        <Separator>&nbsp;</Separator>
        <Separator>&nbsp;</Separator>

        <When condition={attachmentUrl}>
          <Column sm={12} md={7}>
            <Button
              border
              wide
              icon={questionIcon}
              href={attachmentUrl}
              target={LinkTarget.Blank}
              justify={JustifyContent.Left}
              omnium
            >
              <ButtonText>
                {i18n.t('vote.access_to_the_documentation')}
              </ButtonText>
            </Button>
          </Column>
        </When>

        <Separator>&nbsp;</Separator>

        <When condition={discussionUrl}>
          <Column sm={12} md={7}>
            <Button
              border
              wide
              icon={pdfIcon}
              href={discussionUrl}
              target={LinkTarget.Blank}
              justify={JustifyContent.Left}
              omnium
            >
              <ButtonText>{i18n.t('vote.questions_and_answers')}</ButtonText>
            </Button>
          </Column>
        </When>

        <Separator>&nbsp;</Separator>

        <When condition={hasVideo}>
          <Column>
            <LiveStreamVideoContainer ref={ref}>
              {liveStreamUrl && (
                <ReactPlayer url={liveStreamUrl} width="100%" />
              )}
            </LiveStreamVideoContainer>
          </Column>
        </When>

        <Separator>&nbsp;</Separator>
        <Separator>&nbsp;</Separator>
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
  color: #fff;
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
const Separator = styled.div`
  margin:0px;
  padding-top:5px;
  padding-bottom: 5px;
`

const TimeComment = styled.div`
  line-height: 36px;
  margin-left: 20px;
  margin-right: -40px;
  float:right;
  margin-bottom: 20px;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin-left: 20px;
    margin-right: -30px;
  }
`

const VoteStatusText = styled.div`
  line-height: 36px;
  margin-left: 20px;
`

const SimpleUl = styled.ul`
  list-style: none;

  & > li {
    line-height:25px;
  }
`

const DescriptionText = styled.div`
  font-size: 16px;
  text-align: justify;
  margin-right: -30px;

  & > p {
    font-size: 16px;
  }
`

const VerticalSpace = styled.p`
  margin-top:6px;
`
