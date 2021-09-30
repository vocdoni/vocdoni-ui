import React, { useEffect } from 'react'
import { ANALYTICS_KEY } from '@const/env'
import { useRouter } from 'next/router'

declare global {
  var rudderanalytics: {
    load: (key: string) => void
    page: () => void
    track: (event: string, properties?: object, callback?: Function) => void
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

export const ruddlestackTrackCreationButtonClicked = () => {
  rudderanalytics.track(
    "entityCreation_button_clicked",
  );
}

export const ruddlestackTrackSignInButtonClicked = () => {
  rudderanalytics.track(
    "login_button_clicked",
  );
}

export const ruddlestackTrackEntityCreationWizardButtonClicked = (step, name, type, size) => {
  rudderanalytics.track(
    "entityCreationWizard_button_clicked",
    {
      step, name, type, size
    }
  );
}

export const ruddlestackTrackEntityCreated = (address) => {
  rudderanalytics.track(
    "entity_created",
    {
      address
    }
  );
}

export const ruddlestackTrackProcessCreationButtonClicked = (entity) => {
  rudderanalytics.track(
    "processCreation_button_clicked",
    {
      entity
    }
  );
}

export const ruddlestackTrackProcessCreationWizardButtonClicked = (step) => {
  rudderanalytics.track(
    "processCreationWizard_button_clicked",
    {
      step
    }
  );
}

export const ruddlestackTrackProcessCreated = (entity, title, id) => {
  rudderanalytics.track(
    "process_created",
    {
      entity, title, id
    }
  );
}
