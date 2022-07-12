import React, {
  ReactNode,
  useEffect,
  createContext,
  useContext,
  useState,
} from 'react'
import { COOKIES_PATH, VOTING_PATH } from '@const/routes'
import { useRouter } from 'next/router'

import { useHelpCenter } from './help-center'
import { useRudderStack } from '@hooks/rudderstack'
import { useTranslation } from 'react-i18next'
import { useCookies } from './cookies'
import { useIsMobile } from './use-window-size'

const COOKIES_STORE_KEY = 'cookies-acceptance'

interface IUseAdobeAnalyticsContext {
  memberId: string,
  methods?: {
    setMemeberId: (value: string) => void
    load: () => void
  }
}

const UseAdobeAnalyticsContext = createContext<IUseAdobeAnalyticsContext>({
  memberId: ""
})

export function useAdobeAnalytics() {
  const adobeAnalyticsContext = useContext(UseAdobeAnalyticsContext)
  if (adobeAnalyticsContext === null) {
    throw new Error(
      'useAdobeAnalytics() can only be used on the descendants of <UseAdobeAnalyticsProvider />, ' +
      'please declare it at a higher level.'
    )
  }
  return adobeAnalyticsContext
}

interface IUseUseAdobeAnalyticsProvider {
  children: ReactNode
}

export const UseAdobeAnalyticsProvider = ({
  children,
}: IUseUseAdobeAnalyticsProvider) => {
  const [memberId, setMemeberId] = useState("")
  const { i18n } = useTranslation()
  const router = useRouter()
  const isMobile = useIsMobile()

  const load = () => {
    const dlScript = document
      .createRange()
      .createContextualFragment(generateDl())
    document.head.appendChild(dlScript)
    const adoobeScript = document.createElement('script')
    adoobeScript.src = process.env.ADOBE_ANALYTICS_SCRIPT
    adoobeScript.async = true
    document.head.appendChild(adoobeScript)
  }

  const generateDl = () => {
    return `
    <script>
    var fcbDL = fcbDL || {}
    fcbDL = {
      usuari:{
        ${memberId ?
        `tipusUsuari:"soci",
          idUsuari: "soci-${memberId}` :
        `tipusUsuari:"general"`
      }
      },
      contingut:{
        idioma: "${i18n.language}",
        canal: "${isMobile ? "mobile" : "desktop"}",
        error404: "FALSE",
        error500: "FALSE",
        URL: "${window.location.href}",
        pageName: "${router.pathname}"
      }
    };
    </script>
    `
  }

  const value = {
    memberId,
    methods: {
      setMemeberId,
      load,
    }
  }

  return (
    <UseAdobeAnalyticsContext.Provider
      value={value}
    >
      {children}
    </UseAdobeAnalyticsContext.Provider>
  )
}
