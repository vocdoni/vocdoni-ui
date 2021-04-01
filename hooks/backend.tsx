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
  loading: boolean,
  setLoading?(loading: boolean): void,
  setError?(error: string): void,
}

export const UseBackendContext = createContext<BackendContext>({
  loading: false,
  gw: null,
  error: null,
})

export function useBackend() {
  const bkContext = useContext(UseBackendContext)
  let {loading, error, setError} = bkContext

  if (bkContext === null) {
    throw new Error(
      'useBackend() can only be used on the descendants of <UseBackendProvider />, ' +
        'please declare it at a higher level.'
    )
  }

  let gw : DVoteGateway = null
  try {
    gw = new DVoteGateway({
      supportedApis: ['registry'],
      uri: process.env.BACKEND_URL,
      publicKey: process.env.BACKEND_PUB_KEY,
    })

    gw.init()
  } catch (e) {
    setError(e)
  }

  return {
    gw,
    error,
    loading,
  }
}

export function UseBackendProvider({
  children
}: {
  children: ReactNode
}) {
  let gw : DVoteGateway = null
  // Promise holder for requests arriving before the pool is available
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Nullable<string>>(null)

  return (
    <UseBackendContext.Provider value={{ gw, loading, error, setError, setLoading }}>
      {children}
    </UseBackendContext.Provider>
  )
}
