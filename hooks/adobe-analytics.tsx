import React, {
  ReactNode,
  useEffect,
  createContext,
  useContext,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'react-i18next'
import { useIsMobile } from './use-window-size'

interface IUseAdobeAnalyticsContext {
  methods?: {
    load: () => void
    trackPage: (path: string, url: string) => void
    setUserId: (userId: string) => void
  }
}

const UseAdobeAnalyticsContext = createContext<IUseAdobeAnalyticsContext>({})

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
  paths: string[]
}

const pathMap = {
  "/pub/votes/auth/indexer": "/inici-login",
}

export const UseAdobeAnalyticsProvider = ({
  children, paths
}: IUseUseAdobeAnalyticsProvider) => {
  const { i18n } = useTranslation()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [path, setPath] = useState('')

  useEffect(() => {
    setPath(pathMap[router.pathname] ? pathMap[router.pathname] : router.pathname)
  }, [router.pathname])

  const load = () => {
    if (!paths.includes(router.pathname)) return
    if (!document.getElementById('virtual-page')) {
      const virtualPage = document
        .createRange()
        .createContextualFragment(generateVirtualPage())
      document.head.appendChild(virtualPage)
    }
    if (!document.getElementById('fcb-dl')) {
      const fcbDl = document
        .createRange()
        .createContextualFragment(generateFcbDl())
      document.head.appendChild(fcbDl)
    }
    if (!document.getElementById('set-user')) {
      const setUser = document
        .createRange()
        .createContextualFragment(setUserScript())
      document.head.appendChild(setUser)
    }
    if (!document.getElementById("adobe-script")) {
      const adoobeScript = document.createElement('script')
      adoobeScript.src = process.env.ADOBE_ANALYTICS_SCRIPT
      adoobeScript.async = true
      adoobeScript.id = "adobe-script"
      adoobeScript.onerror = () => {
        console.warn('error loading adobe script')
      }
      document.head.appendChild(adoobeScript)
    }
  }

  const trackPage = (path: string, url: string) => {
    const trigger = document
      .createRange()
      .createContextualFragment(triggerTrackingScript(path, url))
    document.head.appendChild(trigger)
  }

  const setUserId = (path: string) => {
    const setUser = document
      .createRange()
      .createContextualFragment(triggerSetUser(path))
    document.head.appendChild(setUser)
  }

  const generateVirtualPage = () => {
    return `
    <script id="virtual-page" onerror="()=>console.warn('error')">
		  function virtualPage(path, url) {
		    fcbDL.contingut.pageName = path;
        fcbDL.contingut.URL = url;
		    _satellite.track('scVPage');
		  }
    </script>
    `
  }

  const setUserScript = () => {
    return `
    <script id="set-user" onerror="()=>console.warn('error')">
		  function setUser(userId) {
        if (userId === "general") {
          fcbDL.usuari = {
            tipusUsuari:"general"
          };
        } else {
          fcbDL.usuari = {
            tipusUsuari:"soci",
            idUsuari: "soci-" + userId
          }
        }
		  }
    </script>
    `
  }

  const triggerTrackingScript = (path: string, url: string) => {
    return `
    <script onerror="()=>console.warn('error')">
      virtualPage("${path}", "${url}");
    </script>
    `
  }

  const triggerSetUser = (userId: string) => {
    return `
    <script onerror="()=>console.warn('error')">
      setUser("${userId}");
    </script>
    `
  }

  const generateFcbDl = () => {
    return `
    <script id="fcb-dl" onerror="()=>console.warn('error')">
    var fcbDL = fcbDL || {}
    fcbDL = {
      usuari:{
        tipusUsuari:"general"
      },
      contingut:{
        idioma: "${i18n.language}",
        canal: "${isMobile ? "mobile" : "desktop"}",
        error404: "FALSE",
        error500: "FALSE",
        URL: "${window.location.href}",
        pageName: "${path}"
      }
    };
    </script>
    `
  }

  const value = {
    methods: {
      setUserId,
      load,
      trackPage
    }
  }

  return (
    <UseAdobeAnalyticsContext.Provider value={value}>
      {children}
    </UseAdobeAnalyticsContext.Provider>
  )
}
