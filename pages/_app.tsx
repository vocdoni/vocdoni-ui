import React, { FC } from 'react'
import { RecoilRoot } from "recoil";

import { NextComponentType, NextPageContext } from 'next'
import { AppInitialProps } from 'next/app'

import Head from 'next/head'
import { Router } from 'next/router'

import { ThemeProvider } from 'styled-components'
import 'react-circular-progressbar/dist/styles.css';

import { DefaultLayout } from '@components/pages/app/layout/default'
import { DefaultProviders } from '@components/pages/app/providers/default-providers'

import { ANALYTICS_KEY } from '@const/env'
import { FixedGlobalStyle, theme } from '../theme'
import 'react-datetime/css/react-datetime.css'

import { Helpscout } from '@components/pages/app/external-dependencies/helpscout'
import { Ruddlestack } from '@components/pages/app/external-dependencies/ruddlestack';
import { CookiesBanner } from '@components/blocks/cookies-banner'

type NextAppProps = AppInitialProps & {
  Component: NextComponentType<NextPageContext, any, any>
  router: Router
}

const VocdoniApp: FC<NextAppProps> = ({ Component, pageProps }) => {
  const appTitle = process.env.APP_TITLE
  const commitSHA = process.env.COMMIT_SHA

  // If the current page component defined a custom layout, use it
  const Layout: FC = Component["Layout"] ? Component["Layout"] : DefaultLayout
  const Providers: FC = Component["Providers"] ? Component["Providers"] : DefaultProviders

  return (
    <RecoilRoot>

        <ThemeProvider theme={theme}>
          <Providers>
            <FixedGlobalStyle />
            { ANALYTICS_KEY && <Ruddlestack />}

            <Head>
              <meta
                name='viewport'
                content='width=device-width, initial-scale=1.0, max-scale=1.0'
              />
              <link rel="icon" type="image/ico" href="/images/common/favicon.ico" sizes="16x16" />
              <Helpscout />
              <title>{appTitle}</title>
            </Head>

            <Layout>
              <Component {...pageProps} />
            </Layout>
            { ANALYTICS_KEY && <script src="https://cdn.rudderlabs.com/v1/rudder-analytics.min.js"></script>}

            <div id='commit-sha' style={{ display: 'none' }}>
              {commitSHA}
            </div>
            <CookiesBanner />
          </Providers>
        </ThemeProvider>

    </RecoilRoot>
  )
}

export default VocdoniApp