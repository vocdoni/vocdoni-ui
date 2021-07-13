import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'
import { usePool } from '@vocdoni/react-hooks'
import {
  ensHashAddress,
  EntityApi,
  EntityMetadata,
  EntityMetadataTemplate,
  GatewayPool,
  Symmetric,
  TextRecordKeys,
} from 'dvote-js'
import { useBackend } from './backend'
import { waitForGas } from '../lib/api'
import { useDbAccounts } from './use-db-accounts'
import { useWallet } from './use-wallet'
import { EntityCreationPageSteps } from '@components/pages/entity/new'
import { BigNumber, Wallet } from 'ethers'
import { uploadFileToIpfs } from '../lib/file'
import { Account, AccountStatus, StepperFunc } from '../lib/types'
import { useStepper } from './use-stepper'

import { BlockchainConnectionError } from '@lib/validators/errors/blockchain-connection-error'
import { VocdoniConnectionError } from '@lib/validators/errors/vocdoni-connection-error'
import { InvalidAccountBalanceError } from '@lib/validators/errors/invalid-account-balance-error'
import { StoringDataOnBlockchainError } from '@lib/validators/errors/storing-data-on-blockchain-error'
import { UpdateDbAccountError } from '@lib/validators/errors/update-db-account-error'
import { CreateCredentialsError } from '@lib/validators/errors/create-credentials-error'
import { EntityNameAlreadyExistError } from '@lib/validators/errors/entity-name-already-exits-error'
import { StoreMediaError } from '@lib/validators/errors/store-media-error'
import { InvalidIncognitoModeError } from '@lib/validators/errors/invalid-incognito-mode-error'
import { ISelectOption } from '@components/elements/inputs'

export interface EntityCreationContext {
  pageStep: EntityCreationPageSteps
  creationError: Error | string

  name: string
  email: string
  description: string
  logoUrl: string
  logoFile: File
  headerUrl: string
  headerFile: File
  passphrase: string
  terms: boolean
  entityTerms: boolean
  privacy: boolean
  entityType: ISelectOption
  entitySize: ISelectOption

  pleaseWait: boolean
  created: boolean
  actionStep: number
  methods: {
    setPageStep: (s: EntityCreationPageSteps) => void

    setName(name: string): void
    setEmail(email: string): void
    setDescription(description: string): void
    setHeaderFile(headerFile: File): void
    setHeaderUrl(headerUrl: string): void
    setLogoFile(logoFile: File): void
    setLogoUrl(logoUrl: string): void
    setPassphrase(passphrase: string): void
    setTerms(terms: boolean): void
    setEntityTerms(terms: boolean): void
    setPrivacy(privacy: boolean): void
    setEntityType(entityType: ISelectOption): void
    setEntitySize(entitySize: ISelectOption): void
    createEntity(): void
    continueEntityCreation(): void
    continuePendingProcessCreation(account: Account): void
  }
}

export const UseEntityCreationContext = createContext<EntityCreationContext>({
  step: 0,
  methods: {},
} as any)

const accountStatusToStepProcess = new Map<AccountStatus, number>([
  [AccountStatus.Wallet, 0],
  [AccountStatus.Media, 1],
  [AccountStatus.Balance, 2],
  [AccountStatus.Metadata, 3],
])

export const useEntityCreation = () => {
  const entityCreationCtx = useContext(UseEntityCreationContext)
  if (entityCreationCtx === null) {
    throw new Error(
      'useEntityCreation() can only be used on the descendants of <UseEntityCreationProvider />,'
    )
  }

  // GETTERS

  return { ...entityCreationCtx }
}

export const UseEntityCreationProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  // FORM DATA
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [passphrase, setPassphrase] = useState<string>('')
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [logoFile, setLogoFile] = useState<File>()
  const [headerUrl, setHeaderUrl] = useState<string>('')
  const [headerFile, setHeaderFile] = useState<File>()
  const [terms, setTerms] = useState<boolean>(false)
  const [entityTerms, setEntityTerms] = useState<boolean>(false)
  const [entityType, setEntityType] = useState<ISelectOption>()
  const [entitySize, setEntitySize] = useState<ISelectOption>()
  const [privacy, setPrivacy] = useState<boolean>(false)
  // const { setAlertMessage } = useMessageAlert()

  // UI STATE
  const { wallet, setWallet } = useWallet()
  const { dbAccounts, addDbAccount, updateAccount, getAccount } =
    useDbAccounts()
  const { poolPromise } = usePool()
  const { bkPromise } = useBackend()

  // UTIL

  const ensureNullWallet: StepperFunc = () => {
    if (!wallet) {
      // Already OK?
      return Promise.resolve({ waitNext: false })
    }

    const account = getAccount(wallet.address)

    if (!account || account.status === AccountStatus.Ready) setWallet(null)

    return Promise.resolve({ waitNext: true })
  }

  const ensureWallet: StepperFunc = async () => {
    if (wallet) {
      // Already OK?
      return { waitNext: false }
    }

    try {
      const pool = await poolPromise
      const newWallet = Wallet.createRandom().connect(pool.provider)
      setWallet(newWallet) // Note: this will not imnediately update `wallet`

      return { waitNext: true }
    } catch {
      return { error: new CreateCredentialsError() }
    }
  }

  const ensureAccount: StepperFunc = async () => {
    let account = getAccount(wallet.address)

    if (account && account.status === AccountStatus.Ready) {
      // Already OK?
      return Promise.resolve({ waitNext: false })
    }

    try {
      if (!account) {
        account = {
          name,
          address: wallet.address,
          encryptedMnemonic: Symmetric.encryptString(
            wallet.mnemonic.phrase,
            passphrase
          ),
          hdPath: wallet.mnemonic.path,
          locale: 'en',
          status: AccountStatus.Wallet,
          pending: {
            email,
            creation: true,
            metadata: {
              ...JSON.parse(JSON.stringify(EntityMetadataTemplate)),
              name: { default: name.trim() },
              description: { default: description.trim() },
              // media is set later
            },
          },
        }
        await addDbAccount(account)
      }
    } catch (error) {
      console.log(error)

      if (error?.message?.indexOf?.("mutation") >= 0) { // if is incognito mode throw these error
        return { error: new InvalidIncognitoModeError() }
      }

      return { error: new EntityNameAlreadyExistError() }
    }

    try {
      let pool: GatewayPool = await poolPromise
      let avatar: string = logoUrl
      let header: string = headerUrl

      if (logoFile) avatar = await uploadFileToIpfs(logoFile, pool, wallet)
      if (headerFile) header = await uploadFileToIpfs(headerFile, pool, wallet)

      // set metadata as pending, along with the account
      account.status = AccountStatus.Media
      account.pending.metadata.media = {
        avatar,
        header,
      }

      await updateAccount(account)

      return { waitNext: true }
    } catch (error) {
      return { error: new StoreMediaError() }
    }
  }

  const ensureEntityCreation: StepperFunc = async () => {
    const account = getAccount(wallet.address)
    if (!account) throw new Error("Internal error")

    let lastSuccessStatus: AccountStatus = account.status

    if (account.status === AccountStatus.Ready) {
      return Promise.resolve({ waitNext: false })
    }

    try {
      // 3) pending metadata => sign up and get gas
      await ensureWalletBalance()
      lastSuccessStatus = AccountStatus.Balance

      // 4) gas ready => upload metadata + register the entity
      await ensureEntityMetadata()
      lastSuccessStatus = AccountStatus.Metadata
      // 5) entity => mark DB account as registered
      await ensureNoPendingAccount()
      lastSuccessStatus = AccountStatus.Ready
    } catch (error) {
      return { error: error }
    } finally {
      account.status = lastSuccessStatus

      await updateAccount(account)
    }

    return {}
  }

  // (helper of ensureEntityCreation)
  const ensureWalletBalance = async () => {
    let balance: BigNumber
    const pool = await poolPromise

    try {
      balance = await pool.provider.getBalance(wallet.address)
    } catch (err) {
      console.error(err)
      throw new BlockchainConnectionError()
    }

    // Done: skip
    if (!balance.isZero()) return

    // Pending
    const account = getAccount(wallet.address)
    if (!account) throw new Error("Internal error")

    if (account.status === AccountStatus.Media) {
      try {
        const bk = await bkPromise

        await bk.sendRequest(
          {
            method: 'signUp',
            entity: {
              name: account.name,
              email: account.pending.email,
              type: entityType?.value,
              size: entitySize?.value
            },
          },
          wallet
        )

        account.status = AccountStatus.BalanceRequested
        await updateAccount(account)
      } catch (err) {
        console.error(err)
        throw new VocdoniConnectionError()
      }
    }

    const hasBalance = await waitForGas(wallet.address, wallet.provider)

    if (!hasBalance) throw new InvalidAccountBalanceError()
  }

  // (helper of ensureEntityCreation)
  const ensureEntityMetadata = async () => {
    const account = getAccount(wallet.address)

    if (account.status === AccountStatus.Ready) return null

    try {
      const pool: GatewayPool = await poolPromise
      const instance = await pool.getEnsPublicResolverInstance()

      const entityData = await instance.text(
        ensHashAddress(wallet.address),
        TextRecordKeys.JSON_METADATA_CONTENT_URI
      )
      if (entityData) return

      const entityUrl = await EntityApi.setMetadata(
        wallet.address,
        account.pending.metadata,
        wallet,
        pool
      )

      console.log('Entity URL:', entityUrl)
    } catch (error) {
      console.log(error)
      throw new StoringDataOnBlockchainError()
    }
  }

  // (helper of ensureEntityCreation)
  const ensureNoPendingAccount = () => {
    const account = getAccount(wallet.address)
    if (!account) throw new Error("Internal error")

    return updateAccount({ ...account, pending: null })
      .catch(() => {
        throw new UpdateDbAccountError()
      })
  }

  const continuePendingProcessCreation = (account: Account) => {
    if (!wallet || !dbAccounts?.length) return

    if (!account?.pending?.metadata || !account?.pending?.email) return

    setEmail(account.pending.email)
    setName(account.pending.metadata.name.default)
    setDescription(account.pending.metadata.description.default)
    setLogoUrl(account.pending.metadata.media.avatar)
    setHeaderUrl(account.pending.metadata.media.header)
    setTerms(true)

    forceActionStep(accountStatusToStepProcess.get(account.status))
    doMainActionSteps()
  }

  // Enumerate all the steps needed to create an entity
  const creationStepFuncs = [
    ensureNullWallet,
    ensureWallet,
    ensureAccount,
    ensureEntityCreation,
  ]

  const creationStepper = useStepper<EntityCreationPageSteps>(
    creationStepFuncs,
    EntityCreationPageSteps.METADATA
  )
  const {
    pageStep,
    actionStep,
    pleaseWait,
    creationError,
    setPageStep,
    forceActionStep,
    doMainActionSteps,
  } = creationStepper

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
    entityTerms,
    privacy,
    entitySize,
    entityType,

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
      setEntityTerms,
      setPrivacy,
      setEntitySize,
      setEntityType,
      continuePendingProcessCreation,
      createEntity: doMainActionSteps,
      continueEntityCreation: doMainActionSteps,
    },
  }

  return (
    <UseEntityCreationContext.Provider value={value}>
      {children}
    </UseEntityCreationContext.Provider>
  )
}
