import React from 'react'
import { useVoting } from '@hooks/use-voting'
import { Loader } from '@components/loader'
import { VotingPageView } from '@components/pub/votes'

const VotingPage = () => {
  const { processInfo } = useVoting()

  if (processInfo) return <VotingPageView />
  return <Loader visible />
}

export default VotingPage
