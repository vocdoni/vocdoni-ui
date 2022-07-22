import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'

import { Button } from '../elements/button'
import { Input } from '../elements/inputs'

const BROWSE_BUTTON_WIDTH = 140

type Props = {
  accept?: string,
  file?: File,
  url?: string,
  error?: string,
  maxMbSize?: number,
  onSelect: (file: File) => void,
  onChange: (url: string) => void,
}

const FileLoader = ({ onSelect, onChange, accept, maxMbSize, ...props }: Props) => {
  const { i18n } = useTranslation()

  const [file, setFile] = useState<File>(null)
  const [error, setError] = useState<string>(props.error)
  const [fileUrl, setFileUrl] = useState<string>('')

  useEffect(() => {
    setError(props.error)
  }, [props.error])
    // const [fileName, setFileName] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const maxSize = maxMbSize || 5

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

    if (file.size >= maxSize * 1024 * 1024) {
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
    <FlexContainer alignItem={FlexAlignItem.Center}>
      <If condition={!file}>
        <Then>
          <Input
            type='text'
            error={!!error}
            wide
            placeholder={i18n.t("input.enter_the_url_or_upload_a_file")}
            value={fileUrl}
            onChange={onFileUrlChange}
          />
        </Then>
        <Else>
          <Input
            type='text'
            readOnly
            wide
            error={!!error}
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
      <ButtonContainer>
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
      </ButtonContainer>
    </FlexContainer>
    <If condition={error}>
      <Then>
        <ErrorMsg>{error}</ErrorMsg>
      </Then>
    </If>
  </>
}

const ErrorMsg = styled.span`
color: ${({ theme }) => theme.danger};
margin-top: -10px;
margin-left: 4px;
font-size: 12px;
font-weight: 500;
position: absolute;
`

const ButtonContainer = styled.div`
  margin-left: 10px;
`

export default FileLoader
