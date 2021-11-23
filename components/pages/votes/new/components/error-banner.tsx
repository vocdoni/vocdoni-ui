import React from 'react'
import styled from 'styled-components'
import { Banner, BannerSize, BannerVariant } from '@components/blocks/banner_v2'
import { FlexAlignItem, FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { useTranslation } from 'react-i18next'
import { colors } from '@theme/colors'
import { Button, ButtonColor } from '@components/elements/button'
import { ImageContainer } from '@components/elements/images'
import { UploadFileButton } from './upload-new-document-button'

interface IErrorBannerProps {
  fileName: string
  fileErrorMessage: string
  onUploadFile: (files: FileList) => void
}

export const ErrorBanner = ({
  fileName,
  fileErrorMessage,
  onUploadFile,
}: IErrorBannerProps) => {
  const { i18n } = useTranslation()

  return (
    <Banner
      icon={<img src="/images/vote/warning.svg" />}
      variant={BannerVariant.Secondary}
      size={BannerSize.Small}
    >
      <FlexContainer alignItem={FlexAlignItem.Center} justify={FlexJustifyContent.SpaceBetween}>
        <TextContainer>
          <Typography
            variant={TypographyVariant.Small}
            color={colors.warningText}
            margin="0 0 8px 0"
          >
            {i18n.t(
              'votes.new.the_document_name_that_you_updated_do_not_fill',
              { documentName: fileName }
            )}
          </Typography>
          <Typography
            variant={TypographyVariant.ExtraSmall}
            color={colors.blueText}
            margin="0"
          >
            {fileErrorMessage}
          </Typography>
        </TextContainer>

        <div>
          <UploadFileButton onChange={onUploadFile}/>
        </div>
      </FlexContainer>
    </Banner>
  )
}


const TextContainer = styled.div`
  padding-right: 20px;
`