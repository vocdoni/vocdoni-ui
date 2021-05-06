import React from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { VoteStatus } from '@lib/util'

import i18n from '@i18n'

import { colors } from 'theme/colors'

import { SectionText, TextSize } from '@components/text'
import { Button, JustifyContent, LinkTarget } from '@components/button'
import { Column, Grid } from '@components/grid'
import { ProcessStatusLabel } from '@components/process-status-label'

interface IVotePageProps {
  description: string
  liveStream: string
  attachmentUrl?: string
  discussionUrl?: string
  voteStatus: VoteStatus
}
export const VoteDescription = ({
  description,
  liveStream,
  attachmentUrl,
  discussionUrl,
  voteStatus,
}: IVotePageProps) => {
  const pdfIcon = (
    <img src="/images/vote/pdf.svg" alt={i18n.t('vote.pdf_image_alt')} />
  )
  const questionIcon = (
    <img
      src="/images/vote/question.svg"
      alt={i18n.t('vote.question_image_alt')}
    />
  )
  console.log('El status es', voteStatus)
  return (
    <Grid>
      <Column>
        <ProcessStatusLabel status={voteStatus} />
      </Column>

      <Column>
        <SectionText color={colors.lightText}>{description}</SectionText>
      </Column>

      <Column>
        <LiveStreamContainer>
          <SectionText size={TextSize.Big} color={colors.blueText}>
            {i18n.t('vote.live_stream')}
          </SectionText>

          <LiveStreamVideoContainer>
            <ReactPlayer url={liveStream} width="100%" />
          </LiveStreamVideoContainer>

          <SectionText size={TextSize.Big} color={colors.blueText}>
            {i18n.t('vote.discussion')}
          </SectionText>

          <SectionText color={colors.lightText}>
            {i18n.t(
              'vote.check_documentation_covering_the_relevant_topics_of_the_vote_and_discus'
            )}
          </SectionText>
        </LiveStreamContainer>
      </Column>

      {attachmentUrl && (
        <Column>
          <Button
            border
            wide
            icon={pdfIcon}
            href={attachmentUrl}
            target={LinkTarget.Blank}
            justify={JustifyContent.Left}
          >
            <ButtonText>{i18n.t('vote.download_the_document')}</ButtonText>
          </Button>
        </Column>
      )}

      {discussionUrl && (
        <Column>
          <Button
            border
            wide
            icon={questionIcon}
            href={discussionUrl}
            target={LinkTarget.Blank}
            justify={JustifyContent.Left}
          >
            <ButtonText>{i18n.t('vote.questions_and_answers')}</ButtonText>
          </Button>
        </Column>
      )}
    </Grid>
  )
}

const ButtonText = styled.p`
  color: ${colors.blueText};
  font-size: 20px;
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
