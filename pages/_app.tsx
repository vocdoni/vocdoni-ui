import React, { FC } from 'react'
import { RecoilRoot } from 'recoil'

import { NextComponentType, NextPageContext } from 'next'
import { AppInitialProps } from 'next/app'

import Head from 'next/head'
import { Router } from 'next/router'

import 'react-circular-progressbar/dist/styles.css'
import 'react-datetime/css/react-datetime.css'

import { ThemeContextProvider } from '@hooks/use-theme';

import { ANALYTICS_KEY } from '@const/env'
import { FixedGlobalStyle, theme } from '../theme'

import { DefaultLayout } from '@components/pages/app/layout/default'
import { DefaultProviders } from '@components/pages/app/providers/default-providers'
import { Helpscout } from '@components/pages/app/external-dependencies/helpscout'
import { Ruddlestack } from '@components/pages/app/external-dependencies/ruddlestack'
import { CookiesBanner } from '@components/blocks/cookies-banner'
import { useTranslation } from 'react-i18next'

type NextAppProps = AppInitialProps & {
  Component: NextComponentType<NextPageContext, any, any>
  router: Router
}

const VocdoniApp: FC<NextAppProps> = ({ Component, pageProps }) => {
  const { i18n } = useTranslation()
  const appFullTitle = process.env.APP_TITLE + ' - ' + i18n.t('app.meta.title')
  const appImage = 'https://vocdoni.app/images/home/section-1/computer-device.png'
  const commitSHA = process.env.COMMIT_SHA

  // If the current page component defined a custom layout, use it
  const Layout: FC = Component['Layout'] ? Component['Layout'] : DefaultLayout
  const Providers: FC = Component['Providers']
    ? Component['Providers']
    : DefaultProviders

  return (
    <RecoilRoot>
      <ThemeContextProvider>
        <Providers>
          <FixedGlobalStyle />
          {ANALYTICS_KEY && <Ruddlestack />}

          <Head>
            <meta name="description" content={i18n.t('app.meta.description')} />
            <meta name="keywords" content={i18n.t('app.meta.keywords')} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, max-scale=1.0"
            />
            <meta property="og:title" content={i18n.t('app.meta.title')} />
            <meta
              property="og:description"
              content={i18n.t('app.meta.description')}
            />
            <meta property="og:image" content={appImage} />
            <meta name="twitter:card" content="summary_large_image" />
            <link
              rel="icon"
              type="image/png"
              href="/images/common/favicon.png"
              sizes="32x32"
            />
            <Helpscout />
            <title>Bellpuig</title>
          </Head>

          <Layout>
            <Component {...pageProps} />
          </Layout>
          {ANALYTICS_KEY && (
            <script src="https://cdn.rudderlabs.com/v1/rudder-analytics.min.js"></script>
          )}

          <div id="commit-sha" style={{ display: 'none' }}>
            {commitSHA}
          </div>
          <CookiesBanner />
        </Providers>
      </ThemeContextProvider>
    </RecoilRoot>
  )
}

export default VocdoniApp
