import { useEffect, useState } from 'react'
import { usePool } from '@vocdoni/react-hooks'
import { VotingApi } from 'dvote-js'

export function useBlockNumber() {
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

  return { blockNumber, updateBlockNumber }
}
