import React from 'react'
import { Loader } from '@components/loader'
import { VotingPageView } from '@components/pub/votes'
import { useUrlHash } from 'use-url-hash'
import { VotingErrorPage } from '@components/pub/votes/voting-error-page'
import { useProcess } from '@vocdoni/react-hooks'
import { LayoutVoter } from '@components/layout/voter'

// NOTE: This page uses a custom Layout. See below.

const VotingPage = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const { process, error, loading } = useProcess(processId)

  if (process) return <VotingPageView />
  else if (error) return <VotingErrorPage
    message={error}
  />
  return <Loader visible />
}

// Defining the custom layout to use
VotingPage["Layout"] = LayoutVoter

export default VotingPage
