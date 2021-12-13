import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode
} from 'react'
import { DVoteGateway, IGatewayDVoteClient } from 'dvote-js'
import { Nullable } from '@vocdoni/react-hooks'
import { useSetRecoilState } from 'recoil'
import { backendState } from 'recoil/atoms/backend'

interface BackendContext {
  error: Nullable<string>,
  bk: IGatewayDVoteClient,
  bkPromise: Promise<IGatewayDVoteClient>,
  loading: boolean,
  setLoading?(loading: boolean): void,
  setError?(error: string): void,
}

export const UseBackendContext = createContext<BackendContext>({
  loading: false,
  bk: null,
  bkPromise: null,
  error: null,
})

export function useBackend() {
  const bkContext = useContext(UseBackendContext)

  if (bkContext === null) {
    throw new Error(
      'useBackend() can only be used on the descendants of <UseBackendProvider />, ' +
      'please declare it at a higher level.'
    )
  }

  return bkContext
}

export function UseBackendProvider({
  children
}: {
  children: ReactNode
}) {
  // Promise holder for requests arriving before the pool is available
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Nullable<string>>(null)
  const [bk, setBk] = useState<IGatewayDVoteClient>(() => new DVoteGateway({
    supportedApis: ['registry'],
    uri: process.env.BACKEND_URL,
    publicKey: process.env.BACKEND_PUB_KEY,
  }))
  const setBackend = useSetRecoilState(backendState)
  let bkPromise: Promise<IGatewayDVoteClient>
  let resolveBackendPromise: (bk: IGatewayDVoteClient) => any

  useEffect(() => {
    setLoading(true)
    try {
      bk.init().then(() => {
        setLoading(false)
        setBackend(bk)
        resolveBackendPromise?.(bk)
        setError(null)
        return bk
      })
    } catch (e) {
      setError(e)
    }
  }, [])

  // Ensure that by default, resolvePool always has a promise
  if (bk === null) {
    bkPromise = new Promise<IGatewayDVoteClient>((resolve) => {
      resolveBackendPromise = resolve
    })
  } else {
    bkPromise = Promise.resolve(bk)
  }

  return (
    <UseBackendContext.Provider value={{ bk, bkPromise, loading, error, setError, setLoading }}>
      {children}
    </UseBackendContext.Provider>
  )
}
