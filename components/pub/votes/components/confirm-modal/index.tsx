import React from 'react'
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
  const { choices, processInfo, hasVoted, methods } = useVoting()

  const renderResponsesList = new ViewStrategy(
    () => !hasVoted,
    (
      <ModalQuestionList
        questions={processInfo.metadata.questions}
        choices={choices}
        onSubmit={methods.submitVote}
        sendingVote={false}
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

  return <Modal isOpen={isOpen} onRequestClose={onClose}>
    <ModalContainer>{viewContext.getView()}</ModalContainer>
  </Modal>
}

const ModalContainer = styled.div`
  padding: 10px 20px 0;
`
