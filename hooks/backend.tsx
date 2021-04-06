import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode
} from 'react'
import { DVoteGateway, GatewayPool } from 'dvote-js'
import { Nullable } from '@vocdoni/react-hooks'

interface BackendContext {
  error: Nullable<string>,
  gw: DVoteGateway,
  gwPromise: Promise<DVoteGateway>,
  loading: boolean,
  setLoading?(loading: boolean): void,
  setError?(error: string): void,
}

export const UseBackendContext = createContext<BackendContext>({
  loading: false,
  gw: null,
  gwPromise: null,
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
  const [gw, setGw] = useState<DVoteGateway>(() => new DVoteGateway({
    supportedApis: ['registry'],
    uri: process.env.BACKEND_URL,
    publicKey: process.env.BACKEND_PUB_KEY,
  }))
  let gwPromise : Promise<DVoteGateway>
  let resolveGwPromise : (gw: DVoteGateway) => any

  useEffect(() => {
    setLoading(true)
    try {
      gw.init().then(() => {
        setLoading(false)
        resolveGwPromise?.(gw)

        return gw
      })
    } catch (e) {
      setError(e)
    }
  }, [])

  // Ensure that by default, resolvePool always has a promise
  if (gw === null) {
    gwPromise = new Promise<DVoteGateway>((resolve) => {
      resolveGwPromise = resolve
    })
  } else {
    gwPromise = Promise.resolve(gw)
  }

  return (
    <UseBackendContext.Provider value={{ gw, gwPromise, loading, error, setError, setLoading }}>
      {children}
    </UseBackendContext.Provider>
  )
}
