import React, { useEffect, useState } from 'react'
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
    let disposed = false

    if (!ipfsRegex.test(props.src)) {
      if (props.src != imageSrc) {
        setImageSrc(props.src)
      }
      return () => { }
    }

    poolPromise
      .then((pool) => {
        if (disposed) return null
        return FileApi.fetchBytes(props.src, pool.activeGateway)
      }).then(fileBytes => {
        if (disposed || !fileBytes) return
        const mimeType = getMimeType(Uint8Array.from(fileBytes))

        const dataUrl = `data:${mimeType};base64,${fileBytes.toString('base64')}`
        setImageSrc(dataUrl)
      })
      .catch(err => {
        if (disposed) return
        setImageSrc(DEFAULT_IMAGE)
      })

    return () => { disposed = true }
  }, [props.src])

  return <img {...props} src={imageSrc} />
}

// Helpers

function getMimeType(bytes: Uint8Array) {
  const word = bytes.subarray(0, 4)
  let header = ""
  for (let i = 0; i < word.length; i++) {
    header += word[i].toString(16)
  }

  switch (header) {
    case "89504e47":
      return "image/png"
    case "47494638":
      return "image/gif"
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg"
  }

  const word2 = bytes.subarray(0, 12)
  header = ""
  for (let i = 0; i < word2.length; i++) {
    header += word2[i].toString(16)
  }
  if (header.startsWith("52494646") &&
    header.endsWith("57454250")) {
    return "image/webp"
  }

  return "unknown"
}
