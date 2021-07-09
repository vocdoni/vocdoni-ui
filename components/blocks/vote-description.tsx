import React, { useState } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { VoteStatus } from '@lib/util'

import i18n from '@i18n'

import { colors } from 'theme/colors'

import { SectionText, TextSize } from '@components/elements/text'
import { Button, JustifyContent, LinkTarget } from '@components/elements/button'
import { Column, Grid } from '@components/elements/grid'
import { ProcessStatusLabel } from '@components/blocks/process-status-label'
import { When } from 'react-if'

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
  const [documentationButtonText, setDocumentationButtonText] = useState<string>(i18n.t('vote.access_to_the_documentation'))
  const [questionsAndAnswersButtonText, setQuestionsAndAnswersButtonText] = useState<string>(i18n.t('vote.questions_and_answers'))

  const pdfIcon = (
    <img src="/images/vote/pdf.svg" alt={i18n.t('vote.pdf_image_alt')} />
  )
  const questionIcon = (
    <img
      src="/images/vote/question.svg"
      alt={i18n.t('vote.question_image_alt')}
    />
  )
  const handleQuestionsAndAnswersButtonMouseEnter = () => {
    setQuestionsAndAnswersButtonText(i18n.t('vote.ask_questions_to_the_organizers'))
  }
  const handleQuestionsAndAnswersButtonMouseLeave = () => {
    setQuestionsAndAnswersButtonText(i18n.t('vote.questions_and_answers'))
  }
  const handleDocumentationButtonMouseEnter = () => {
    setDocumentationButtonText(i18n.t('vote.check_the_documentation'))
  }
  const handleDocumentationButtonMouseLeave = () => {
    setDocumentationButtonText(i18n.t('vote.access_to_the_documentation'))
  }

  return (
    <Grid>
      <Column>
        <ProcessStatusLabel status={voteStatus} />
      </Column>

      <Column>
        <DescriptionText color={colors.lightText}>{timeComment}</DescriptionText>
      </Column>

      <Column>
        <DescriptionText color={colors.lightText}>{description}</DescriptionText>
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
            onMouseEnter={handleQuestionsAndAnswersButtonMouseEnter}
            onMouseLeave={handleQuestionsAndAnswersButtonMouseLeave}
          >
            <ButtonText>{questionsAndAnswersButtonText}</ButtonText>
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
            onMouseEnter={handleDocumentationButtonMouseEnter}
            onMouseLeave={handleDocumentationButtonMouseLeave}
          >
            <ButtonText>{documentationButtonText}</ButtonText>
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

const DescriptionText = styled(SectionText)`
  white-space: pre-line;
`

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
