import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import DownloadIcon from 'remixicon/icons/System/download-2-fill.svg'

import { Grid, Column } from '@components/elements/grid'
import {
  TextAlign,
  Typography,
  TypographyVariant,
} from '@components/elements/typography'
import { Li, Ul } from '@components/elements/list'
import {
  FlexAlignItem,
  FlexContainer,
  FlexDirection,
  FlexJustifyContent,
} from '@components/elements/flex'
import { Button, LinkTarget, PositiveButton } from '@components/elements/button'
import { colors } from '@theme/colors'
import { ImageContainer } from '@components/elements/images'

interface IImpotVoterListBaseProps {
  requirements: string[]
  fileName: string
  linkUrl: string
}

export const ImportVoterListBase = ({
  requirements,
  fileName,
  linkUrl,
}: IImpotVoterListBaseProps) => {
  const { i18n } = useTranslation()

  return (
    <Grid>
      <Column sm={12} md={7}>
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <ImageContainer width="22px">
            <img src="/images/vote/info-icon.svg" />
          </ImageContainer>

          <Typography
            variant={TypographyVariant.Small}
            color={colors.accent1}
            margin="0 0 0 12px"
          >
            <strong>{i18n.t('votes.new.requirements')}</strong>
          </Typography>
        </FlexContainer>
        <Ul>
          {requirements.map((requirement, index) => (
            <Li key={`requirements-list-${index}`}>
              <Typography variant={TypographyVariant.MediumSmall}>
                {requirement}
              </Typography>
            </Li>
          ))}
        </Ul>
      </Column>

      <Column sm={12} md={5}>
        <ButtonContainer
          alignItem={FlexAlignItem.Center}
          justify={FlexJustifyContent.Center}
          direction={FlexDirection.Column}
        >
          <Typography
            variant={TypographyVariant.MediumSmall}
            margin="0 0 20px 0"
            align={TextAlign.Center}
          >
            {i18n.t('votes.new.download_the_original_template_to_fill')}
          </Typography>

          <LinkButtonWrapper
            href={linkUrl}
            target={LinkTarget.Blank}
            download={fileName}
          >
            <PositiveButton color={colors.white}>
              <FlexContainer alignItem={FlexAlignItem.Center}>
                <ImageContainer width="20px">
                  <img src="/images/vote/icon-download.svg" />
                </ImageContainer>

                <ButtonTextContainer>
                  {i18n.t('votes.new.download_template')}
                </ButtonTextContainer>
              </FlexContainer>
            </PositiveButton>
          </LinkButtonWrapper>
        </ButtonContainer>
      </Column>
    </Grid>
  )
}

const ButtonTextContainer = styled.span`
  margin-left: 16px;
`

const ButtonContainer = styled(FlexContainer)`
  height: 174px;
  padding: 0px 28px;
  background-color: rgba(207, 218, 246, 0.15);
  border-radius: 16px;
`

const LinkButtonWrapper = styled.a`
  color: ${colors.white};
`
