import React, { FC } from 'react'
import { NextComponentType, NextPageContext } from 'next'
import { AppInitialProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'
import { UseEntityProvider, UsePoolProvider, UseProcessProvider } from '@vocdoni/react-hooks'
import { EthNetworkID, VocdoniEnvironment } from 'dvote-js'
import { ThemeProvider } from 'styled-components'
import 'react-circular-progressbar/dist/styles.css';


import { Layout } from '../components/layout'
import { UseMessageAlertProvider } from '../hooks/message-alert'
import { UseLoadingAlertProvider } from '../hooks/loading-alert'
import { UseWalletContextProvider } from '../hooks/use-wallet'
import { UseBackendProvider } from '../hooks/backend'

import { FixedGlobalStyle, theme } from '../theme'
import 'react-datetime/css/react-datetime.css'
import { UseBlockNumberProvider } from '../hooks/use-blocknumber'
import { UseVotingProvider } from '@hooks/use-voting'

type NextAppProps = AppInitialProps & {
  Component: NextComponentType<NextPageContext, any, any>
  router: Router
}

const VocdoniApp: FC<NextAppProps> = ({ Component, pageProps }) => {
  const bootnodeUri = process.env.BOOTNODES_URL
  const networkId = process.env.ETH_NETWORK_ID as EthNetworkID
  const environment = process.env.VOCDONI_ENVIRONMENT as VocdoniEnvironment
  const appTitle = process.env.APP_TITLE
  const commitSHA = process.env.COMMIT_SHA

  return (
    <ThemeProvider theme={theme}>
      <UseWalletContextProvider>
        <UseMessageAlertProvider>
          <UseLoadingAlertProvider>
            <UsePoolProvider
              bootnodeUri={bootnodeUri}
              networkId={networkId}
              environment={environment}
            >
              <UseBackendProvider>
                <UseBlockNumberProvider>
                  <UseProcessProvider>
                    <UseVotingProvider>
                      <UseEntityProvider>
                        <FixedGlobalStyle />
                        <Head>
                          <meta
                            name='viewport'
                            content='width=device-width, initial-scale=1.0, max-scale=1.0'
                          />
                          <title>{appTitle}</title>
                        </Head>
                        <Layout>
                          <Component {...pageProps} />
                        </Layout>
                        <div id='commit-sha' style={{ display: 'none' }}>
                          {commitSHA}
                        </div>
                      </UseEntityProvider>
                    </UseVotingProvider>
                  </UseProcessProvider>
                </UseBlockNumberProvider>
              </UseBackendProvider>
            </UsePoolProvider>
          </UseLoadingAlertProvider>
        </UseMessageAlertProvider>
      </UseWalletContextProvider>
    </ThemeProvider>
  )
}

export default VocdoniApp
