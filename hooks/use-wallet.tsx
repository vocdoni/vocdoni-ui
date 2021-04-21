import { useState, createContext, useContext, useEffect } from 'react'
import { Wallet } from '@ethersproject/wallet'
import { Symmetric } from 'dvote-js'

import { PATH_WITH_WALLET, SIGN_IN_PATH } from '../const/routes'

import i18n from '../i18n'

export const useWallet = () => {
  const walletCtx = useContext(UseWalletContext)
  if (walletCtx === null) {
    throw new Error('useWallet() can only be used on the descendants of <UseWalletContextProvider />,')
  }
  const { wallet, setWallet } = walletCtx

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

  return { wallet, setWallet, restoreEncryptedWallet }
}

// CONTEXT

const UseWalletContext = createContext<{
  wallet: Wallet,
  setWallet: (w: Wallet) => void
}>({
  wallet: null,
  setWallet: (_) => { },
})

export function UseWalletContextProvider({ children }) {
  const [wallet, setWallet] = useState<Wallet>(null)

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

  return <UseWalletContext.Provider value={{ wallet, setWallet }}>
    {children}
  </UseWalletContext.Provider>
}
