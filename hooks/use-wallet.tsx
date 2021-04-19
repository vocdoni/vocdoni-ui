import { useState, createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Wallet } from '@ethersproject/wallet'
import { Symmetric } from 'dvote-js'

import { CREATE_PROPOSAL_PATH, DASHBOARD_PATH, SIGN_IN_PATH } from '../const/routes'

import i18n from '../i18n'

const routesRequireWallet = [
  DASHBOARD_PATH,
  CREATE_PROPOSAL_PATH
]

const redirectSignIn = (path: string, wallet: Wallet): boolean => (
  routesRequireWallet.includes(path) && !wallet
)

export const useWallet = () => {
  const walletCtx = useContext(UseWalletContext)
  if (walletCtx === null) {
    throw new Error('useWallet() can only be used on the descendants of <UseWalletContextProvider />,')
  }
  const { wallet, setWallet, loadingWallet } = walletCtx

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

  return { wallet, setWallet, loadingWallet, restoreEncryptedWallet }
}

// CONTEXT

const UseWalletContext = createContext<{
  wallet: Wallet,
  loadingWallet: boolean,
  setWallet: (w: Wallet) => void
}>({
  wallet: null,
  loadingWallet: false,
  setWallet: (_) => { },
})

export function UseWalletContextProvider({ children }) {
  const [wallet, setWallet] = useState<Wallet>(null)
  const [loadingWallet, setLoadingWallet] = useState<boolean>(true)
  const router = useRouter();

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
    if (redirectSignIn(router.pathname, wallet)) {
      router.replace(SIGN_IN_PATH)
    } else if (loadingWallet) {
      setLoadingWallet(false);
    }
  }, [router.pathname])

  return <UseWalletContext.Provider value={{ wallet, loadingWallet, setWallet }}>
    {children}
  </UseWalletContext.Provider>
}
