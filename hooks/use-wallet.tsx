import { Wallet } from '@ethersproject/wallet'
import { useState, createContext, useContext } from 'react'

export const useWallet = () => {
  const { wallet, setWallet } = useContext(UseWalletContext)

  /** Decrypts the private key and sets the current wallet from it */
  const setWalletFromEntity = (encryptedPrivKey: string, passsphrase: string) => {
    // TODO: Implement from dvote-js
    throw new Error("Unimplemented")
    // setWallet(new Wallet(privKey))
  }

  return { wallet, setWallet, setWalletFromEntity }
}

// CONTEXT

const UseWalletContext = createContext<{ wallet: Wallet, setWallet: (w: Wallet) => void }>({ wallet: null, setWallet: (_) => { } })

export function UseWalletContextProvider({ children }) {
  const [wallet, setWallet] = useState<Wallet>(null)

  return <UseWalletContext.Provider value={{ wallet, setWallet }}>
    {children}
  </UseWalletContext.Provider>
}
