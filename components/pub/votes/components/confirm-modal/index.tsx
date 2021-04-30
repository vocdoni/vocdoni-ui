import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal } from 'react-rainbow-components'

import { useVoting } from '@hooks/use-voting'
import { ViewContext, ViewStrategy } from '@lib/strategy'

import { ModalQuestionList } from './questions-list'
import { VoteSubmitted } from './vote-submitted'

interface IConfigModal {
  isOpen: boolean
  onClose: () => void
}

export const ConfirmModal = ({ isOpen, onClose }: IConfigModal) => {
  const [sendingVote, setSendingVote] = useState<boolean>(false)
  const { choices, processInfo, hasVoted, methods } = useVoting()
  const handleSendVote = () => {
    setSendingVote(true)
    methods.submitVote()
  }

  const renderResponsesList = new ViewStrategy(
    () => !hasVoted,
    (
      <ModalQuestionList
        questions={processInfo.metadata.questions}
        choices={choices}
        onSubmit={handleSendVote}
        sendingVote={sendingVote}
        onClose={onClose}
      />
    )
  )

  const renderVoteSubmitted = new ViewStrategy(
    () => hasVoted,
    <VoteSubmitted />
  )

  const viewContext = new ViewContext([
    renderResponsesList,
    renderVoteSubmitted,
  ])

  return <Modal isOpen={isOpen} onRequestClose={onClose} hideCloseButton={true}>
    <ModalContainer>{viewContext.getView()}</ModalContainer>
  </Modal>
}

const ModalContainer = styled.div`
  padding: 10px 20px 10px;
`
