import { Wallet } from '@ethersproject/wallet'
import { EntityApi, EntityMetadata, EntityMetadataTemplate, Symmetric } from 'dvote-js'
import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer/'
import { usePool } from '@vocdoni/react-hooks'
import { Else, If, Then } from 'react-if'

import { useEntityCreation } from '../../hooks/entity-creation'
import { useDbAccounts } from '../../hooks/use-db-accounts'
import { useWallet } from '../../hooks/use-wallet'
import { IPFSUpload } from '../FileLoader'
import { useBackend } from '../../hooks/backend'
import { useMessageAlert } from '../../hooks/message-alert'
import { Button } from '../button'
import i18n from '../../i18n'
import { NewEntityStepProps } from '../../lib/types'

const EntityCreation = ({ setStep }: NewEntityStepProps) => {
  const entity = useEntityCreation()
  const [creating, setCreating] = useState<boolean>(true)
  const { gw } = useBackend()
  const { wallet, setWallet, waitForGas } = useWallet()
  const { poolPromise } = usePool()
  const { addAccount, getAccount } = useDbAccounts()
  const { setAlertMessage } = useMessageAlert()

  const onError = (error: string) => {
    setAlertMessage(error)
    setStep('NewEntityDetails')
  }

  useEffect(() => {
    setCreating(true)
    async function signup() {
      try {
        // Start dvote and web3 pool
        const pool = await poolPromise


        // Create wallet if not exists
        let bytes: Buffer
        if (wallet == null) {
          const tempWallet = Wallet.createRandom().connect(pool.provider)
          // Store wallet in memory
          setWallet(tempWallet)
        }


        let account = getAccount(entity.name)
        if (typeof account == undefined) {
          // Create Account if not exists
          bytes = Buffer.from(wallet.mnemonic.phrase, 'ascii')
          // Store account to local storage
          await addAccount({
            address: wallet.address,
            name: entity.name,
            encryptedMnemonic: Symmetric.encryptBytes(bytes, entity.password),
            hdPath: wallet.mnemonic.path,
            locale: wallet.mnemonic.locale
          })
        }
        // TODO add check for uploadfiles
        // Upload images
        let avatar = entity.logoUrl
        if (entity.logoFile) {
          avatar = await IPFSUpload(pool, wallet, entity.logoFile)
        }
        let header = entity.headerUrl
        if (entity.headerFile) {
          header = await IPFSUpload(pool, wallet, entity.headerFile)
        }

        // Store email in centralized backend
        if (!entity.hasSignedUp) {
          //TODO fix wallet issue
          while (!wallet) {
            await new Promise(r => setTimeout(r, 200))
          }
          const response = await gw.sendRequest({
            method: 'signUp',
            entity: {
              name: entity.name,
            },
          }, wallet)
          if (response.ok) {
            entity.setHasSignedUp(true)
          }
        }
        // Wait for gas
        if (!await waitForGas()) {
          return onError(i18n.t('errors.general_error'))
        }

        if (entity.metadataURI.length == 0) {
          // Store metadata
          const metadata: EntityMetadata = {
            ...JSON.parse(JSON.stringify(EntityMetadataTemplate)),
            name: {
              default: entity.name,
            },
            description: {
              default: entity.description,
            },
            media: {
              avatar,
              header,
            }
          }
          let metadataURI = await EntityApi.setMetadata(wallet.address, metadata, wallet, pool)
          if (metadataURI.length > 0) {
            entity.setMetadataURI(metadataURI)
          }
        }

        setCreating(false)
      } catch (e) {
        console.error('entity signup error', e)
        onError(e.message || e)
      }
    }

    signup()
  }, [])

  return (
    <If condition={creating}>
      <Then>
        <div>Wait, creating account</div>
      </Then>
      <Else>
        <Button href='/dashboard'>
          {i18n.t('action.go_to_dashboard')}
        </Button>
        <Button href='/processes/new' positive>
          {i18n.t('action.create_new_proposal')}
        </Button>
      </Else>
    </If>
  )
}

export default EntityCreation
