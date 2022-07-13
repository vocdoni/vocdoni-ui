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

const COOKIES_STORE_KEY = 'cookies-acceptance'

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
  "/pub/votes/auth/indexer": "/home",
  "/pub/votes": "/seleccio-candidat"
}

export const UseAdobeAnalyticsProvider = ({
  children, paths
}: IUseUseAdobeAnalyticsProvider) => {
  const [memberId, setMemeberId] = useState("")
  const { i18n } = useTranslation()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [path, setPath] = useState("")

  useEffect(() => {
    setPath(pathMap[router.pathname] ? pathMap[router.pathname] : router.pathname)
  }, [router.pathname])

  const load = () => {
    if (!paths.includes(router.pathname)) return
    const dlScript = document
      .createRange()
      .createContextualFragment(generateDl())

    const trackScript = document
      .createRange()
      .createContextualFragment(generateTrackScript())

    document.head.appendChild(trackScript)
    document.head.appendChild(dlScript)
    const adoobeScript = document.createElement('script')
    adoobeScript.src = process.env.ADOBE_ANALYTICS_SCRIPT
    adoobeScript.async = true
    document.head.appendChild(adoobeScript)
  }

  const trackPage = (path:string) => {
    const trigger = document
      .createRange()
      .createContextualFragment(triggerTrackingScript(path))
    document.head.appendChild(trigger)
  }


  const generateTrackScript = () => {
    console
    return `
    <script>
		  function virtualPage(path) {
		    fcbDL.contingut.pageName = path;
		    _satellite.track('scVPage');
		  }
    </script>
    `
  }
  const triggerTrackingScript = (path:string) => {
    console
    return `
    <script>
      virtualPage("${path}")
    </script>
    `
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
