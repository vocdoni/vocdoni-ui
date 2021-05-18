import React from 'react'
import { Loader } from '@components/loader'
import { VotingPageView } from '@components/pub/votes'
import { useUrlHash } from 'use-url-hash'
import { VotingErrorPage } from '@components/pub/votes/auth/form/voting-error-page'
import { useProcess } from '@vocdoni/react-hooks'

const VotingPage = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const { process, error, loading } = useProcess(processId)

  if (process) return <VotingPageView />
  else if (error) return <VotingErrorPage
    message={error}
  />
  return <Loader visible />
}

export default VotingPage
