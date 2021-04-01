import { BigNumber } from '@ethersproject/bignumber'
import { Wallet } from '@ethersproject/wallet'
import { Symmetric } from 'dvote-js'
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

  const waitForGas = async (retries: number = 25) => {
    while (retries >= 0) {
      if (!wallet) {
        await new Promise(r => setTimeout(r, 2000)) // Wait 2s
        if (!wallet) continue
      }
      else if ((await wallet.provider.getBalance(wallet.address)).gt(BigNumber.from(0))) {
        return true
      }

      await new Promise(r => setTimeout(r, 2000)) // Wait 2s
      retries--
    }
    return false
  }

  return { wallet, setWallet, setWalletFromEntity, waitForGas }
}

// CONTEXT

const UseWalletContext = createContext<{
  wallet: Wallet,
  setWallet: (w: Wallet) => void
  waitForGas?: () => boolean,
}>({
  wallet: null,
  setWallet: (_) => { },
})

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
