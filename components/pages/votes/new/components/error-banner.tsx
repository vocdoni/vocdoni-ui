import React from 'react'
import styled from 'styled-components'
import { Banner, BannerSize, BannerVariant } from '@components/blocks/banner_v2'
import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
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
      icon={<img src="/images/vote/warning.png" />}
      variant={BannerVariant.Secondary}
      size={BannerSize.Small}
    >
      <FlexContainer alignItem={FlexAlignItem.Center}>
        <div>
          <Typography
            variant={TypographyVariant.Body2}
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
        </div>

        <div>
          <UploadFileButton onChange={onUploadFile}/>
        </div>
      </FlexContainer>
    </Banner>
  )
}

