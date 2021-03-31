import { Wallet } from '@ethersproject/wallet'
import { Symmetric } from 'dvote-js'
import { Buffer } from "buffer/"
import { useState, createContext, useContext, useEffect } from 'react'
import i18n from '../i18n'

export const useWallet = () => {
  const walletCtx = useContext(UseWalletContext)
  if (walletCtx === null) {
    throw new Error('useWallet() can only be used on the descendants of <UseWalletContextProvider />,')
  }
  const { wallet, setWallet } = walletCtx

  /** Decrypts the private key and sets the current wallet from it */
  const setWalletFromEntity = (encryptedPrivKey: string, passphrase: string) => {
    try {
      const privKeyBytes = Symmetric.decryptBytes(encryptedPrivKey, passphrase)
      const hexPrivKey = "0x" + privKeyBytes.toString("hex")
      setWallet(new Wallet(hexPrivKey))
    }
    catch (err) {
      throw new Error(i18n.t("errors.invalid_passphrase"))
    }
  }

  return { wallet, setWallet, setWalletFromEntity }
}

// CONTEXT

const UseWalletContext = createContext<{ wallet: Wallet, setWallet: (w: Wallet) => void }>({ wallet: null, setWallet: (_) => { } })

export function UseWalletContextProvider({ children }) {
  const [wallet, setWallet] = useState<Wallet>(null)

  // Prevent accidental logout
  useEffect(() => {
    window.addEventListener("beforeunload", beforeUnload)

    return () => window.removeEventListener("beforeunload", beforeUnload)
  }, [wallet])

  const beforeUnload = (e: BeforeUnloadEvent): void => {
    if (wallet) {
      // Cancel the event
      e.preventDefault() // If you prevent default behavior in Mozilla Firefox prompt will always be shown
      // Chrome requires returnValue to be set
      e.returnValue = ''
    }
  }

  return <UseWalletContext.Provider value={{ wallet, setWallet }}>
    {children}
  </UseWalletContext.Provider>
}
