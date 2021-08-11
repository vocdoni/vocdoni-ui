import React, { useEffect } from 'react'
import { ANALYTICS_KEY } from '@const/env'
import { useRouter } from 'next/router'

declare global {
  var rudderanalytics: {
    load: (key: string) => void
    page: () => void
  }
}


export const Ruddlestack = () => {
  const router = useRouter()
  const scriptText = `rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}rudderanalytics.load("${ANALYTICS_KEY}","https://rudderstack.aragon.org"),rudderanalytics.page();`
  
  useEffect(() => {
    const handleRouteChange = () => {
      rudderanalytics.page()
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [])
  
  return (
    <script dangerouslySetInnerHTML={{ __html: scriptText }}></script>
  )
}