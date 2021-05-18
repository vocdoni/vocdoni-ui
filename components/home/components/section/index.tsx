import React from 'react'

import { Typography, TypographyVariant } from '@components/elements/typography'
import { FlexAlignItem, FlexContainer } from '@components/flex'
import { Grid, Column } from '@components/grid'

import styled from 'styled-components'
import { colors } from 'theme/colors'

interface ISplitSection {
  reverse?: boolean
  subtitle: string
  title: string
  textContent: string
  imageSrc: string
  imageAltText: string
}

export const SplitSection = ({
  reverse = false,
  subtitle,
  title,
  textContent,
  imageSrc,
  imageAltText,
}: ISplitSection) => (
  <SectionWrapper>
    <SectionContainer>
      <CustomGrid reverse={reverse}>
        <Column sm={12} md={6}>
          <ImageContainer>
            <img src={imageSrc} alt={imageAltText} />
          </ImageContainer>
        </Column>

        <Column sm={12} md={6}>
          <FlexContainer height="100%" alignItem={FlexAlignItem.Center}>
            <TextContainer>
              <Typography
                variant={TypographyVariant.Small}
                color={colors.accent1}
              >
                {subtitle}
              </Typography>
              <Typography
                variant={TypographyVariant.H1}
                color={colors.blueText}
              >
                {title}
              </Typography>
              <Typography
                variant={TypographyVariant.Small}
                color={colors.blueText}
              >
                {textContent}
              </Typography>
            </TextContainer>
          </FlexContainer>
        </Column>
      </CustomGrid>
    </SectionContainer>
  </SectionWrapper>
)

const CustomGrid = styled(Grid)<{reverse?: boolean}>`
  flex-direction: ${({reverse}) => reverse? 'row-reverse': 'row'}
`
const TextContainer = styled.div`
  max-width: 450px;
`
const ImageContainer = styled.div`
  max-width: 500px;
  margin: auto;
  & > img {
    width: 100%;
  }
`

const SectionWrapper = styled.section`
  padding: 30px 0;
`

const SectionContainer = styled.div``
