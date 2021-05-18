import React from 'react'
import { useVoting } from '@hooks/use-voting'
import { Loader } from '@components/loader'
import { VotingPageView } from '@components/pub/votes'
import { useUrlHash } from 'use-url-hash'

const VotingPage = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const { processInfo } = useVoting(processId)

  if (processInfo) return <VotingPageView />
  return <Loader visible />
}

export default VotingPage
