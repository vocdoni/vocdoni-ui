import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode
} from 'react'
import { DVoteGateway } from 'dvote-js'
import { Nullable } from '@vocdoni/react-hooks'

interface BackendContext {
  error: Nullable<string>,
  bk: DVoteGateway,
  bkPromise: Promise<DVoteGateway>,
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
  const [bk, setBk] = useState<DVoteGateway>(() => new DVoteGateway({
    supportedApis: ['registry'],
    uri: process.env.BACKEND_URL,
    publicKey: process.env.BACKEND_PUB_KEY,
  }))
  let bkPromise: Promise<DVoteGateway>
  let resolveBackendPromise: (bk: DVoteGateway) => any

  useEffect(() => {
    setLoading(true)
    try {
      bk.init().then(() => {
        setLoading(false)
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
    bkPromise = new Promise<DVoteGateway>((resolve) => {
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
