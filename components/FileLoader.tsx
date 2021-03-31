import React, { useEffect, useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'

import i18n from '../i18n'

type Props = {
  accept?: string,
  file?: File,
  url?: string,
  onSelect: (file: File) => void,
  onChange: (url: string) => void,
}

const FileLoader = ({ onSelect, onChange, accept, ...props }: Props) => {
  const [file, setFile] = useState<File>({})
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
    if (typeof onSelect === 'function') {
      onSelect(file)
    }

    setFile(file)
  }

  const onFileUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const {value} = e.target
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
      onSelect({})
    }

    setFile({})
  }

  const input = {
    accept: '*'
  }

  if (accept?.length) {
    input.accept = accept
  }

  return (
    <div>
      <If condition={!file?.size}>
        <Then>
          <input
            type='text'
            value={fileUrl}
            onChange={onFileUrlChange}
          />
        </Then>
        <Else>
          <span>
            {file.name}
            <button onClick={() => removeFile()}>🗑</button>
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
      <button onClick={() => inputRef.current.click()}>
        {i18n.t('examinate')}
      </button>
      <If condition={error}>
        {error}
      </If>
    </div>
  )
}

export default FileLoader
