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
import { StepperFunc } from '../lib/types'
import { useStepper } from './use-stepper'
import { useMessageAlert } from './message-alert'

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
  terms: boolean,
  privacy: boolean,

  pleaseWait: boolean,
  created: boolean,
  actionStep: number,
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
    setTerms(terms: boolean): void,
    setPrivacy(privacy: boolean): void,
    createEntity(): void
    continueEntityCreation(): void
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
  const [terms, setTerms] = useState<boolean>(false)
  const [privacy, setPrivacy] = useState<boolean>(false)
  const { setAlertMessage } = useMessageAlert()

  // UI STATE
  const { wallet, setWallet } = useWallet()
  const { dbAccounts, addDbAccount, updateAccount } = useDbAccounts()
  const { poolPromise } = usePool()
  const { bkPromise } = useBackend()

  // Detect if there was an ongoing account creation and resume if so
  useEffect(() => {
    if (!wallet || !dbAccounts?.length) return

    const account = dbAccounts.find(acc => acc.address.toLowerCase() == wallet.address.toLowerCase())
    if (!account?.pending?.metadata || !account?.pending?.email) return

    setEmail(account.pending.email)
    setName(account.pending.metadata.name.default)
    setDescription(account.pending.metadata.description.default)
    setLogoUrl(account.pending.metadata.media.avatar)
    setHeaderUrl(account.pending.metadata.media.header)
    setTerms(true)
    setPrivacy(true)

    // Skip the metadata screen
    setPageStep(EntityCreationPageSteps.CREDENTIALS)

    // Bypass the wallet creation steps, since we already have one
    const idx = creationStepFuncs.indexOf(ensureAccount)
    if (idx < 0) return console.error("INTERNAL ERROR: ensureAccount not found")
    forceActionStep(idx)

    const str = i18n.t("warning.the_creation_of_your_entity_is_not_complete") + ". " +
      i18n.t("warning.please_enter_your_passphrase_to_retry_it")
    setAlertMessage(str)
  }, [])

  // UTIL

  const ensureNullWallet: StepperFunc = () => {
    if (!wallet) {
      // Already OK?
      return Promise.resolve({ waitNext: false })
    }

    setWallet(null)
    return Promise.resolve({ waitNext: true })
  }

  const ensureWallet: StepperFunc = () => {
    if (wallet) {
      // Already OK?
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
      // Already OK?
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
      // Already OK?
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

  // (helper of ensureEntityCreation)
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

    return waitForGas(wallet.address, wallet.provider)
      .then(hasBalance => {
        if (!hasBalance) throw new Error("No balance")
      })
      .catch(err => {
        console.error(err)
        throw new Error(i18n.t("errors.cannot_receive_credit_for_the_new_account"))
      })
  }

  // (helper of ensureEntityCreation)
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
          .then((entityURL) => console.log("Entity URL:", entityURL))
          .catch(err => {
            console.error(err)
            throw new Error(i18n.t("errors.cannot_set_the_entity_details_on_the_blockchain"))
          })
      })
  }

  // (helper of ensureEntityCreation)
  const ensureNoPendingAccount = () => {
    const account = dbAccounts.find(acc => acc.address == wallet.address)

    return updateAccount(wallet.address, { ...account, pending: null })
      .catch(err => {
        console.error(err)
        throw new Error(i18n.t("errors.cannot_complete_the_process"))
      })
  }

  // Enumerate all the steps needed to create an entity
  const creationStepFuncs = [ensureNullWallet, ensureWallet, ensureAccount, ensureEntityCreation]

  const creationStepper = useStepper<EntityCreationPageSteps>(creationStepFuncs, EntityCreationPageSteps.METADATA)
  const { pageStep, actionStep, pleaseWait, creationError, setPageStep, forceActionStep, doMainActionSteps } = creationStepper

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
    terms,
    privacy,

    pleaseWait,
    created: actionStep >= creationStepFuncs.length,
    actionStep,
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
      setTerms,
      setPrivacy,
      createEntity: doMainActionSteps,
      continueEntityCreation: doMainActionSteps
    }
  }

  return (
    <UseEntityCreationContext.Provider value={value}>
      {children}
    </UseEntityCreationContext.Provider>
  )
}
