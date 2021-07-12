import React from 'react'
import { useEntity } from '@vocdoni/react-hooks'
import { useUrlHash } from 'use-url-hash'


import { ViewContext, ViewStrategy } from '@lib/strategy'

import { EntityView } from '@components/pages/entity/home'
import { Loader } from '@components/blocks/loader'


const EntityPage = () => {
  const entityId = useUrlHash().slice(1)
  const { metadata, loading } = useEntity(entityId)

  console.log(entityId)
  const renderEntityPage = new ViewStrategy(
    () => !!metadata && !loading,
    <EntityView address={entityId} metadata={metadata}/>
  )
  const renderLoadingPage = new ViewStrategy(
    () => true,
    <Loader visible />
  )

  const viewContext = new ViewContext([
    renderEntityPage,
    renderLoadingPage
  ])

  return viewContext.getView()
}

export default EntityPage