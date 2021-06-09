import React, { useState } from 'react'
import styled from 'styled-components'
import Modal  from 'react-rainbow-components/components/Modal'

import { useVoting } from '@hooks/use-voting'
import { ViewContext, ViewStrategy } from '@lib/strategy'

import { ModalQuestionList } from './questions-list'
import { VoteSubmitted } from './vote-submitted'
import { useUrlHash } from 'use-url-hash'
import { useProcess } from '@vocdoni/react-hooks'

interface IConfigModal {
  isOpen: boolean
  onClose: () => void
}

export const ConfirmModal = ({ isOpen, onClose }: IConfigModal) => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const { process: processInfo } = useProcess(processId)
  const { choices, hasVoted, methods, pleaseWait, actionError } = useVoting(processId)
  const handleSendVote = () => {
    methods.submitVote()
  }

  const renderResponsesList = new ViewStrategy(
    () => !hasVoted,
    (
      <ModalQuestionList
        questions={processInfo?.metadata?.questions}
        choices={choices}
        onSubmit={handleSendVote}
        sendingVote={pleaseWait}
        onClose={onClose}
      />
    )
  )

  const renderVoteSubmitted = new ViewStrategy(
    () => hasVoted,
    <VoteSubmitted onAccept={onClose} />
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
