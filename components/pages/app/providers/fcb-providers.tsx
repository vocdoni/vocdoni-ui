import React, { ReactNode } from 'react'
import {
  UseEntityProvider,
  UsePoolProvider,
  UseProcessProvider,
  UseBlockStatusProvider,
} from '@vocdoni/react-hooks'
import { EthNetworkID, VocdoniEnvironment } from 'dvote-js'

import { UseMessageAlertProvider } from '@hooks/message-alert'
import { UseLoadingAlertProvider } from '@hooks/loading-alert'
import { UseWalletContextProvider } from '@hooks/use-wallet'
import { UseVotingProvider } from '@hooks/use-voting'
import { UseDbAccountsProvider } from '@hooks/use-db-accounts'
import { UseCookiesProvider } from '@hooks/cookies'

import { PATH_WITHOUT_COOKIES } from '@const/routes'
import { UseProcessWrapperProvider } from '@hooks/use-process-wrapper'
import { CSPProvider } from '@hooks/use-csp-form'

interface IFCBProvidersProps {
  children: ReactNode
}

export const FCBProviders = ({ children }: IFCBProvidersProps) => {
  const bootnodeUri = process.env.BOOTNODES_URL
  const networkId = process.env.ETH_NETWORK_ID as EthNetworkID
  const environment = process.env.VOCDONI_ENVIRONMENT as VocdoniEnvironment
  const discoveryTimeout = Number(process.env.DISCOVERY_TIMEOUT)
  const discoveryPoolSize = Number(process.env.DISCOVERY_POOL_SIZE)

  return (
    <UseWalletContextProvider>
        <UseCookiesProvider hideInPaths={PATH_WITHOUT_COOKIES}>
          <UseMessageAlertProvider>
            <UseLoadingAlertProvider>
              <UsePoolProvider
                bootnodeUri={bootnodeUri}
                networkId={networkId}
                environment={environment}
                discoveryTimeout={discoveryTimeout}
                minNumGateways={discoveryPoolSize}
              >
                <UseBlockStatusProvider>
                    <UseProcessProvider>
                      <UseProcessWrapperProvider>
                        <UseVotingProvider>
                          <CSPProvider>
                            <UseEntityProvider>
                              <UseDbAccountsProvider>
                                {children}
                              </UseDbAccountsProvider>
                            </UseEntityProvider>
                          </CSPProvider>
                        </UseVotingProvider>
                      </UseProcessWrapperProvider>
                    </UseProcessProvider>
                </UseBlockStatusProvider>
              </UsePoolProvider>
            </UseLoadingAlertProvider>
          </UseMessageAlertProvider>
        </UseCookiesProvider>
    </UseWalletContextProvider>
  )
}
