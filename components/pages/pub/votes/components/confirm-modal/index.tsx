import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-rainbow-components/components/Modal'

import { useVoting } from '@hooks/use-voting'
import { ViewContext, ViewStrategy } from '@lib/strategy'

import { ModalQuestionList } from './questions-list'
import { VoteSubmitted } from './vote-submitted'
import { useUrlHash } from 'use-url-hash'
import { useProcess } from '@vocdoni/react-hooks'
import { VoteSubmitting } from './vote-submitting'

interface IConfigModal {
  isOpen: boolean
  onClose: () => void
  onVoted: () => void
}

export const ConfirmModal = ({ isOpen, onClose, onVoted }: IConfigModal) => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const { process: processInfo } = useProcess(processId)
  const { choices, hasVoted, methods, pleaseWait, actionError } = useVoting(processId)
  const handleOnClose = () => {
    if (hasVoted) {
      onVoted()
      return
    }
    if (pleaseWait) { return }
    onClose()
  }

  const handleSendVote = async () => {
    await methods.submitVote()
  }


  const renderResponsesList = new ViewStrategy(
    () => !hasVoted && !pleaseWait,
    (<>
      <ModalQuestionList
        questions={processInfo?.metadata?.questions}
        choices={choices}
        onSubmit={handleSendVote}
        sendingVote={pleaseWait}
        onClose={onClose}
      />
    </>
    )
  )

  const renderVoteBeingSubmitted = new ViewStrategy(
    () => !hasVoted && pleaseWait,
    (
      <VoteSubmitting />
    )
  )

  const renderVoteSubmitted = new ViewStrategy(
    () => hasVoted,
    <VoteSubmitted onAccept={onVoted} />
  )

  const viewContext = new ViewContext([
    renderResponsesList,
    renderVoteBeingSubmitted,
    renderVoteSubmitted,
  ])

  return <Modal isOpen={isOpen} onRequestClose={handleOnClose} hideCloseButton={true}>
    <ModalContainer>{viewContext.getView()}</ModalContainer>
  </Modal>
}

const ModalContainer = styled.div`
  padding: 10px 20px 0px;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 10px 10px 0px;
  }
`
