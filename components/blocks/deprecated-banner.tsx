import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/elements/button'
import styled from 'styled-components'

export const DeprecatedBanner = () => {
  const { i18n } = useTranslation()

  return (
    <DeprecatedBannerDiv>
      <CenterDiv>
        <div>
          <h2>{i18n.t('home.announcementTitle2')}</h2>
          <DeprecatedText>
            {i18n.t('home.announcementText2')}
          </DeprecatedText>
        </div>

        <ActionsContainer>
          <Button positive href="https://app.vocdoni.io">
            {i18n.t('home.request_access2')}
          </Button>
        </ActionsContainer>
      </CenterDiv>
    </DeprecatedBannerDiv>
  )
}

const CenterDiv = styled.div`
  max-width: 1400px;
  margin:0px auto;
  display: flex;
  flex-direction: row;

  @media ${({ theme }) => theme.screenMax.tablet} {
    flex-direction: column;
  }
`

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  & > a {
    margin:0px auto;
    min-width: 200px;
    margin-left: 20px;

    & div {
      width: 300px;
      padding-left:0px;
    }
  }
`

const DeprecatedBannerDiv = styled.div`
  position: relative;
  top:0;
  left:0;
  width: 100%;
  border: 3px solid #fff;
  background-color: #fff;
  margin: 0px auto;
  background: linear-gradient(101.89deg,rgb(255, 223, 223) 17.32%,rgb(255, 248, 225) 68.46%);
  padding: 20px 40px;
  box-shadow: rgba(180, 193, 228, 0.35) 0px 3px 3px;
  display:flex;

  & h2 {
    text-align: left;
    font-size: 22px;
    margin-top: 5px;
  }
`
const DeprecatedText = styled.p`
  font-size: 18px;
  color: rgb(13, 71, 82);
  margin-bottom: 20px;
  text-align: left;
  max-width: 850px;
`