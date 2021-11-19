import React from 'react'
import styled from 'styled-components'
import { Button, ButtonColor } from '@components/elements/button'
import { useTranslation } from 'react-i18next'

interface InputFileContainerProps {
  onChange: (event: FileList) => void
}

export const UploadFileButton = ({ onChange }: InputFileContainerProps) => {
  const { i18n } = useTranslation()

  return (
    <>
      <label htmlFor="file-upload">
        <Button color={ButtonColor.Positive}>
          <IconContainer>
            <img src="/images/vote/upload-icon.png" />
          </IconContainer>

          {i18n.t('votes.new.upload_new_document')}
        </Button>
      </label>
      <InputFileContainer>
        <input
          type="file"
          id="file-upload"
          onChange={(e) => onChange && onChange(e.target.files)}
        />
      </InputFileContainer>
    </>
  )
}

const IconContainer = styled.div`
  min-width: 20px;
  width: 20px;
  min-height: 20px;
  margin: 0 14px 0 0;

  & > img {
    margin-top: 3px;
    width: 100%;
  }
`

const InputFileContainer = styled.div`
  display: none;
`
