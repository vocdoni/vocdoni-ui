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
        <Typography variant={TypographyVariant.Small}>
          {i18n.t('votes.new.requirements')}
        </Typography>
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
                <DownloadIcon fill={colors.white} width="20px" />{' '}
                <Typography
                  variant={TypographyVariant.Small}
                  color={colors.white}
                  margin="0 0 0 10px"
                >
                  {i18n.t('votes.new.download_template')}
                </Typography>
              </FlexContainer>
            </PositiveButton>
          </LinkButtonWrapper>
        </ButtonContainer>
      </Column>
    </Grid>
  )
}

const ButtonContainer = styled(FlexContainer)`
  height: 174px;
  padding: 20px 28px;
  background-color: rgba(207, 218, 246, 0.15);
  border-radius: 16px;
`

const LinkButtonWrapper = styled.a`
  color: ${colors.white};
`
