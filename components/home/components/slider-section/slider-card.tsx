import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'
import { colors } from 'theme/colors'

import { PageCard } from '@components/cards'
import { Typography, TypographyVariant } from '@components/elements/typography'
import {
  FlexAlignItem,
  FlexContainer,
  FlexDirection,
  FlexJustifyContent,
} from '@components/flex'
import { ImageContainer } from '@components/images'

interface ISliderCardProps {
  image: string
  logo: string
  backgroundImage: string
  quote: string
  authorName: string
  authorImage: string
  authorPosition: string
}
export const SliderCard = ({
  image,
  logo,
  backgroundImage,
  quote,
  authorName,
  authorImage,
  authorPosition,
}: ISliderCardProps) => (
  <CardContainer>
    <QuoteImageContainer image={backgroundImage}>
      <img src={image} />
    </QuoteImageContainer>

    <QuoteContainer>
      <div>
        <ImageContainer width="180px" justify={FlexJustifyContent.Start}>
          <img src={logo} />
        </ImageContainer>

        <Typography
          variant={TypographyVariant.Small}
          color={colors.blueText}
          margin="1.3em 0 1.3em 0"
        >
          {quote}
        </Typography>

        <FlexContainer>
          <AuthorImage>
            <img src={authorImage} alt={i18n.t('home.author_image_alt')} />
          </AuthorImage>

          <FlexContainer
            direction={FlexDirection.Column}
            alignItem={FlexAlignItem.Center}
          >
            <div>
              <Typography
                variant={TypographyVariant.Body2}
                margin="10px 16px"
                color={colors.blueText}
              >
                {authorName}
              </Typography>
              <Typography
                variant={TypographyVariant.Small}
                margin="10px 16px"
                color={colors.lightText}
              >
                {authorPosition}
              </Typography>
            </div>
          </FlexContainer>
        </FlexContainer>
      </div>
    </QuoteContainer>
  </CardContainer>
)

const CardContainer = styled(PageCard)`
  width: 100%;
  padding: 0;
  display: flex;
  overflow: hidden;
  white-space: break-spaces;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    display: block;
  }
`

const QuoteImageContainer = styled.div<{ image: string }>`
  width: 50%;
  overflow: hidden;
  position: relative;
  min-height: 300px;
  padding-top: 40px;
  background: ${({ image }) => image};

  & > img {
    position: absolute;
    bottom: 0;
  }

  @media ${({ theme }) => theme.screenMax.tabletL} {
    width: auto;
  }
`

const QuoteContainer = styled.div`
  width: 50%;
  height: 100%;
  min-height: 430px;
  display: flex;
  align-items: center;
  margin: 30px;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    width: auto;
  }
`

const AuthorContainer = styled.div`
  width: 80px;
`
const AuthorImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  overflow: hidden;

  & > img {
    width: 100%;
  }
`
