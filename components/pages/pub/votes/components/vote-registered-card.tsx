import React from 'react'
import styled from 'styled-components'

import { useTranslation } from 'react-i18next'

import { ImageContainer } from '@components/elements/images'
import { Button, LinkTarget } from '@components/elements/button'

interface IVoteRegisteredCardProps {
  explorerLink: string
}

export const VoteRegisteredCard = ({
  explorerLink,
}: IVoteRegisteredCardProps) => {
  const { i18n } = useTranslation()
  return (
    <BannerDiv>
      <BannerMainDiv>
        <BannerIcon>
          <ImageContainer width="80px">
            <img
              src="/images/vote/vocdoni-vote.png"
              alt={i18n.t('vote.voted_alt')}
            />
          </ImageContainer>
        </BannerIcon>

        <BanerText>
          <BannerTitle>
            {i18n.t('vote.your_vote_has_been_registered')}
          </BannerTitle>
          <div>
            <Button href={explorerLink} target={LinkTarget.Blank} positive wide>
              {i18n.t('vote.view_in_explorer')}
            </Button>
          </div>
        </BanerText>
      </BannerMainDiv>
    </BannerDiv>
  )
}
const BannerDiv = styled.div<{ warning?: boolean }>`
  padding: 24px;
  background: linear-gradient(
    106.26deg,
    ${({ theme, warning }) =>
        warning ? theme.accentLight2B : theme.accentLight1B}
      5.73%,
    ${({ theme, warning }) =>
        warning ? theme.accentLight2 : theme.accentLight1}
      93.83%
  );
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
  border-radius: 16px;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 14px;
  }

  @media ${({ theme }) => theme.screenMax.tabletL} {
    padding: 18px;
  }
`

const BannerIcon = styled.div`
  flex: 1;
  margin-bottom: 10px;
`
const BanerText = styled.div`
  flex: 10;
  margin: 0 10px;

`

const BannerMainDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const BannerTitle = styled.h2<{ warning?: boolean }>`
  color: ${({ theme, warning }) => (warning ? theme.textAccent2B : theme.text)};
  font-weight: normal;
  margin: 0 0 10px;
  text-align: center;
`
const BannerSubtitle = styled.p`
  color: ${(props) => props.theme.lighterText};
  font-weight: normal;
  margin: 16px 0;
  text-align: center;
`
const RightLink = styled.div`
  line-height: 20px;
`
