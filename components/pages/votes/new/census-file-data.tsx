import React from 'react'
import styled from 'styled-components'

import { FormGroupVariant, InputFormGroup } from '@components/blocks/form'
import { SectionText } from '@components/elements/text'
import { useTranslation } from 'react-i18next'
import { UploadFileButton } from './components/upload-new-document-button'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { colors } from '@theme/colors'

interface ICensusFileDataProps {
  fileName: string
  censusSize: number
  fileHeaders: string[]
  onUploadFile: (files: FileList) => void
}

export const CensusFileData = ({
  fileName,
  censusSize,
  fileHeaders,
  onUploadFile,
}: ICensusFileDataProps) => {
  const { i18n } = useTranslation()

  const voidImplementation = () => {}
  return (
    <ConsensusFileDataContainer>
      <FileContainer>
        <FileDataContainer>
          <img src="/images/vote/excel.svg" alt="Excel logo" />

          <div>
            <FileName>{fileName}</FileName>
            <CensusLength>
              {i18n.t('vote.census_size', { size: censusSize })}
            </CensusLength>
          </div>
        </FileDataContainer>

        <UploadFileButton onChange={onUploadFile} />
      </FileContainer>

      <CensusFieldsContainer>
        <FormPreviewTag>{i18n.t('votes.new.form_preview')}</FormPreviewTag>

        <Typography variant={TypographyVariant.Small} color={colors.lightText}>
          {i18n.t(
            'vote.this_is_the_form_that_your_community_will_need_to_fill_in_order_to_vote'
          )}
        </Typography>

        <CensusFieldSummary>
          {fileHeaders.map((headerName: string, index: number) => (
            <InputFormGroup
              key={index}
              label={headerName}
              onChange={voidImplementation}
              variant={FormGroupVariant.Small}
              value=""
            />
          ))}
        </CensusFieldSummary>
      </CensusFieldsContainer>
    </ConsensusFileDataContainer>
  )
}

const FormPreviewTag = styled.div`
  background-color: #7c80f2;
  line-height: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
  display: inline-block;
  padding: 2px 12px;
  border-radius: 40px;
  height: 20px;
  margin-bottom: 6px;
`

const ConsensusFileDataContainer = styled.div`
  border: dashed 1px rgba(215, 217, 226, 1);
  border-radius: 20px;
  padding: 38px;
`

const FileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`
const FileDataContainer = styled.div`
  display: flex;
  align-items: center;

  & > img {
    width: 50px;
    margin-right: 20px;
  }
`
const FileName = styled.p`
  font-size: 22px;
  line-height: 1.3em;
  margin: 0;
`

const CensusLength = styled(SectionText)`
  color: ${({ theme }) => theme.accent1};
  margin: 0;
`

const CensusFieldsContainer = styled.div`
  background-color: ${({ theme }) => theme.background};
  padding: 30px;
`

const CensusFieldSummary = styled.div`
  max-width: 490px;
  width: 100%;
  margin: auto;
`
