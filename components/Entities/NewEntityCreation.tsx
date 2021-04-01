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
import { StepProps } from '../../lib/types'

const EntityCreation = ({ setStep }: StepProps) => {
  const account = useEntityCreation()
  const [creating, setCreating] = useState<boolean>(false)
  const { gw } = useBackend()
  const { setWallet, waitForGas } = useWallet()
  const { poolPromise } = usePool()
  const { addAccount } = useDbAccounts()
  const { setAlertMessage } = useMessageAlert()

  const onError = (error: string) => {
    setCreating(false)
    setAlertMessage(error)
    setStep('NewEntityDetails')
  }

  useEffect(() => {
    setCreating(true)
    async function signup() {
      try {
        const pool = await poolPromise
        const wallet = Wallet.createRandom().connect(pool.provider)
        const bytes = Buffer.from(wallet.mnemonic.phrase, 'ascii')
        // Store wallet in memory
        setWallet(wallet)

        // Store account to local storage
        await addAccount({
          address: wallet.address,
          name: account.name,
          encryptedPrivateKey: Symmetric.encryptBytes(bytes, account.password),
        })

        // Upload images
        let avatar = account.logoUrl
        if (account.logoFile) {
          avatar = await IPFSUpload(pool, wallet, account.logoFile)
        }
        let header = account.headerUrl
        if (account.headerFile) {
          header = await IPFSUpload(pool, wallet, account.headerFile)
        }

        // Store email in centralized backend
        await gw.sendRequest({
          method: 'signUp',
          entity: {
            name: account.name,
          },
        }, wallet)

        // Wait for gas
        if (!await waitForGas()) {
          return onError(i18n.t('errors.general_error'))
        }

        // Store metadata
        const metadata: EntityMetadata = {
          ...JSON.parse(JSON.stringify(EntityMetadataTemplate)),
          name: {
            default: account.name,
          },
          description: {
            default: account.description,
          },
          media: {
            avatar,
            header,
          }
        }
        await EntityApi.setMetadata(wallet.address, metadata, wallet, pool)

        setCreating(false)
      } catch (e) {
        console.log('entity signup error', e)
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
          {i18n.t('go_to_dashboard')}
        </Button>
        <Button href='/processes/new' positive>
          {i18n.t('create_new_proposal')}
        </Button>
      </Else>
    </If>
  )
}

export default EntityCreation
