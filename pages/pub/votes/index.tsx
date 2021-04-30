import React from 'react'

import { useVoting } from '@hooks/use-voting'
import { useWallet, WalletRoles } from '@hooks/use-wallet'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { VOTING_AUTH_FORM_PATH } from '@const/routes'

import { Loader } from '@components/loader'
import { VotingPageView } from '@components/pub/votes'
import { Redirect } from '@components/redirect'

const VotingPage = () => {
  const { processInfo, processId } = useVoting()
  const { wallet } = useWallet({ role: WalletRoles.VOTER })

  const redirectToLoginPage = new ViewStrategy(
    () => !wallet,
    <Redirect to={`${VOTING_AUTH_FORM_PATH}#/${processId}`} />
  )

  const renderVotePage = new ViewStrategy(
    () => !!processInfo,
    <VotingPageView />
  )

  const renderLoaderPage = new ViewStrategy(() => true, <Loader visible />)

  const contextView = new ViewContext([
    redirectToLoginPage,
    renderVotePage,
    renderLoaderPage,
  ])

  return contextView.getView()
}

export default VotingPage
