import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { ProcessStatus } from 'dvote-js'

import i18n from '@i18n'

import { useProcessCreation } from '@hooks/process-creation'

import { VoteStatus } from '@lib/util'
import { Question } from '@lib/types'

import { PlazaMetadataKeys } from '@const/metadata-keys'

import { PageCard } from '@components/cards'
import { VotePageHeader } from '@components/common/vote-page-header'
import { VoteDescription } from '@components/common/vote-description'
import { VoteQuestionCard } from '@components/common/vote-question-card'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { Button } from '@components/button'

import { MetadataFields } from '../metadata'
import { overrideTheme } from 'theme'

interface PreviewModalProps {
  entityName: string
  entityLogo: string
  visible: boolean
  onClose: () => void
}

export const PreviewModal = ({
  entityName,
  entityLogo,
  visible,
  onClose,
}: PreviewModalProps) => {
  const { headerURL, headerFile, metadata, methods } = useProcessCreation()
  const processStatus = new ProcessStatus(ProcessStatus.READY)
  const voteStatus = VoteStatus.Active

  return (
    <ThemeProvider
      theme={overrideTheme({
        accent1: metadata.meta[MetadataFields.BrandColor],
        accent1B: metadata.meta[MetadataFields.BrandColor],
        accent2: metadata.meta[MetadataFields.BrandColor],
        accent2B: metadata.meta[MetadataFields.BrandColor],
        textAccent1: metadata.meta[MetadataFields.BrandColor],
        textAccent1B: metadata.meta[MetadataFields.BrandColor]
      })}
    >
      <ModalBackdrop visible={visible}>
        <CloseButton onClick={onClose}>
          <img src="/images/common/close.svg" alt={'vote.close_button'} />
        </CloseButton>

        <Modal>
          <VotePageHeader
            processTitle={metadata.title.default}
            entityName={entityName}
            entityImage={entityLogo}
            processImage={headerURL}
          />

          <VoteDescription
            voteStatus={voteStatus}
            description={metadata.description.default}
            liveStream={metadata.media[MetadataFields.StreamLink]}
            discussionUrl={metadata.meta[PlazaMetadataKeys.DISCUSSION_URL]}
            attachmentUrl={metadata.meta[PlazaMetadataKeys.ATTACHMENT_URI]}
            timeComment={i18n.t('preview.ending_in_one_hour')}
          />

          {metadata.questions.map((question: Question, index: number) => (
            <VoteQuestionCard
              key={index}
              question={question}
              questionIdx={index}
              hasVoted={false}
              processStatus={processStatus}
              totalVotes={0}
              selectedChoice={0}
            />
          ))}

          <FlexContainer justify={FlexJustifyContent.Center}>
            <Button positive onClick={onClose}>
              {i18n.t('preview.vote')}
            </Button>
          </FlexContainer>
        </Modal>
      </ModalBackdrop>
    </ThemeProvider>
  )
}

const ModalBackdrop = styled.div<{ visible?: boolean }>`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  transition: opacity 0.3s;
`
const Modal = styled(PageCard)`
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow: scroll;
  margin: 50px auto;
`

const CloseButton = styled.div`
  position: fixed;
  right: 20px;
  top: 20px;
  cursor: pointer;

  & > img {
    width: 18px;
  }
`
