import React from 'react'
import styled from 'styled-components'


import { InputFormGroup } from '@components/blocks/form'
import { Button, ButtonColor } from '@components/elements/button'
import { SectionText } from '@components/elements/text'
import { useTranslation } from 'react-i18next'

interface ICensusFileDataProps {
  fileName: string
  censusSize: number
  fileHeaders: string[]
  onChangeFile: () => void
}

export const CensusFileData = ({
  fileName,
  censusSize,
  fileHeaders,
  onChangeFile,
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

        <Button border color={ButtonColor.Positive} onClick={onChangeFile}>
          {i18n.t('vote.upload_different_document')}
        </Button>
      </FileContainer>

      <CensusFieldsContainer>
        <SectionText>
          {i18n.t(
            'vote.this_is_the_form_that_your_community_will_need_to_fill_in_order_to_vote'
          )}
        </SectionText>

        <CensusFieldSummary>
          {fileHeaders.map((headerName: string, index: number) => (
            <InputFormGroup
              key={index}
              label={headerName}
              onChange={voidImplementation}
              value=""
            />
          ))}
        </CensusFieldSummary>
      </CensusFieldsContainer>
    </ConsensusFileDataContainer>
  )
}

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
  max-width: 604px;
  width: 100%;
  margin: auto;
`
