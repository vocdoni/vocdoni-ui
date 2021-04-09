import { usePool } from '@vocdoni/react-hooks'
import { ensHashAddress, EntityApi, EntityMetadata, EntityMetadataTemplate, GatewayPool, Symmetric, TextRecordKeys } from 'dvote-js'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useBackend } from './backend'
import { waitForGas } from "../lib/api"
import { useDbAccounts } from './use-db-accounts'
import { useWallet } from './use-wallet'
import { EntityCreationSteps } from '../components/steps-entity-creation'
import { BigNumber, Wallet } from 'ethers'
import { EMAIL_REGEX } from '../lib/regex'
import { uploadFileToIpfs } from '../lib/file'
import i18n from '../i18n'

/** Returns whether the caller should return and wait for new hook values */
type CreationStepFunc = () => Promise<boolean>

export interface EntityCreationContext {
  creating: boolean,
  step: EntityCreationSteps,

  name: string,
  email: string,
  description: string,
  logoUrl: string,
  logoFile: File,
  headerUrl: string,
  headerFile: File,
  passphrase: string,

  methods: {
    setCreating: (c: boolean) => void,
    setStep: (s: EntityCreationSteps) => void,

    setName(name: string): void,
    setEmail(email: string): void,
    setDescription(description: string): void,
    setHeaderFile(headerFile: File): void,
    setHeaderUrl(headerUrl: string): void,
    setLogoFile(logoFile: File): void,
    setLogoUrl(logoUrl: string): void,
    setPassphrase(passphrase: string): void,
  }
}

export const UseEntityCreationContext = createContext<EntityCreationContext>({ step: 0, methods: {} } as any)

export const useEntityCreation = () => {
  const [error, setError] = useState<string>()
  const { wallet, setWallet } = useWallet()
  const { dbAccounts, addDbAccount, updateAccount } = useDbAccounts()
  const { poolPromise } = usePool()
  const { bkPromise } = useBackend()
  const [created, setCreated] = useState(false)

  const entityCreationCtx = useContext(UseEntityCreationContext)
  if (entityCreationCtx === null) {
    throw new Error('useEntityCreation() can only be used on the descendants of <UseEntityCreationProvider />,')
  }

  const { step, creating, name, email, description, logoUrl, logoFile, headerUrl, headerFile, passphrase, methods } = entityCreationCtx
  const { setCreating } = methods
  const cleanError = () => { if (error) setError("") }

  // GETTERS

  const metadataValidationError = useMemo(() => {
    const required = ['name', 'email', 'description']
    for (const req of required) {
      if (!entityCreationCtx[req] || !entityCreationCtx[req].length) return i18n.t("errors.please_fill_in_all_the_fields")
    }

    if (!EMAIL_REGEX.test(entityCreationCtx.email)) {
      return i18n.t("errors.please_enter_a_valid_email")
    }

    const files = ['logo', 'header']
    for (const file of files) {
      if (entityCreationCtx[file + 'File'] === null && !entityCreationCtx[file + 'Url'].length) {
        return i18n.t("errors.please_select_an_image_for_the_header_and_the_logo")
      }
    }

    return null
  }, [name, email, description, logoUrl, logoFile, headerUrl, headerFile])

  // DATA MUTATION

  // Attempt to continue the entity creation whenever some more data is available
  useEffect(() => {
    if (creating || created || error) return

    ensureSignedUp()
  }, [creating, created, passphrase, wallet, metadataValidationError, dbAccounts])

  // Step by step call that incrementally registers the entity
  const ensureSignedUp = async () => {
    if (step != EntityCreationSteps.CREATION) return
    else if (creating) return

    setCreating(true)

    // 1) passphrase => create wallet

    if (!passphrase) return setCreating(false)

    let shouldBreak = await ensureWallet()
    if (shouldBreak) return setCreating(false)

    // 2) wallet => encrypt mnemonic => store DB account

    if (metadataValidationError) return setCreating(false)

    shouldBreak = await ensureAccount()
    if (shouldBreak) return setCreating(false)

    // The account is now ready on IndexDB

    shouldBreak = await ensureEntityCreation()
    if (shouldBreak) return setCreating(false)


    // display success
    setCreating(false)
    setCreated(true)
  }

  const ensureWallet: CreationStepFunc = () => {
    if (wallet) {
      cleanError()
      return Promise.resolve(false)
    }

    return poolPromise.then(pool => {
      const newWallet = Wallet.createRandom().connect(pool.provider)
      setWallet(newWallet) // Note: this will not immediately update `wallet`
      cleanError()

      return true // continue when the new wallet is available on the scope
    }).catch(err => {
      console.error(err)
      setError(i18n.t("errors.your_credentials_cannot_be_created"))

      return true
    })
  }

  const ensureAccount: CreationStepFunc = () => {
    if (dbAccounts.some(acc => acc.address == wallet.address)) {
      cleanError()
      return Promise.resolve(false)
    }

    let pool: GatewayPool
    let avatar: string

    return poolPromise
      .then(gwPool => {
        pool = gwPool

        if (logoFile) return uploadFileToIpfs(logoFile, pool, wallet)
        return logoUrl
      })
      .then(value => {
        avatar = value

        if (headerFile) return uploadFileToIpfs(headerFile, pool, wallet)
        return headerUrl
      })
      .then(header => {
        // Store account with temporary metadata
        const metadata: EntityMetadata = {
          ...JSON.parse(JSON.stringify(EntityMetadataTemplate)),
          name: { default: name.trim() },
          description: { default: description.trim() },
          media: { avatar, header }
        }

        // set metadata as pending, along with the account
        return addDbAccount({
          name,
          address: wallet.address,
          encryptedMnemonic: Symmetric.encryptString(wallet.mnemonic.phrase, passphrase),
          hdPath: wallet.mnemonic.path,
          locale: "en",
          // pending
          pending: {
            creation: true,
            metadata: metadata,
            email
          }
        })
      })
      .then(() => {
        cleanError()

        // break the paren't execution and continue when the dbAccounts hook value is updated
        return true
      })
      .catch(err => {
        console.error(err)
        setError(i18n.t("errors.the_account_metadata_could_not_be_stored"))
        return true
      })
  }

  const ensureEntityCreation: CreationStepFunc = async () => {
    const account = dbAccounts.find(acc => acc.address == wallet.address)
    if (!account.pending) return false

    // 3) pending metadata => sign up and get gas

    let shouldBreak = await ensureWalletBalance()
    if (shouldBreak) return true

    // 4) gas ready => upload metadata + register the entity

    shouldBreak = await ensureEntityMetadata()
    if (shouldBreak) return true

    // 5) entity => mark DB account as registered
    shouldBreak = await ensureNoPendingAccount()
    return shouldBreak
  }

  const ensureWalletBalance: CreationStepFunc = async () => {
    let balance: BigNumber
    const pool = await poolPromise

    try {
      balance = await pool.provider.getBalance(wallet.address)
    }
    catch (err) {
      setError(i18n.t("errors.cannot_connect_to_the_blockchain"))
      return
    }

    // Done: skip
    if (!balance.isZero()) return false

    // Pending
    const account = dbAccounts.find(acc => acc.address == wallet.address)

    try {
      const bk = await bkPromise
      await bk.sendRequest({
        method: 'signUp',
        entity: {
          name: account.name,
          email: account.pending.email
        },
      }, wallet)
    }
    catch (err) {
      console.error(err)
      setError(i18n.t("errors.cannot_connect_to_vocdoni"))
      return true
    }

    try {
      await waitForGas(wallet.address, wallet.provider)
    }
    catch (err) {
      setError(i18n.t("errors.cannot_receive_credit_for_the_new_account"))
      // break
      return true
    }

    cleanError()
    // we can continue without expecting any hook update
    return false
  }

  const ensureEntityMetadata: CreationStepFunc = () => {
    let pool: GatewayPool
    const account = dbAccounts.find(acc => acc.address == wallet.address)

    if (!account.pending || !account.pending.metadata) return Promise.resolve(true)

    return poolPromise
      .then(gwPool => {
        pool = gwPool
        return pool.getEnsPublicResolverInstance()
      })
      .then(instance => instance.text(ensHashAddress(wallet.address), TextRecordKeys.JSON_METADATA_CONTENT_URI))
      .then(value => {
        // Done
        if (value) {
          cleanError()
          // continue
          return false
        }

        // Pending
        return EntityApi.setMetadata(wallet.address, account.pending.metadata, wallet, pool)
          .then(() => {
            cleanError()
            // we can continue without expecting any hook update
            return false
          })
          .catch(err => {
            console.error(err)
            setError(i18n.t("errors.cannot_set_the_entity_details_on_the_blockchain"))
            // break
            return true
          })
      })
  }

  const ensureNoPendingAccount: CreationStepFunc = () => {
    const account = dbAccounts.find(acc => acc.address == wallet.address)

    return updateAccount(wallet.address, { ...account, pending: null })
      .then(() => {
        cleanError()
        // continue
        return false
      })
      .catch(err => {
        console.error(err)
        setError(i18n.t("errors.cannot_complete_the_process"))
        // break
        return true
      })
  }


  return { ...entityCreationCtx, methods: { ...methods, ensureSignedUp }, created, metadataValidationError, error }
}

export const UseEntityCreationProvider = ({ children }: { children: ReactNode }) => {
  const [creating, setCreating] = useState<boolean>(false)
  const [step, setStep] = useState<EntityCreationSteps>(EntityCreationSteps.METADATA)
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [passphrase, setPassphrase] = useState<string>("")
  const [logoUrl, setLogoUrl] = useState<string>("")
  const [logoFile, setLogoFile] = useState<File>()
  const [headerUrl, setHeaderUrl] = useState<string>("")
  const [headerFile, setHeaderFile] = useState<File>()

  const value: EntityCreationContext = {
    creating,
    step,
    name,
    email,
    description,
    logoUrl,
    logoFile,
    headerUrl,
    headerFile,
    passphrase,

    methods: {
      setCreating,
      setStep,
      setName,
      setEmail,
      setDescription,
      setPassphrase,
      setLogoUrl,
      setLogoFile,
      setHeaderUrl,
      setHeaderFile,
    }
  }

  return (
    <UseEntityCreationContext.Provider value={value}>
      {children}
    </UseEntityCreationContext.Provider>
  )
}
