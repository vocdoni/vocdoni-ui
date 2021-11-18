import React, { useState } from 'react'
import FileSelector from 'react-rainbow-components/components/FileSelector'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { SpreadSheetReader } from '@lib/spread-sheet-reader'
import {
  TextAlign,
  Typography,
  TypographyVariant,
} from '@components/elements/typography'
import { ImageContainer } from '@components/elements/images'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'

const containerStyles = {
  height: 238,
  borderRadius: 16,
}

interface ICensusFileSelector {
  onXlsLoad: (xls: SpreadSheetReader) => void
}

export const CensusFileSelector = ({ onXlsLoad }: ICensusFileSelector) => {
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
          <TextContainer>
            <FlexContainer justify={FlexJustifyContent.Center}>
              <ImageContainer width="70px">
                <img src="/images/vote/excel.svg" alt="Excel" />
              </ImageContainer>
            </FlexContainer>

            <TextContainer>
              <Typography
                variant={TypographyVariant.Body1}
                margin="10px 0 0 0"
                align={TextAlign.Center}
              >
                {i18n.t('votes.new.upload_or_drag_and_drop_here_the_list')}
              </Typography>

              <Typography
                variant={TypographyVariant.ExtraSmall}
                margin="10px 0 0 0"
                align={TextAlign.Center}
              >
                {i18n.t('votes.new.supported_formats_csv_xls')}
              </Typography>
            </TextContainer>
          </TextContainer>
        }
        placeholder={''}
        variant="multiline"
        onChange={handleChange}
      />
    </div>
  )
}

const TextContainer = styled.div`
  width: 500px;

  @media ${({ theme }) => theme.screenMax.tablet} {
    width: 400px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    width: 300px;
  }

  @media ${({ theme }) => theme.screenMax.mobileM} {
    width: 240px;
  }

  @media ${({ theme }) => theme.screenMax.mobileS} {
    width: 200px;
  }
`
