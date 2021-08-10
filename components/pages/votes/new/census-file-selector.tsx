import React, { useState } from 'react'
import FileSelector from 'react-rainbow-components/components/FileSelector'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { SpreadSheetReader } from '@lib/spread-sheet-reader'

const containerStyles = {
  height: 385,
  borderRadius: 10,
}

interface ICensusFileSelector {
  onXlsLoad: (xls: SpreadSheetReader) => void
}

export const CensusFileSelector = ({onXlsLoad}:ICensusFileSelector) => {
  const { i18n } = useTranslation()
  const [invalidFileType, setInvalidFileType] = useState<string | null>()

  const handleChange = (files: FileList) => {
    const file = files[0]

    if (!file) {
      return setInvalidFileType(null)
    } else if (!SpreadSheetReader.AcceptedTypes.includes(file.type)) {
      return setInvalidFileType(i18n.t('vote.invalid_file_type'))
    }

    const spreadSheetReader = new SpreadSheetReader(file)

    spreadSheetReader.onLoad((reader: SpreadSheetReader) => {
      try {
        reader.validateDataIntegrity()

        onXlsLoad(reader)
      } catch (error) {
        setInvalidFileType(i18n.t('vote.invalid_xls_file'))
      }
    })
  }

  return (
    <div>
      <FileSelector
        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
        style={containerStyles}
        accept="xls,csv,ods"
        error={invalidFileType}
        uploadIcon={
          <ExcelImageContainer>
            <img src="/images/vote/excel.svg" alt="Excel" />
          </ExcelImageContainer>
        }
        placeholder={i18n.t('vote.supported_formats_csv_xls_and_ods')}
        variant="multiline"
        onChange={handleChange}
      />
    </div>
  )
}

const ExcelImageContainer = styled.div`
  width: 86px;

  & > img {
    max-width: 100%;
  }
`
