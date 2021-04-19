import React from 'react'
import styled from 'styled-components'

import i18n from '../i18n'

export const Loader = () => (
  <AppLoader>
    <LoaderContainer>
      <LogoContainer>
        <img src="/images/common/logo.svg" alt="Vocdoni Logo" />
      </LogoContainer>

      <TextContainer>{i18n.t('dashboard.loading')}</TextContainer>
    </LoaderContainer>
  </AppLoader>
)

const LogoContainer = styled.div`
  width: 100px;
  margin: 60px auto 26px;

  & > img {
    width: 100%;
  }
`

const TextContainer = styled.p`
  text-align: center;
  font-size: 30px;

  &:after {
    content: ' .';
    animation: dots 1s steps(5, end) infinite;
  }
    
  @keyframes dots {
    0%, 20% {
      color: rgba(0,0,0,0);
      text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);  
    }
    40% {
      color: ${({ theme }) => theme.text};
      text-shadow:
        .25em 0 0 rgba(0,0,0,0),
        .5em 0 0 rgba(0,0,0,0);
    }
    60% {
      text-shadow:
        .25em 0 0 ${({ theme }) => theme.text},
        .5em 0 0 rgba(0,0,0,0);
    }
    80%, 100% {
      text-shadow:
        .25em 0 0 ${({ theme }) => theme.text},
        .5em 0 0 ${({ theme }) => theme.text};
      }
  }
`

const LoaderContainer = styled.div`
  max-width: 300px;
  max-height: 300px;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.white};
`

const AppLoader = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  z-index: 100;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.accent1};
`
