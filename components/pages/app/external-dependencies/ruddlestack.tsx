import React, { useEffect } from 'react'
import { ANALYTICS_KEY } from '@const/env'
import { useRouter } from 'next/router'
import { useRudderStack } from '@hooks/rudderstack'

declare global {
  var rudderanalytics: {
    load: (key: string) => void
    page: () => void
    track: (event: string, properties?: object, callback?: Function) => void
  }
}

export const Ruddlestack = () => {
  const router = useRouter()
  const { trackPage } = useRudderStack()
  const scriptText = `rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}rudderanalytics.load("${ANALYTICS_KEY}","https://rudderstack.aragon.org"),rudderanalytics.page();`

  useEffect(() => {
    router.events.on('routeChangeStart', trackPage)

    return () => router.events.off('routeChangeStart', trackPage)
  }, [])

  return (
    <script dangerouslySetInnerHTML={{ __html: scriptText }}></script>
  )
}
