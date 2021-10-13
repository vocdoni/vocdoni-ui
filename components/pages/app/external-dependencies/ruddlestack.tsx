import { ANALYTICS_KEY } from '@const/env'

declare global {
  var rudderanalytics: {
    load: (key: string) => void
    page: () => void
    track: (event: string, properties?: object, callback?: Function) => void
  }
}

export const Ruddlestack = () => {
  const scriptText = `rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}rudderanalytics.load("${ANALYTICS_KEY}","https://rudderstack.aragon.org"),rudderanalytics.page();`

  return (
    <script dangerouslySetInnerHTML={{ __html: scriptText }}></script>
  )
}
