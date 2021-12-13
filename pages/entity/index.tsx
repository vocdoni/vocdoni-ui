import React from 'react'
import { useBlockHeight, useEntity } from '@vocdoni/react-hooks'
import { useUrlHash } from 'use-url-hash'


import { ViewContext, ViewStrategy } from '@lib/strategy'

import { useProcessesFromAccount } from '@hooks/use-processes'

import { EntityView } from '@components/pages/entity/home'
import { Loader } from '@components/blocks/loader'


const EntityPage = () => {
  const entityId = useUrlHash().slice(1)
  const { metadata, loading } = useEntity(entityId)
  const { blockHeight } = useBlockHeight()
  const {
    processes,
    loadingProcessList,
    loadingProcessesDetails,
  } = useProcessesFromAccount(entityId)

  const renderEntityPage = new ViewStrategy(
    () => !!metadata && !loading && !loadingProcessList && !loadingProcessesDetails,
    <EntityView address={entityId} metadata={metadata} processes={processes} blockHeight={blockHeight}/>
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