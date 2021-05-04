import React from 'react'
import styled from 'styled-components'

import { PageCard } from '@components/cards'

import { PreviewModalHeader } from './modal-header'
import { PreviewModalBody } from './modal-body'
import { VotePageHeader } from '@components/common/vote-page-header'
import { useProcessCreation } from '@hooks/process-creation'
import { VoteDescription } from '@components/common/vote-description'
import { ProcessStatus } from 'dvote-solidity'
import { PlazaMetadataKeys } from '@const/metadata-keys'
import { MetadataFields } from '../metadata'

interface PreviewModalProps {
  visible: boolean
  onClose: () => void
}

export const PreviewModal = ({visible, onClose}: PreviewModalProps) => {
  const { headerURL, headerFile, metadata, methods } = useProcessCreation()
  const processStatus = new ProcessStatus(ProcessStatus.READY);

  console.log(visible)
  return (
    <ModalBackdrop visible={visible}>
      <CloseButton onClick={onClose}>
        <img src="/images/common/close.svg" alt={'vote.close_button'} />
      </CloseButton>

      <Modal>
        <VotePageHeader
          processTitle={metadata.title.default}
          entityName="entity name"
        />

        <VoteDescription 
          voteStatus={processStatus}
          description={metadata.description.default}
          liveStream={metadata.media[MetadataFields.StreamLink]}
          discussionUrl={metadata.meta[PlazaMetadataKeys.DISCUSSION_URL]}
          attachmentUrl={metadata.meta[PlazaMetadataKeys.ATTACHMENT_URI]}
        />
        {/* <PreviewModalBody /> */}
      </Modal>
    </ModalBackdrop>
  )
}

const ModalBackdrop = styled.div<{visible?: boolean}>`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  visibility: ${({visible}) => visible? 'visible': 'hidden'};
  opacity: ${({visible}) => visible? '1': '0'};
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
