import { createContext, useContext, useEffect, useState } from 'react'
import { usePool } from '@vocdoni/react-hooks'
import { VotingApi } from 'dvote-js'


const UseBlockNumberContext = createContext({ blockNumber: 0, updateBlockNumber: () => {} })

export function useBlockNumber() {
  const blockCtx = useContext(UseBlockNumberContext)
  if (blockCtx === null) {
    throw new Error('useWallet() can only be used on the descendants of <UseWalletContextProvider />,')
  }
  return blockCtx
}

export function UseBlockNumberProvider({ children }) {
  const [blockNumber, setBlockNumber] = useState(0)
  const { poolPromise } = usePool()


  const updateBlockNumber = async () => {
    poolPromise
      .then((pool) => VotingApi.getBlockHeight(pool))
      .then((num) => {
        setBlockNumber(num)
      })
      .catch((err) => console.error(err))
  };

  useEffect(() => {
    const interval = setInterval(() => updateBlockNumber(), 1000 * 13)
    updateBlockNumber()

    // Done
    return () => clearInterval(interval)
  }, []);



  return <UseBlockNumberContext.Provider value={{ blockNumber, updateBlockNumber }}>
    {children}
  </UseBlockNumberContext.Provider>
}
