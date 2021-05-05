import React, { useEffect, useRef, useState } from 'react'
import { FileApi } from 'dvote-js'
import { usePool } from '@vocdoni/react-hooks'

export enum ImageCrossOrigin {
  Anonymous = 'anonymous',
  UseCredentials = 'use-credentials',
}
interface IImageProps {
  src: string
  alt?: string
  crossorigin?: ImageCrossOrigin
  width?: string
  height?: string
}
const ipfsRegex = /^ipfs:\/\/(.+)/
const DEFAULT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='

export const Image = (props: IImageProps) => {
  const { poolPromise } = usePool()
  const [imageSrc, setImageSrc] = useState<string>(
    ipfsRegex.test(props.src) ? DEFAULT_IMAGE : props.src
  )

  useEffect(() => {
    if (ipfsRegex.test(props.src)) {
      poolPromise.then(async (pool) => {
        const file = await FileApi.fetchBytes(props.src, pool.activeGateway)
        const base64 = `data:image/png;base64,${file.toString('base64')}`

        setImageSrc(base64)
      })
    }
  }, [props.src])

  return <img {...props} src={imageSrc} />
}
