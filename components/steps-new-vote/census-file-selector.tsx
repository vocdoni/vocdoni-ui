import React, { useState } from 'react'
import { FileSelector } from 'react-rainbow-components'
import styled from 'styled-components'

import { XlsReader } from '../../lib/xls-reader'
import i18n from '../../i18n'

const containerStyles = {
  height: 385,
  borderRadius: 10,
}

interface ICensusFileSelector {
  onXlsLoad: (xls: XlsReader) => void
}

export const CensusFileSelector = ({onXlsLoad}:ICensusFileSelector) => {
  const [invalidFileType, setInvalidFileType] = useState<string | null>()

  const handleChange = (files: FileList) => {
    const file = files[0]

    if (!file) {
      return setInvalidFileType(null)
    } else if (!XlsReader.AcceptedTypes.includes(file.type)) {
      return setInvalidFileType(i18n.t('vote.invalid_file_type'))
    }

    const xlsReader = new XlsReader(file)

    xlsReader.onLoad((reader: XlsReader) => {
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
