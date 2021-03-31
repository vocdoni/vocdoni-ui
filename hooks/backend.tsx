import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode
} from 'react'
import { DVoteGateway, GatewayPool } from 'dvote-js'
import { Nullable } from './types'

interface BackendContext {
  loading: boolean,
  error: Nullable<string>,
  refresh: () => void,
  gw: DVoteGateway,
  gwPromise: Promise<DVoteGateway>,
}

export const UseBackendContext = createContext<BackendContext>({
  gw: null,
  gwPromise: null as any,
  loading: false,
  error: null,
  refresh: () => {}
})

export function useBackend() {
  const poolContext = useContext(UseBackendContext)
  if (poolContext === null) {
    throw new Error(
      'usePool() can only be used on the descendants of <UsePoolProvider />, ' +
        'please declare it at a higher level.'
    )
  }
  return poolContext
}

export function UseBackendProvider({
  children
}: {
  children: ReactNode
}) {
  let gw : DVoteGateway = null
  // Promise holder for requests arriving before the pool is available
  let resolveGwPromise: (pool: DVoteGateway) => any
  let gwPromise: Promise<DVoteGateway>

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Nullable<string>>(null)

  // Initial load
  useEffect(async () => {
    setLoading(true)

    try {
      gw = new DVoteGateway({
        supportedApis: ['registry'],
        uri: process.env.BACKEND_URL,
        publicKey: process.env.BACKEND_PUB_KEY,
      })

      await gw.init()

      setLoading(false)

      return gw
    } catch (e) {
      setLoading(false)
      setError(e?.message)

      throw e // not sure about this...
    }

    // Cleanup
    return () => {
      gw = null
      gwPromise = null
    }
  }, [])

  return (
    <UseBackendContext.Provider
      value={{ gw, gwPromise, loading, error }}
    >
      {children}
    </UseBackendContext.Provider>
  )
}
