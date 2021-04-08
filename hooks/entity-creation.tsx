import { usePool } from '@vocdoni/react-hooks'
import { EntityApi, EntityMetadata, EntityMetadataTemplate, Symmetric } from 'dvote-js'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useBackend } from './backend'
import { waitForGas } from "../lib/api"
import { useDbAccounts } from './use-db-accounts'
import { useWallet } from './use-wallet'
import { EntityCreationSteps } from '../components/Entities/steps'
import { Wallet } from 'ethers'
import { EMAIL_REGEX } from '../lib/regex'
import { uploadFileToIpfs } from '../lib/file'
import i18n from '../i18n'

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

export const UseEntityCreationContext = createContext<EntityCreationContext>({} as any)

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
  const { step, name, email, description, logoUrl, logoFile, headerUrl, headerFile, passphrase, methods } = entityCreationCtx
  const { setCreating } = methods
  const cleanError = () => { if (error) setError("") }

  // GETTERS

  const validMetadata = useMemo(() => {
    const required = ['name', 'email', 'description']
    for (const req of required) {
      if (!entityCreationCtx[req].length) return false
    }

    if (!EMAIL_REGEX.test(entityCreationCtx.email)) {
      return false
    }

    const files = ['logo', 'header']
    for (const file of files) {
      if (entityCreationCtx[file + 'File'] === null && !entityCreationCtx[file + 'Url'].length) {
        return false
      }
    }

    return true
  }, [name, email, description, logoUrl, logoFile, headerUrl, headerFile])

  // DATA MUTATION

  // Attempt to continue the entity creation whenever some more data is available
  useEffect(() => {
    if (!created) ensureSignedUp()
  }, [passphrase, wallet, validMetadata, dbAccounts])

  // Step by step call that incrementally registers the entity
  const ensureSignedUp = useCallback(async () => {
    // 1) passphrase => create wallet

    if (!passphrase) return
    else if (!wallet) {
      try {
        setCreating(true)
        const provider = (await poolPromise).provider
        const newWallet = Wallet.createRandom().connect(provider)
        setWallet(newWallet) // Note: this will not immediately update `wallet`

        return // continue when the new wallet is available on the scope
      }
      catch (err) {
        setError(i18n.t("errors.your_credentials_cannot_be_created"))
        return
      }
    }
    cleanError()

    if (step != EntityCreationSteps.CREATION) return

    // 2) wallet => encrypt mnemonic => store DB account

    if (!validMetadata) return
    else if (!dbAccounts.some(acc => acc.address == wallet.address)) {
      try {
        setCreating(true)

        // Store account with temporary metadata

        let avatar = logoUrl
        if (logoFile) {
          avatar = await uploadFileToIpfs(logoFile, await poolPromise, wallet)
        }
        let header = headerUrl
        if (headerFile) {
          header = await uploadFileToIpfs(headerFile, await poolPromise, wallet)
        }
        const metadata: EntityMetadata = {
          ...JSON.parse(JSON.stringify(EntityMetadataTemplate)),
          name: { default: name.trim() },
          description: { default: description.trim() },
          media: { avatar, header }
        }

        // set metadata as pending, along with the account
        await addDbAccount({
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

        // continue when the dbAccounts hook value is updated
        return
      }
      catch (err) {
        setError(i18n.t("errors.the_account_metadata_could_not_be_stored"))
        return
      }
    }
    cleanError()

    // The account is now ready on IndexDB
    const account = dbAccounts.find(acc => acc.address == wallet.address)

    // 3) pending metadata => sign up and get gas
    if (account.pending?.creation) {
      setCreating(true)

      let zeroBalance: boolean
      try {
        const pool = await poolPromise
        zeroBalance = (await pool.provider.getBalance(wallet.address)).isZero()
      }
      catch (err) {
        setError(i18n.t("errors.cannot_connect_to_the_blockchain"))
        return
      }

      if (zeroBalance) {
        try {
          const gw = await bkPromise
          await gw.sendRequest({
            method: 'signUp',
            entity: {
              // TODO: entityName ??
              name: account.name,
              // email: account.pending.email // TODO: confirm?
            },
          }, wallet)
        }
        catch (err) {
          setError(i18n.t("errors.cannot_connect_to_vocdoni"))
          return
        }

        try {
          await waitForGas(wallet.address, wallet.provider)
        }
        catch (err) {
          setError(i18n.t("errors.cannot_receive_credit_for_the_new_account"))
          return
        }
      }

      // 4) gas ready => upload metadata + register the entity
      try {
        await EntityApi.setMetadata(wallet.address, account.pending.metadata, wallet, await poolPromise)
      }
      catch (err) {
        setError(i18n.t("errors.cannot_set_the_entity_details_on_the_blockchain"))
        return
      }

      // 5) entity => mark DB account as registered
      try {
        await updateAccount(wallet.address, { ...account, pending: null })
      }
      catch (err) {
        setError(i18n.t("errors.cannot_complete_the_process"))
        return
      }
    }

    // display success
    setCreating(false)
    setCreated(true)

  }, [passphrase, wallet, validMetadata, dbAccounts])

  return { ...entityCreationCtx, created, validMetadata, ensureSignedUp, error }
}

export const UseEntityCreationProvider = ({ children }: { children: ReactNode }) => {
  const [creating, setCreating] = useState<boolean>(true)
  const [step, setStep] = useState<EntityCreationSteps>(EntityCreationSteps.DETAILS)
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [passphrase, setPassphrase] = useState<string>("")
  const [logoUrl, setLogoUrl] = useState<string>("")
  const [logoFile, setLogoFile] = useState<File>()
  const [headerUrl, setHeaderUrl] = useState<string>("")
  const [headerFile, setHeaderFile] = useState<File>()
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)

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
