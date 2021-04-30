import React from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { ProcessStatus } from 'dvote-js'

import i18n from '@i18n'

import { colors } from 'theme/colors'

import { SectionText, SectionTitle, TextSize } from '@components/text'
import { Button, JustifyContent } from '@components/button'
import { Column, Grid } from '@components/grid'
import { ProcessStatusLabel } from '@components/process-status-label'

interface IVotePageProps {
  description: string
  liveSteam: string
  attachmentUrl: string
  discussionUrl: string
  voteStatus: ProcessStatus
}
export const VoteDescription = ({
  description,
  liveSteam,
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
        <ProcessStatusLabel status={voteStatus}/>
        <SectionTitle color={colors.blueText}>{description}</SectionTitle>
      </Column>

      <Column>
        <LiveStreamContainer>
          <SectionText size={TextSize.Big} color={colors.blueText}>
            {i18n.t('vote.live_stream')}
          </SectionText>

          <LiveStreamVideoContainer>
            <ReactPlayer url={liveSteam} width="100%"/>
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

      <Column>
        <Button
          border
          wide
          icon={pdfIcon}
          href={attachmentUrl}
          justify={JustifyContent.Left}
        >
          {i18n.t('vote.download_the_document')}
        </Button>
      </Column>

      <Column>
        <Button
          border
          wide
          icon={questionIcon}
          href={discussionUrl}
          justify={JustifyContent.Left}
        >
          {i18n.t('vote.questions_and_answers')}
        </Button>
      </Column>
    </Grid>
  )
}

const LiveStreamContainer = styled.div`
  margin: 20px 0;
  `

  const LiveStreamVideoContainer = styled.div`
  border-radius: 10px;
  overflow: hidden;
  width: auto;
  margin-bottom: 20px;
`
