import { Wallet } from '@ethersproject/wallet'
import { FileApi, GatewayPool } from 'dvote-js'
import React, { useEffect, useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'

import i18n from '../i18n'
import { FileReaderPromise } from '../lib/file'
import { Button } from './button'
import { Input } from './inputs'

type Props = {
  accept?: string,
  file?: File,
  url?: string,
  onSelect: (file: File) => void,
  onChange: (url: string) => void,
}

export const IPFSUpload = async (pool: GatewayPool, wallet: Wallet, file: File) => {
  const buffer = await FileReaderPromise(file)

  return await FileApi.add(buffer, file.name, wallet, pool)
}

const FileLoader = ({ onSelect, onChange, accept, ...props }: Props) => {
  const [file, setFile] = useState<File>(null)
  const [error, setError] = useState<string>(null)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.file) {
      setFile(props.file)
    }
    if (props.url) {
      setFileUrl(props.url)
    }
  }, [])

  const onFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(e.target.files)

    if (file.size >= 5 * 1024 * 1024) {
      setError(i18n.t('errors.file_too_big'))

      return
    }

    setFile(file)

    // Only return if valid
    if (typeof onSelect === 'function') {
      onSelect(file)
    }
  }

  const onFileUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const { value } = e.target
    setFileUrl(value)

    if (value.length && !/^(https?|ipfs):\/\//.test(value)) {
      setError(i18n.t('errors.invalid_image_url'))
      return
    }

    // only pass if it's valid
    if (typeof onChange === 'function') {
      onChange(value)
    }
  }

  const removeFile = () => {
    if (typeof onSelect === 'function') {
      onSelect(null)
    }

    setFile(null)
  }

  const input = {
    accept: '*'
  }

  if (accept?.length) {
    input.accept = accept
  }

  return (
    <div>
      <If condition={!file}>
        <Then>
          <Input
            type='text'
            value={fileUrl}
            onChange={onFileUrlChange}
          />
        </Then>
        <Else>
          <span>
            {file?.name}
            <Button negative onClick={() => removeFile()}>🗑</Button>
          </span>
        </Else>
      </If>
      <input
        type='file'
        ref={inputRef}
        onChange={onFilesSelect}
        style={{ display: 'none' }}
        {...input}
      />
      <Button positive onClick={() => inputRef.current.click()}>
        {i18n.t('examine')}
      </Button>
      <If condition={error}>
        {error}
      </If>
    </div>
  )
}

export default FileLoader
