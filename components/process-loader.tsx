import React, { ReactNode } from 'react'
import styled from 'styled-components'

import i18n from '../i18n'

import { SectionText, SectionTitle, TextAlign } from './text'

interface IProcessLoaderProps {
  title: string
  subtitle: string
  /** The text of the steps to display */
  steps: string[]
  /** The next step to be executed */
  currentStep: number
}

export const ProcessLoader = ({
  title,
  subtitle,
  steps,
  currentStep,
}: IProcessLoaderProps) => {
  const renderStep = (step, index) => (
    <StepContainer key={index}>
      {currentStep < index && <EmptyCheck />}
      {currentStep > index && (
        <Check>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              d="M1.73 12.91l6.37 6.37L22.79 4.59"
            />
          </svg>
        </Check>
      )}
      {currentStep === index && <Loader />}
      <StepText>{step}</StepText>
    </StepContainer>
  )

  return (
    <>
      <LoaderHeader>
        <PleaseWaitText align={TextAlign.Center}>
          {i18n.t('vote.please_wait')}
        </PleaseWaitText>
        <HeaderText align={TextAlign.Center}>{title}</HeaderText>
        <SectionText align={TextAlign.Center}>{subtitle}</SectionText>
      </LoaderHeader>
      <br />

      <StepsContainer>
        <div>{steps.map(renderStep)}</div>
      </StepsContainer>
    </>
  )
}

const PleaseWaitText = styled(SectionText)`
  font-size: 16px;
`

const HeaderText = styled(SectionTitle)`
  font-size: 28px;
`

const LoaderHeader = styled.div`
  max-width: 600px;
  margin: auto;
`

const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
`

const StepContainer = styled.div`
  display: flex;
  margin: 10px 0;
  align-items: center;
`
const StepText = styled(SectionText)`
  color: ${({ theme }) => theme.accent1};
  margin-left: 10px;
`

const BaseSpinner = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
`
const Check = styled(BaseSpinner)`
  background-color: ${({ theme }) => theme.accent1};
  color: ${({ theme }) => theme.white};
  & > svg {
    width: 18px;
    margin: 5px;
  }
`
const EmptyCheck = styled(BaseSpinner)`
  border: solid 2px ${({ theme }) => theme.lightBorder};
`

const Loader = styled(BaseSpinner)`
  @-webkit-keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  display: inline-block;
  font-size: 10px;
  text-indent: -9999em;
  background: ${({ theme }) => theme.accent1};
  background: -moz-linear-gradient(
    left,
    ${({ theme }) => theme.accent1} 10%,
    rgba(255, 255, 255, 0) 42%
  );
  background: -webkit-linear-gradient(
    left,
    ${({ theme }) => theme.accent1} 10%,
    rgba(255, 255, 255, 0) 42%
  );
  background: -o-linear-gradient(
    left,
    ${({ theme }) => theme.accent1} 10%,
    rgba(255, 255, 255, 0) 42%
  );
  background: -ms-linear-gradient(
    left,
    ${({ theme }) => theme.accent1} 10%,
    rgba(255, 255, 255, 0) 42%
  );
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.accent1} 10%,
    42%
  );
  position: relative;
  -webkit-animation: load3 1.4s infinite linear;
  animation: load3 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);

  &:before {
    width: 50%;
    height: 50%;
    background: ${({ theme }) => theme.accent1};
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
  &:after {
    background: ${({ theme }) => theme.white};
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`
