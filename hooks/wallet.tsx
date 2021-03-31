import { Wallet } from '@ethersproject/wallet'
import { useState } from 'react'

interface WalletContext {
  locked: boolean,
  wallet: Wallet,
}

export const UseWalletContext = createContext<WalletContext>({
  locked: true,
  wallet: null,
})


export const UseWalletProvider = ({children}: {children: ReactNode}) => {
  const [locked, setLocked] = useState<boolean>(true)

  return (
    <UseWalletContext.Provider value={{locked}}>
      {children}
    </UseWalletContext.Provider>
  )
}
