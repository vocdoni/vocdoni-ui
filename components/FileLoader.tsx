import React, { useEffect, useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'

import i18n from '../i18n'
import { Button } from './button'
import { Input } from './inputs'

const BROWSE_BUTTON_WIDTH = 140

type Props = {
  accept?: string,
  file?: File,
  url?: string,
  onSelect: (file: File) => void,
  onChange: (url: string) => void,
}

const FileLoader = ({ onSelect, onChange, accept, ...props }: Props) => {
  const [file, setFile] = useState<File>(null)
  const [error, setError] = useState<string>(null)
  const [fileUrl, setFileUrl] = useState<string>('')
  // const [fileName, setFileName] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.file && props.file != file) {
      setFile(props.file)
    }
    if (props.url && props.url != fileUrl) {
      setFileUrl(props.url)
    }
  }, [])

  const onFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const [file] = Array.from(e.target.files)

    if (file.size >= 5 * 1024 * 1024) {
      setError(i18n.t('errors.file_too_large'))
      return
    }

    setFile(file)

    // Only return if valid
    if (typeof onSelect === 'function') {
      onSelect(file)
    }
  }

  const handleCleanFile = (e) => {
    inputRef.current.value = ''

    onChange('')
    onSelect(null)
    setFile(null)
    setFileUrl(null)
    setError(null)
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
    setError(null)
    if (typeof onSelect === 'function') {
      onSelect(null)
    }

    setFile(null)
  }

  const input = {
    accept: accept ? accept : '*'
  }

  return <>
    <div>
      <If condition={!file}>
        <Then>
          <MyInput
            type='text'
            placeholder={i18n.t("input.enter_the_url_or_upload_a_file")}
            value={fileUrl}
            onChange={onFileUrlChange}
          />
        </Then>
        <Else>
          <MyInput
            type='text'
            readOnly
            value={file?.name}
            title={i18n.t("input.remove_file")}
          />
        </Else>
      </If>
      <input
        type='file'
        ref={inputRef}
        onChange={onFilesSelect}
        style={{ display: 'none' }}
        {...input}
      />
      <If condition={!file}>
        <Then>
          <Button positive width={BROWSE_BUTTON_WIDTH} onClick={() => inputRef.current.click()}>
            {i18n.t('action.browse')}
          </Button>
        </Then>

        <Else>
          <Button border width={BROWSE_BUTTON_WIDTH} onClick={handleCleanFile}>
            {i18n.t('action.clean')}
          </Button>
        </Else>
      </If>
    </div>
    <If condition={error}>
      <ErrorMsg>{error}</ErrorMsg>
    </If>
  </>
}

const ErrorMsg = styled.span`
color: ${({ theme }) => theme.textAccent2B};
`

const MyInput = styled(Input)`
margin-right: 10px;
width: calc(100% - ${BROWSE_BUTTON_WIDTH}px - 10px);
`

export default FileLoader
