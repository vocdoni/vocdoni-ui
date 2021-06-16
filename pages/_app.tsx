import React, { FC } from 'react'
import { NextComponentType, NextPageContext } from 'next'
import { AppInitialProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'
import { UseEntityProvider, UsePoolProvider, UseProcessProvider, UseBlockStatusProvider } from '@vocdoni/react-hooks'
import { EthNetworkID, VocdoniEnvironment } from 'dvote-js'
import { ThemeProvider } from 'styled-components'
import 'react-circular-progressbar/dist/styles.css';

import { DefaultLayout } from '../components/layout/default'
import { UseMessageAlertProvider } from '../hooks/message-alert'
import { UseLoadingAlertProvider } from '../hooks/loading-alert'
import { UseWalletContextProvider } from '../hooks/use-wallet'
import { UseBackendProvider } from '../hooks/backend'

import { FixedGlobalStyle, theme } from '../theme'
import 'react-datetime/css/react-datetime.css'
import { UseVotingProvider } from '@hooks/use-voting'
import { UseDbAccountsProvider } from '@hooks/use-db-accounts'
import { Helpscout } from '@components/external-dependencies/helpscout'
import { CookiesBanner } from '@components/common/cookies-banner'

type NextAppProps = AppInitialProps & {
  Component: NextComponentType<NextPageContext, any, any>
  router: Router
}

const VocdoniApp: FC<NextAppProps> = ({ Component, pageProps }) => {
  const bootnodeUri = process.env.BOOTNODES_URL
  const networkId = process.env.ETH_NETWORK_ID as EthNetworkID
  const environment = process.env.VOCDONI_ENVIRONMENT as VocdoniEnvironment
  const commitSHA = process.env.COMMIT_SHA
  const discoveryTimeout = Number(process.env.DISCOVERY_TIMEOUT)
  const discoveryPoolSize = Number(process.env.DISCOVERY_POOL_SIZE)

  // If the current page component defined a custom layout, use it
  const Layout: FC = Component["Layout"] ? Component["Layout"] : DefaultLayout

  return (
    <ThemeProvider theme={theme}>
      <UseWalletContextProvider>
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
                <UseBackendProvider>
                  <UseProcessProvider>
                    <UseVotingProvider>
                      <UseEntityProvider>
                        <UseDbAccountsProvider>
                          <FixedGlobalStyle />
                          <Head>
                            <meta
                              name='viewport'
                              content='width=device-width, initial-scale=1.0, max-scale=1.0'
                            />
                            <link rel="icon" type="image/png" href="/images/common/favicon.png" sizes="32x32" />

                            <Helpscout />
                            <title>Òmnium Cultural</title>
                          </Head>
                          <Layout>
                            <Component {...pageProps} />
                          </Layout>
                          <div id='commit-sha' style={{ display: 'none' }}>
                            {commitSHA}
                          </div>
                          <CookiesBanner />
                        </UseDbAccountsProvider>
                      </UseEntityProvider>
                    </UseVotingProvider>
                  </UseProcessProvider>
                </UseBackendProvider>
              </UseBlockStatusProvider>
            </UsePoolProvider>
          </UseLoadingAlertProvider>
        </UseMessageAlertProvider>
      </UseWalletContextProvider>
    </ThemeProvider>
  )
}

export default VocdoniApp
