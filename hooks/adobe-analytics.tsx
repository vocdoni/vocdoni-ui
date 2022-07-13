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
  memberId: string,
  methods?: {
    setMemeberId: (value: string) => void
    load: () => void
    trackPage: (path: string) => void
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
  paths: string[]
}

const pathMap = {
  "/pub/votes/auth/indexer": "/inici-login",
}

export const UseAdobeAnalyticsProvider = ({
  children, paths
}: IUseUseAdobeAnalyticsProvider) => {
  const [memberId, setMemeberId] = useState('')
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
    if (!document.getElementById("adobe-script")) {
      const adoobeScript = document.createElement('script')
      adoobeScript.src = process.env.ADOBE_ANALYTICS_SCRIPT
      adoobeScript.async = true
      adoobeScript.id = "adobe-script"
      document.head.appendChild(adoobeScript)
    }
  }

  const trackPage = (path: string) => {
    const trigger = document
      .createRange()
      .createContextualFragment(triggerTrackingScript(path))
    document.head.appendChild(trigger)
  }


  const generateVirtualPage = () => {
    console
    return `
    <script id="virtual-page">
		  function virtualPage(path) {
		    fcbDL.contingut.pageName = path;
		    _satellite.track('scVPage');
		  }
    </script>
    `
  }
  const triggerTrackingScript = (path: string) => {
    console
    return `
    <script>
      virtualPage("${path}");
    </script>
    `
  }

  const generateFcbDl = () => {
    return `
    <script id="fcb-dl">
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
        pageName: "${path}"
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
      trackPage
    }
  }

  return (
    <UseAdobeAnalyticsContext.Provider value={value}>
      {children}
    </UseAdobeAnalyticsContext.Provider>
  )
}
