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
import { FCBProviders } from '@components/pages/app/providers/fcb-providers'
import { CookiesBanner } from '@components/blocks/cookies-banner'
import { useTranslation } from 'react-i18next'

type NextAppProps = AppInitialProps & {
  Component: NextComponentType<NextPageContext, any, any>
  router: Router
}

const VocdoniApp: FC<NextAppProps> = ({ Component, pageProps }) => {
  const { i18n } = useTranslation()
  const appFullTitle = 'FC Barcelona' + ' - ' + i18n.t('fcb.process_title')
  const appImage = 'https://vocdoni.app/images/home/section-1/computer-device.png'
  const commitSHA = process.env.COMMIT_SHA

  // If the current page component defined a custom layout, use it
  const Layout: FC = Component['Layout'] ? Component['Layout'] : DefaultLayout
  const Providers: FC = Component['Providers']
    ? Component['Providers']
    : FCBProviders

  return (
    <RecoilRoot>
      <ThemeContextProvider>
        <Providers>
          <FixedGlobalStyle />

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
              type="image/ico"
              href="/images/common/favicon.ico"
              sizes="16x16"
            />

            <link rel="apple-touch-icon" sizes="120x120" href="/images/common/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/common/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/images/common/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/images/common/safari-pinned-tab.svg" color="#5bbad5" />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff" />

            <title>{appFullTitle}</title>
          </Head>

          <Layout>
            <Component {...pageProps} />
          </Layout>

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
