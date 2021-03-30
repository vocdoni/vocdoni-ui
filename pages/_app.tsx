import React, { FC } from 'react';
import { NextComponentType, NextPageContext } from 'next';
import { AppInitialProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';
import { UsePoolProvider, UseProcessProvider } from '@vocdoni/react-hooks';
import { EthNetworkID, VocdoniEnvironment } from 'dvote-js';
import { ThemeProvider } from 'styled-components';

import { Layout } from '../components/layout';
import { UseMessageAlertProvider } from '../hooks/message-alert';
import { UseLoadingAlertProvider } from '../hooks/loading-alert';

import { FixedGlobalStyle, theme } from '../theme';
import 'react-datetime/css/react-datetime.css';

type NextAppProps = AppInitialProps & {
  Component: NextComponentType<NextPageContext, any, any>
  router: Router
}

const VocdoniApp: FC<NextAppProps> = ({ Component, pageProps }) => {
  const bootnodeUri = process.env.BOOTNODES_URL
  const networkId = process.env.ETH_NETWORK_ID as EthNetworkID
  const environment = process.env.VOCDONI_ENVIRONMENT as VocdoniEnvironment
  const appTitle = process.env.APP_TITLE

  return (
  <ThemeProvider theme={theme}>
    <UseMessageAlertProvider>
    <UseLoadingAlertProvider>
      <UsePoolProvider
      bootnodeUri={bootnodeUri}
      networkId={networkId}
      environment={environment}
      >
      <UseProcessProvider>
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
      </UseProcessProvider>
      </UsePoolProvider>
    </UseLoadingAlertProvider>
    </UseMessageAlertProvider>
  </ThemeProvider>
  )
}

export default VocdoniApp
