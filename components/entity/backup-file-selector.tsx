import React, { useState } from 'react'
import { FileSelector } from 'react-rainbow-components'
import styled from 'styled-components'

import i18n from '../../i18n'

const containerStyles = {
  height: 385,
  borderRadius: 10,
}

interface IBackupFileSelector {
  onBackupLoad: (backup: Uint8Array) => void
}

export const BackupFileSelector = ({ onBackupLoad }: IBackupFileSelector) => {
  const [invalidFileType, setInvalidFileType] = useState<string | null>()

  const handleChange = async (files: FileList) => {
    const file = files[0]

    if (!file) {
      return setInvalidFileType(null)
    }
    // } else if (!SpreadSheetReader.AcceptedTypes.includes(file.type)) {
    //   return setInvalidFileType(i18n.t('entity.invalid_file_type'))
    // }

    try {
      const buffer = await file.arrayBuffer()
      // TODO check if throws if file incorrect
      const backup = Buffer.from(buffer)

      onBackupLoad(backup)
    } catch (error) {
      setInvalidFileType(i18n.t('entity.invalid_xls_file'))
    }
  }

  return (
    <div>
      <FileSelector
        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
        style={containerStyles}
        accept="bak"
        error={invalidFileType}
        uploadIcon={
          <ImportImageContainer>
            <img src="/images/common/logo.svg" alt="Backup" />
          </ImportImageContainer>
        }
        placeholder={i18n.t('entity.supported_formats_bak')}
        variant="multiline"
        onChange={handleChange}
      />
    </div>
  )
}

const ImportImageContainer = styled.div`
  width: 86px;

  & > img {
    max-width: 100%;
  }
`
