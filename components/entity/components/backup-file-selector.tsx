import React, { useState } from 'react'
import { FileSelector } from 'react-rainbow-components'
import styled from 'styled-components'

import i18n from '@i18n'


const containerStyles = {
  height: 260,
  marginBottom: 14,
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

    try {
      const buffer = await file.arrayBuffer()
      const backup = Buffer.from(buffer)

      onBackupLoad(backup)
    } catch (error) {
      setInvalidFileType(i18n.t('import.invalid_imported_file'))
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
        placeholder={i18n.t('import.account_backup_file')}
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