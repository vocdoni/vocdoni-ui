import { useState, createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Wallet } from '@ethersproject/wallet'
import { Symmetric } from 'dvote-js'

import { CREATE_PROPOSAL_PATH, DASHBOARD_PATH, SIGN_IN_PATH } from '../const/routes'

import i18n from '../i18n'

const pathsRequiringWallet = [
  DASHBOARD_PATH,
  CREATE_PROPOSAL_PATH
]

export const useWallet = () => {
  const walletCtx = useContext(UseWalletContext)
  if (walletCtx === null) {
    throw new Error('useWallet() can only be used on the descendants of <UseWalletContextProvider />,')
  }
  const { wallet, setWallet, checkingNeedsSignin } = walletCtx

  /** Decrypts the private key and sets the current wallet from it */
  const restoreEncryptedWallet = (encryptedMnemonic: string, hdPath: string, passphrase: string) => {
    try {
      const mnemonic = Symmetric.decryptString(encryptedMnemonic, passphrase)
      setWallet(Wallet.fromMnemonic(mnemonic, hdPath))
    }
    catch (err) {
      throw new Error(i18n.t("errors.invalid_passphrase"))
    }
  }

  return { wallet, setWallet, checkingNeedsSignin, restoreEncryptedWallet }
}

// CONTEXT

const UseWalletContext = createContext<{
  /** The wallet currently available for use */
  wallet: Wallet,
  /** Whether the current route needs a wallet and a Loading message should be displayed */
  checkingNeedsSignin: boolean,
  setWallet: (w: Wallet) => void
}>({
  wallet: null,
  checkingNeedsSignin: false,
  setWallet: (_) => { },
})

export function UseWalletContextProvider({ children }) {
  const [wallet, setWallet] = useState<Wallet>(null)
  const router = useRouter();
  const [checkingNeedsSignin, setCheckingNeedsSignin] = useState<boolean>(
    () => pathRequiresSignin(router.pathname, wallet)
  )

  // Prevent accidental logout
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent): void => {
      if (wallet) {
        // Cancel the event
        e.preventDefault() // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = ''
      }
    }

    window.addEventListener("beforeunload", beforeUnload)

    return () => window.removeEventListener("beforeunload", beforeUnload)
  }, [wallet])

  useEffect(() => {
    if (pathRequiresSignin(router.pathname, wallet)) {
      // The current path requires an active wallet but there is none
      router.replace(SIGN_IN_PATH)
    } else if (checkingNeedsSignin) {
      setCheckingNeedsSignin(false);
    }
  }, [router.pathname, wallet])

  return <UseWalletContext.Provider value={{ wallet, checkingNeedsSignin, setWallet }}>
    {children}
  </UseWalletContext.Provider>
}

// HELPERS

const pathRequiresSignin = (path: string, wallet: Wallet): boolean => (
  pathsRequiringWallet.includes(path) && !wallet
)
