import React, { FC } from 'react'
import { NextComponentType, NextPageContext } from 'next'
import { AppInitialProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'

import { ThemeProvider } from 'styled-components'
import 'react-circular-progressbar/dist/styles.css';

import { DefaultLayout } from '@components/pages/app/layout/default'
import { DefaultProviders } from '@components/pages/app/providers/default-providers'

import { FixedGlobalStyle, theme } from '../theme'
import 'react-datetime/css/react-datetime.css'

import { Helpscout } from '@components/pages/app/external-dependencies/helpscout'
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
  if(!!Component["Providers"]) {
    console.log('these no has default providers')
  }
  return (
    <ThemeProvider theme={theme}>
      <Providers>
        <FixedGlobalStyle />
        
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

        <div id='commit-sha' style={{ display: 'none' }}>
          {commitSHA}
        </div>
        <CookiesBanner />
      </Providers>
    </ThemeProvider>
  )
}

export default VocdoniApp