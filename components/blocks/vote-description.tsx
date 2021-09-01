import React from 'react'
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

interface IVotePageProps {
  description: string
  liveStream: string
  attachmentUrl?: string
  discussionUrl?: string
  voteStatus: VoteStatus
  timeComment: string
}

export const VoteDescription = ({
  description,
  liveStream,
  attachmentUrl,
  discussionUrl,
  voteStatus,
  timeComment,
}: IVotePageProps) => {
  const { i18n } = useTranslation()

  const pdfIcon = (
    <img src="/images/vote/pdf.svg" alt={i18n.t('vote.pdf_image_alt')} />
  )
  const questionIcon = (
    <img
      src="/images/vote/question.svg"
      alt={i18n.t('vote.question_image_alt')}
    />
  )

  return (
    <Grid>
      <Column>
        <ProcessStatusLabel status={voteStatus} />
      </Column>

      <Column>
        {timeComment}
      </Column>

      <Column>
          <MarkDownViewer content={description} />
      </Column>

      <When condition={discussionUrl || attachmentUrl || liveStream}>
        <Column>
          <SectionText size={TextSize.Big} color={colors.blueText}>
            {i18n.t('vote.extra_information')}
          </SectionText>
        </Column>
      </When>

      <When condition={discussionUrl}>
        <Column md={6} sm={12}>
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
        <Column md={6} sm={12}>
          <Button
            border
            wide
            icon={pdfIcon}
            href={attachmentUrl}
            target={LinkTarget.Blank}
            justify={JustifyContent.Left}
          >
            <ButtonText>
              {i18n.t('vote.questions_and_answers')}
            </ButtonText>
          </Button>
        </Column>
      </When>

      <When condition={liveStream}>
        <Column>
          <LiveStreamContainer>
            <LiveStreamVideoContainer>
              <ReactPlayer url={liveStream} width="100%" />
            </LiveStreamVideoContainer>
          </LiveStreamContainer>
        </Column>
      </When>

    </Grid>
  )
}

const ButtonText = styled.p`
  color: ${colors.blueText};
  font-size: 18px;
  font-weight: 500;
  margin: 0 20px;
`

const LiveStreamContainer = styled.div`
  margin: 10px 0 20px 0;
`

const LiveStreamVideoContainer = styled.div`
  border-radius: 10px;
  overflow: hidden;
  width: auto;
  margin-bottom: 20px;
`
