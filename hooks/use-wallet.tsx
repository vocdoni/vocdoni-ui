import { useState, createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Wallet } from '@ethersproject/wallet'
import { Symmetric } from 'dvote-js'
import { useSetRecoilState } from 'recoil'
import { CREATE_PROCESS_PATH, DASHBOARD_PATH, ACCOUNT_BACKUP_PATH, ENTITY_SIGN_IN_PATH } from '../const/routes'
import { InvalidPassphraseError } from '@lib/validators/errors/invalid-passphrase-error'
import { walletState } from 'recoil/atoms/wallet'

const pathsRequiringAdminWallet = [
  DASHBOARD_PATH,
  CREATE_PROCESS_PATH,
  ACCOUNT_BACKUP_PATH
]

export enum WalletRoles {
  ADMIN,
  VOTER
}

/** Provides the currently available wallet for the admin (by default) or for the voter otherwise  */
export const useWallet = ({ role }: { role: WalletRoles } = { role: WalletRoles.ADMIN }) => {
  const walletCtx = useContext(UseWalletContext)
  const setWallet = useSetRecoilState(walletState)
  if (walletCtx === null) {
    throw new Error('useWallet() can only be used on the descendants of <UseWalletContextProvider />,')
  }
  const { adminWallet, voterWallet, setAdminWallet, setVoterWallet, checkingNeedsSignin } = walletCtx

  /** Decrypts the private key and sets the current **ADMIN** wallet from it */
  const restoreEncryptedWallet = (encryptedMnemonic: string, hdPath: string, passphrase: string) : Wallet => {
    try {
      const mnemonic = Symmetric.decryptString(encryptedMnemonic, passphrase)
      const wallet  = Wallet.fromMnemonic(mnemonic, hdPath)
      setAdminWallet(wallet)
      setWallet(wallet)
      return wallet
    }
    catch (err) {
      throw new InvalidPassphraseError()
    }
  }

  if (role == WalletRoles.VOTER) {
    return { wallet: voterWallet, setWallet: setVoterWallet, checkingNeedsSignin, restoreEncryptedWallet }
  }
  else {
    return { wallet: adminWallet, setWallet: setAdminWallet, checkingNeedsSignin, restoreEncryptedWallet }
  }
}

// CONTEXT

const UseWalletContext = createContext<{
  /** The wallet currently available for use */
  adminWallet?: Wallet,
  voterWallet?: Wallet,
  /** Whether the current route needs a wallet and a Loading message should be displayed */
  checkingNeedsSignin: boolean,
  setAdminWallet: (w: Wallet) => void
  setVoterWallet: (w: Wallet) => void
}>({
  adminWallet: null,
  voterWallet: null,
  checkingNeedsSignin: false,
  setAdminWallet: (_) => { },
  setVoterWallet: (_) => { },
})

export function UseWalletContextProvider({ children }) {
  const [adminWallet, setAdminWallet] = useState<Wallet>(null)
  const [voterWallet, setVoterWallet] = useState<Wallet>(null)
  const router = useRouter()
  const [checkingNeedsSignin, setCheckingNeedsSignin] = useState<boolean>(
    () => pathRequiresAdminSignin(router.pathname, adminWallet)
  )

  // Prevent accidental logout
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent): void => {
      if (adminWallet || voterWallet) {
        // Cancel the event
        e.preventDefault() // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = ''
      }
    }

    window.addEventListener("beforeunload", beforeUnload)

    return () => window.removeEventListener("beforeunload", beforeUnload)
  }, [adminWallet, voterWallet])

  useEffect(() => {
    if (pathRequiresAdminSignin(router.pathname, adminWallet)) {
      // The current path requires an active wallet but there is none
      router.replace(ENTITY_SIGN_IN_PATH)
    } else if (checkingNeedsSignin) {
      setCheckingNeedsSignin(false)
    }
  }, [router.pathname, adminWallet])

  return <UseWalletContext.Provider value={{ adminWallet, voterWallet, checkingNeedsSignin, setAdminWallet, setVoterWallet }}>
    {children}
  </UseWalletContext.Provider>
}

// HELPERS

const pathRequiresAdminSignin = (path: string, wallet: Wallet): boolean => (
  pathsRequiringAdminWallet.includes(path) && !wallet
)
