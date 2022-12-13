import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PageCardHeader } from '@components/elements/cards'
import { Column, Grid } from '@components/elements/grid'
import { FALLBACK_ACCOUNT_ICON } from '@const/account'
import { FALLBACK_VOTE_HEADER_IMAGE } from '@const/vote'

import { Body1, H2 } from '@components/elements/typography'
import { Image } from '../../elements/image'

interface ICardImageHeader {
  title: string
  subtitle?: string
  entityImage?: string
  processImage?: string
  isHeaderExpanded?: boolean
}

export const CardImageHeader = ({
  title,
  subtitle,
  entityImage,
  processImage,
  isHeaderExpanded
}: ICardImageHeader) => {
  const { i18n } = useTranslation()

  const newProcessImageSrc = processImage?.indexOf("source.unsplash.com/random") !== -1 ? null : processImage
  const headerImageSrc = newProcessImageSrc || FALLBACK_VOTE_HEADER_IMAGE
  const entityImageSrc = entityImage || FALLBACK_ACCOUNT_ICON

  return (
    <CardImageHeaderContainer>
      <PageCardHeader isHeaderExpanded={isHeaderExpanded}>
          { headerImageSrc === FALLBACK_VOTE_HEADER_IMAGE  ?
            <img src={headerImageSrc} alt={i18n.t('vote.vote_process_image_alt')} />
          :
            <Image src={headerImageSrc} alt={i18n.t('vote.vote_process_image_alt')} />
          }
      </PageCardHeader>

      <EntityLogoWrapper>
          <Image src={entityImageSrc} alt={i18n.t('vote.entity_logo_alt')} />
      </EntityLogoWrapper>

      <Grid>
        <Column>
          {subtitle && (
            <CardBody
              color="52606D"
              margin="0 0 20px 0"
            >
              {subtitle}
            </CardBody>
          )}

          <CardH2>
            {title}
          </CardH2>
        </Column>
      </Grid>
    </CardImageHeaderContainer>
  )
}

const CardImageHeaderContainer = styled.div``

const CardH2 = styled(H2)`
  margin: 8px 0 8px 0;
  color: #0D4752;
  font-size: 32px;
  line-height: 34px;
  font-weight: 700;
  text-align: center;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    font-size: 28px;
    line-height: 32px;
  }

  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 26px;
    line-height: 30px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    text-align: left;
  }
`

const CardBody = styled(Body1)`
  font-size: 16px;
  font-weight: 400;
  color: #52606D;
  text-align: center;

  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 14px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    text-align: left;
  }
`

const EntityLogoWrapper = styled.div`
  overflow: hidden;
  border-radius: 12px;
  width: 84px;
  height: 84px;
  display: flex;
  margin: -62px auto 0;
  border: solid 1px ${({ theme }) => theme.white};
  box-shadow: 0px 4px 8px rgba(31, 41, 51, 0.04), 0px 0px 2px rgba(31, 41, 51, 0.06), 0px 0px 1px rgba(31, 41, 51, 0.04);
  border-radius: 16px;

  & > img {
    max-height: 100%;
    max-width: 100%;
    background-color: #fff;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin-left: 0;
  }
`
