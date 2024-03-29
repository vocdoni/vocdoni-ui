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
import { UseBackendProvider } from '@hooks/backend'
import { UseVotingProvider } from '@hooks/use-voting'
import { UseDbAccountsProvider } from '@hooks/use-db-accounts'
import { UseDbVotersProvider } from '@hooks/use-db-voters'
import { UseRudderStackProvider } from '@hooks/rudderstack'
import { UseCookiesProvider } from '@hooks/cookies'

import { PATH_WITHOUT_COOKIES } from '@const/routes'
import { UseProcessWrapperProvider } from '@hooks/use-process-wrapper'

interface IDefaultProvidersProps {
  children: ReactNode
}

export const DefaultProviders = ({ children }: IDefaultProvidersProps) => {
  const bootnodeUri = process.env.BOOTNODES_URL
  const networkId = process.env.ETH_NETWORK_ID as EthNetworkID
  const environment = process.env.VOCDONI_ENVIRONMENT as VocdoniEnvironment
  const discoveryTimeout = Number(process.env.DISCOVERY_TIMEOUT)
  const discoveryPoolSize = Number(process.env.DISCOVERY_POOL_SIZE)
  const archiveIpnsId = process.env.ARCHIVE_IPNS_ID

  return (
    <UseWalletContextProvider>
      <UseRudderStackProvider>
        <UseCookiesProvider hideInPaths={PATH_WITHOUT_COOKIES}>
          <UseMessageAlertProvider>
            <UseLoadingAlertProvider>
              <UsePoolProvider
                bootnodeUri={bootnodeUri}
                networkId={networkId}
                environment={environment}
                discoveryTimeout={discoveryTimeout}
                minNumGateways={discoveryPoolSize}
                archiveIpnsId={archiveIpnsId}
              >
                <UseBlockStatusProvider>
                  <UseBackendProvider>
                    <UseProcessProvider>
                      <UseProcessWrapperProvider>
                        <UseDbVotersProvider>
                          <UseVotingProvider>
                            <UseEntityProvider>
                              <UseDbAccountsProvider>

                                {children}
                              </UseDbAccountsProvider>
                            </UseEntityProvider>
                          </UseVotingProvider>
                        </UseDbVotersProvider>
                      </UseProcessWrapperProvider>
                    </UseProcessProvider>
                  </UseBackendProvider>
                </UseBlockStatusProvider>
              </UsePoolProvider>
            </UseLoadingAlertProvider>
          </UseMessageAlertProvider>
        </UseCookiesProvider>
      </UseRudderStackProvider>
    </UseWalletContextProvider>
  )
}
