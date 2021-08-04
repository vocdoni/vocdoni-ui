import React from 'react'
import { EntityMetadata } from 'dvote-js'

import { useEntity, usePool } from '@vocdoni/react-hooks'

import {  useRecoilStateLoadable } from 'recoil'
import { entityRegistryState, IEntityRegistryState } from 'recoil/atoms/entity-registry'

import { ViewContext, ViewStrategy } from '@lib/strategy'
import { uploadFileToIpfs } from '@lib/file'

import { EntityEditView, IEntityData, UpdatedDataType } from '@components/pages/entity/edit'
import { Loader } from '@components/blocks/loader'
import { Redirect } from '@components/redirect'

import { useWallet } from '@hooks/use-wallet'
import { useDbAccounts } from '@hooks/use-db-accounts'
import { useBackend } from '@hooks/backend'

import { ENTITY_SIGN_IN_PATH } from '@const/routes'
import { UpdateEntityDataError } from '@lib/validators/errors/update-entity-data-error'
import { EntityNameAlreadyExistError } from '@lib/validators/errors/entity-name-already-exits-error'
import { StoreMediaError } from '@lib/validators/errors/store-media-error'
import { StoringDataOnBlockchainError } from '@lib/validators/errors/storing-data-on-blockchain-error'



const EntityEditPage = () => {
  const { wallet } = useWallet()
  const { metadata, loading, updateMetadata } = useEntity(wallet?.address)
  const { getAccount, updateAccount } = useDbAccounts()
  const { poolPromise } = usePool()
  const { bk } = useBackend()

  const [loadableRegistry, setEntityRegistry] = useRecoilStateLoadable<IEntityRegistryState>(entityRegistryState);

  const updateEntityRegistry = async (registryData: IEntityRegistryState) => {
    const account = getAccount(wallet.address)
    const oldName = account.name

    account.name = registryData.name
    
    try {
      await updateAccount(account)
    } catch (error) {
      throw new EntityNameAlreadyExistError()
    }

    try {
      await bk.sendRequest({
        method: 'updateEntity',
        entity: registryData
      }, wallet)
    } catch (error) {
      account.name = oldName
      await updateAccount(account)

      throw new UpdateEntityDataError()
    }
  }

  const storeMetadata = async (metadata: EntityMetadata) => {
    await updateMetadata(metadata, wallet)
  }

  const storeData = async ({updatedData, metadata, logoFile, headerFile, registryData}: IEntityData) => {
    if(updatedData.includes(UpdatedDataType.EntityRegistry)) {
      await updateEntityRegistry(registryData)

      setEntityRegistry(registryData)
    }

    if(updatedData.includes(UpdatedDataType.EntityLogo)) {
      const pool = await poolPromise
      try {
        metadata.media.avatar = await uploadFileToIpfs(logoFile, pool, wallet)
      } catch (error) {
        throw new StoreMediaError()
      }
    }

    if(updatedData.includes(UpdatedDataType.EntityHeader)) {
      const pool = await poolPromise
      try {
        metadata.media.header = await uploadFileToIpfs(headerFile, pool, wallet)
      } catch (error) {
        throw new StoreMediaError()
      }
    }

    if(
      updatedData.includes(UpdatedDataType.EntityMetadata) ||
      updatedData.includes(UpdatedDataType.EntityLogo) || 
      updatedData.includes(UpdatedDataType.EntityHeader)
    ) {
      try {
        await storeMetadata(metadata)
      } catch (error) {
        throw new StoringDataOnBlockchainError()
      }
    }
  }

  const renderEntityView = new ViewStrategy(
    () => !!wallet && !loading && metadata && loadableRegistry.state === 'hasValue',
    <EntityEditView 
      entityMetadata={metadata} 
      entityRegistryData={loadableRegistry.contents}
      storeData={storeData}
    ></EntityEditView>
  )

  const renderRedirectView = new ViewStrategy(
    () => !wallet,
    <Redirect to={ENTITY_SIGN_IN_PATH} />
  )

  const renderLoadingPage = new ViewStrategy(
    () => true,
    <Loader visible />
  )

  const viewContext = new ViewContext([
    renderEntityView,
    renderRedirectView,
    renderLoadingPage
  ])

  return (
      viewContext.getView()
  )
}

export default EntityEditPage