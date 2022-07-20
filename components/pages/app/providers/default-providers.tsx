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
import { UseRudderStackProvider } from '@hooks/rudderstack'
import { UseCookiesProvider } from '@hooks/cookies'

import { PATH_WITHOUT_COOKIES, PATHS_WITH_ADOBE_ANALYTICS } from '@const/routes'
import { UseProcessWrapperProvider } from '@hooks/use-process-wrapper'
import { CSPProvider } from '@hooks/use-csp-form'
import { UseAdobeAnalyticsProvider } from '@hooks/adobe-analytics'

interface IDefaultProvidersProps {
  children: ReactNode
}

export const DefaultProviders = ({ children }: IDefaultProvidersProps) => {
  const bootnodeUri = (process.env.BOOTNODES_URL.includes(",") ? process.env.BOOTNODES_URL.split(",") : process.env.BOOTNODES_URL)
  const networkId = process.env.ETH_NETWORK_ID as EthNetworkID
  const environment = process.env.VOCDONI_ENVIRONMENT as VocdoniEnvironment
  const discoveryTimeout = Number(process.env.DISCOVERY_TIMEOUT)
  const discoveryPoolSize = Number(process.env.DISCOVERY_POOL_SIZE)

  return (
    <UseWalletContextProvider>
      <UseAdobeAnalyticsProvider paths={PATHS_WITH_ADOBE_ANALYTICS}>
        <UseCookiesProvider hideInPaths={PATH_WITHOUT_COOKIES}>
          <UseMessageAlertProvider>
            <UseLoadingAlertProvider>
              <UseRudderStackProvider>
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
                        <CSPProvider>
                          <UseVotingProvider>
                            <UseEntityProvider>
                              <UseDbAccountsProvider>
                                {children}
                              </UseDbAccountsProvider>
                            </UseEntityProvider>
                          </UseVotingProvider>
                        </CSPProvider>
                      </UseProcessWrapperProvider>
                    </UseProcessProvider>
                  </UseBlockStatusProvider>
                </UsePoolProvider>
              </UseRudderStackProvider>
            </UseLoadingAlertProvider>
          </UseMessageAlertProvider>
        </UseCookiesProvider>
      </UseAdobeAnalyticsProvider>
    </UseWalletContextProvider>
  )
}
