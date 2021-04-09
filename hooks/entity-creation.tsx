import { usePool } from '@vocdoni/react-hooks'
import { ensHashAddress, EntityApi, EntityMetadata, EntityMetadataTemplate, GatewayPool, Symmetric, TextRecordKeys } from 'dvote-js'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useBackend } from './backend'
import { waitForGas } from "../lib/api"
import { useDbAccounts } from './use-db-accounts'
import { useWallet } from './use-wallet'
import { EntityCreationPageSteps } from '../components/steps-entity-creation'
import { BigNumber, Wallet } from 'ethers'
import { isValidEmail } from '../lib/regex'
import { uploadFileToIpfs } from '../lib/file'
import i18n from '../i18n'
import { makeStepperLoopFunction } from '../lib/util'
import { StepperFunc } from '../lib/types'

export interface EntityCreationContext {
  pageStep: EntityCreationPageSteps,
  creationError: string,

  name: string,
  email: string,
  description: string,
  logoUrl: string,
  logoFile: File,
  headerUrl: string,
  headerFile: File,
  passphrase: string,

  pleaseWait: boolean,
  created: boolean,

  methods: {
    setPageStep: (s: EntityCreationPageSteps) => void,

    setName(name: string): void,
    setEmail(email: string): void,
    setDescription(description: string): void,
    setHeaderFile(headerFile: File): void,
    setHeaderUrl(headerUrl: string): void,
    setLogoFile(logoFile: File): void,
    setLogoUrl(logoUrl: string): void,
    setPassphrase(passphrase: string): void,
    createEntity(): void
    continueCreation(): void
  }
}

export const UseEntityCreationContext = createContext<EntityCreationContext>({ step: 0, methods: {} } as any)

export const useEntityCreation = () => {
  const entityCreationCtx = useContext(UseEntityCreationContext)
  if (entityCreationCtx === null) {
    throw new Error('useEntityCreation() can only be used on the descendants of <UseEntityCreationProvider />,')
  }

  const { name, email, description, logoUrl, logoFile, headerUrl, headerFile } = entityCreationCtx

  // GETTERS

  const metadataValidationError = useMemo(() => {
    const required = ['name', 'email', 'description']
    for (const req of required) {
      if (!entityCreationCtx[req] || !entityCreationCtx[req].length) return i18n.t("errors.please_fill_in_all_the_fields")
    }

    if (!isValidEmail(entityCreationCtx.email)) {
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

  return { ...entityCreationCtx, metadataValidationError }
}

export const UseEntityCreationProvider = ({ children }: { children: ReactNode }) => {
  // FORM DATA
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [passphrase, setPassphrase] = useState<string>("")
  const [logoUrl, setLogoUrl] = useState<string>("")
  const [logoFile, setLogoFile] = useState<File>()
  const [headerUrl, setHeaderUrl] = useState<string>("")
  const [headerFile, setHeaderFile] = useState<File>()

  // UI STATE
  const [pageStep, setPageStep] = useState<EntityCreationPageSteps>(EntityCreationPageSteps.METADATA)
  const { wallet, setWallet } = useWallet()
  const { dbAccounts, addDbAccount, updateAccount } = useDbAccounts()
  const { poolPromise } = usePool()
  const { bkPromise } = useBackend()

  const [creationStep, setCreationStep] = useState(0)
  const [pleaseWait, setPleaseWait] = useState(false)
  const [creationError, setCreationError] = useState<string>()

  // UTIL

  const cleanError = () => { if (creationError) setCreationError("") }

  const ensureWallet: StepperFunc = () => {
    if (wallet) {
      return Promise.resolve({ waitNext: false })
    }

    return poolPromise.then(pool => {
      const newWallet = Wallet.createRandom().connect(pool.provider)
      setWallet(newWallet) // Note: this will not immediately update `wallet`

      return { waitNext: true } // continue when the new wallet is available on the scope
    }).catch(err => {
      console.error(err)
      return { error: i18n.t("errors.your_credentials_cannot_be_created") }
    })
  }

  const ensureAccount: StepperFunc = () => {
    if (dbAccounts.some(acc => acc.address == wallet.address)) {
      return Promise.resolve({ waitNext: false })
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
        // break the paren't execution and continue when the dbAccounts hook value is updated
        return { waitNext: true }
      })
      .catch(err => {
        console.error(err)
        return { error: i18n.t("errors.the_account_metadata_could_not_be_stored") }
      })
  }

  const ensureEntityCreation: StepperFunc = () => {
    const account = dbAccounts.find(account => account.address == wallet.address)
    if (!account.pending) {
      return Promise.resolve({ waitNext: false })
    }

    // 3) pending metadata => sign up and get gas
    return ensureWalletBalance()
      // 4) gas ready => upload metadata + register the entity
      .then(() => ensureEntityMetadata())
      // 5) entity => mark DB account as registered
      .then(() => ensureNoPendingAccount())
      .then(() => ({}))
      .catch(err => {
        console.error(err)

        return { error: err.message }
      })
  }

  const ensureWalletBalance = async () => {
    let balance: BigNumber
    const pool = await poolPromise

    try {
      balance = await pool.provider.getBalance(wallet.address)
    }
    catch (err) {
      console.error(err)
      throw new Error(i18n.t("errors.cannot_connect_to_the_blockchain"))
    }

    // Done: skip
    if (!balance.isZero()) return

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
      throw new Error(i18n.t("errors.cannot_connect_to_vocdoni"))
    }

    try {
      await waitForGas(wallet.address, wallet.provider)
    }
    catch (err) {
      console.error(err)
      throw new Error(i18n.t("errors.cannot_receive_credit_for_the_new_account"))
    }
  }

  const ensureEntityMetadata = () => {
    let pool: GatewayPool
    const account = dbAccounts.find(acc => acc.address == wallet.address)

    if (!account.pending || !account.pending.metadata) return Promise.resolve(null)

    return poolPromise
      .then(gwPool => {
        pool = gwPool
        return pool.getEnsPublicResolverInstance()
      })
      .then(instance => // Does it have metadata?
        instance.text(ensHashAddress(wallet.address), TextRecordKeys.JSON_METADATA_CONTENT_URI)
      )
      .catch(err => null) // continue now with null
      .then(value => {
        // Done
        if (value) return

        // Pending
        return EntityApi.setMetadata(wallet.address, account.pending.metadata, wallet, pool)
          .then(() => null)
          .catch(err => {
            console.error(err)
            throw new Error(i18n.t("errors.cannot_set_the_entity_details_on_the_blockchain"))
          })
      })
  }

  const ensureNoPendingAccount = () => {
    const account = dbAccounts.find(acc => acc.address == wallet.address)

    return updateAccount(wallet.address, { ...account, pending: null })
      .catch(err => {
        console.error(err)
        throw new Error(i18n.t("errors.cannot_complete_the_process"))
      })
  }

  // Enumerate all the steps needed to create an entity
  const creationFuncs = [ensureWallet, ensureAccount, ensureEntityCreation]

  // Create a function to perform these steps iteratively, stopping when a break is needed or an error is found
  const entitySignupStepper = makeStepperLoopFunction(creationFuncs)

  // Creation entry point
  const createEntity = () => {
    setWallet(null)

    // Start the work
    return continueCreation()
  }

  // Continuation callback
  const continueCreation = () => {
    setPleaseWait(true)
    cleanError()

    return entitySignupStepper(creationStep)
      .then(({ continueFrom, error }) => {
        // Either the process is completed, something needs a refresh or something failed
        setPleaseWait(false)

        // Set the next step to continue from
        setCreationStep(continueFrom)

        if (error) {
          setCreationError(error)
          // This will cause the `useEffect` below to stop relaunching `continueCreation`
          // until the caller manually invokes it again
        }
        // Otherwise, the `useEffect` below will relaunch `continueCreation` after
        // the new state is available
      })
  }

  useEffect(() => {
    if (creationError) return
    else if (pageStep < EntityCreationPageSteps.CREATION) return

    continueCreation() // creationStep changed, continue
  }, [creationStep, creationError])

  // RETURN VALUES
  const value: EntityCreationContext = {
    pageStep,
    creationError,

    name,
    email,
    description,
    logoUrl,
    logoFile,
    headerUrl,
    headerFile,
    passphrase,

    pleaseWait,
    created: creationStep >= creationFuncs.length,

    methods: {
      setPageStep,
      setName,
      setEmail,
      setDescription,
      setPassphrase,
      setLogoUrl,
      setLogoFile,
      setHeaderUrl,
      setHeaderFile,
      createEntity,
      continueCreation
    }
  }

  return (
    <UseEntityCreationContext.Provider value={value}>
      {children}
    </UseEntityCreationContext.Provider>
  )
}
