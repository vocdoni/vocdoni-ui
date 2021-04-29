import React from 'react'
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
  const { choices, processInfo, hasVoted } = useVoting()

  const renderResponsesList = new ViewStrategy(
    () => !hasVoted,
    (
      <ModalQuestionList
        questions={processInfo.metadata.questions}
        choices={choices}
        onSubmit={() => console.log('submiting data')}
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

  return <Modal isOpen={isOpen}>{viewContext.getView()}</Modal>
}
