import React, { ChangeEvent, useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { colors } from 'theme/colors'
import { SectionText } from '@components/elements/text'
import { Grid, Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { Choice, Question } from '@lib/types'
import { Radio } from '@components/elements/radio'
import { Icon } from '@components/elements-v2/icons'
import { InputFormGroup } from '@components/blocks/form'

import { Spacer, Input } from '@components/elements-v2'
import { useCSPForm } from '@hooks/use-csp-form'
import { Else, If, Then } from 'react-if'

interface IModalQuestionList {
  questions: Question[]
  choices: number[]
  sendingVote: boolean
  phoneSuffix: string
  onClose: () => void
  onSubmit: () => void
  sendSMS: () => void
  submitOTP: (value: string) => void
}

export const ModalQuestionList = ({
  questions,
  choices,
  sendingVote,
  phoneSuffix,
  onSubmit,
  onClose,
  sendSMS,
  submitOTP
}: IModalQuestionList) => {
  const { i18n } = useTranslation()
  const [validSMS, setValidSMS] = useState<boolean>(false)
  const { firstSent, setFirstSent, remainingAttempts, setAttempts, cooldown, coolItDown } = useCSPForm()
  const [pin, setPin] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [authError, setAuthError] = useState<string|null>(null)

  const sendMessage = async () => {
    if (cooldown) {
      return
    }

    setError(false)
    setFirstSent(true)
    coolItDown()
    try {
      await sendSMS()
      setAttempts(remainingAttempts -1)
    } catch (e) {
      setAuthError(i18n.t('fcb.contact_support'))
      setError(true)
    }
  }

  const submitVote = async () => {
    try {
      await submitOTP(pin)
      await onSubmit()
    } catch (e) {
      setError(true)
      console.error('invalid OTP:', e)
    }
  }

  const renderQuestion = (question: Question, choice: Choice, index) => (
    <div key={index}>
      <div>
        <OptionsContainer>
          <Radio
            name={`question-1`}
            key={index}
            checked={true}
            onClick={() => (index)}
          >
            { choice?.title.default === 'Blanc' &&
              <>{i18n.t('fcb.blank_option')}</>
            }

            { choice?.title.default !== 'Blanc' &&
              <>{ choice?.title.default }</>
            }
          </Radio>
        </OptionsContainer>
      </div>
    </div>
  )

  return (
    <ModalContent>
      <CloseButton onClick={onClose}>
        <ColorSpan>x</ColorSpan>
      </CloseButton>

      <ModalHeader>{i18n.t('vote.confirm_your_vote')}</ModalHeader>
      <SectionText>
        {i18n.t('fcb.confirm_your_vote_text')}
      </SectionText>

      <Spacer direction='vertical' size='2xl' />

      <Column>
        <WarningIcon>
          <Icon
            name='warning'
            size={14}
            color='#B75E19'
          />
        </WarningIcon>
        <WarningText>{i18n.t('fcb.only_one_vote')}</WarningText>
      </Column>

      <QuestionsContainer>
        {questions?.map((question: Question, index: number) =>
          renderQuestion(question, question.choices[choices[index]], index)
        )}
      </QuestionsContainer>

      <Spacer direction='vertical' size='2xl' />

      <div>
        <If condition={authError === null}>
          <Then>
            <If condition={remainingAttempts <= 0}>
              <Then>
                <Column>
                  <WarningIcon>
                    <Icon
                      name='warning'
                      size={14}
                      color='#B75E19'
                    />
                  </WarningIcon>
                  <WarningText>{i18n.t('fcb.no_sms_left')}</WarningText>
                </Column>
              </Then>
              <Else>
                <If condition={firstSent}>
                  <Then>
                    <HeaderText>{i18n.t('fcb.enter_your_sms')}</HeaderText>
                    <InputFormGroup
                      label={null}
                      type='text'
                      error=''
                      id='sms'
                      value={pin}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setPin(event.target.value)
                      }}
                    />
                  </Then>
                </If>
              </Else>
            </If>
            <If condition={error}>
              <Then>
                <ErrorDiv>
                  <ErrorIcon>
                    <Icon
                      name='warning'
                      size={14}
                      color='#B31B35'
                    />
                  </ErrorIcon>
                  <ErrorText>{i18n.t('fcb.incorrect_code', {leftSMS: 5-remainingAttempts})}</ErrorText>
                </ErrorDiv>
              </Then>
            </If>
          </Then>
          <Else>
            <ErrorDiv>
              <ErrorIcon>
                <Icon
                  name='warning'
                  size={14}
                  color='#B31B35'
                />
              </ErrorIcon>
              <ErrorText>{authError}</ErrorText>
            </ErrorDiv>
          </Else>
        </If>
      </div>

      <Spacer direction='vertical' size='md' />

      <Grid>
        { false &&
          <Column sm={6}>
            <Button
              fcb_border
              color={colors.FCBBlue}
              onClick={onClose}
              disabled={sendingVote}
            >
              {i18n.t('vote.no_back_to_login')}
            </Button>
          </Column>
        }

        <If condition={pin.length === 6 && !error}>
          <Then>
            <Column sm={12} md={8}>
              <Button
                wide
                fcb
                onClick={submitVote}
                disabled={sendingVote}
                spinner={sendingVote}
              >
                {i18n.t('fcb.continue')}
              </Button>
            </Column>
          </Then>
          <Else>
            <If condition={remainingAttempts > 0 && authError === null}>
              <Then>
                <Column sm={12} md={8}>
                  <Button
                    wide
                    fcb
                    onClick={sendMessage}
                    disabled={sendingVote || cooldown > 0}
                    spinner={sendingVote}
                  >
                    <If condition={remainingAttempts >= 5}>
                      <Then>
                        {i18n.t('fcb.send_me_SMS')}
                      </Then>
                      <Else>
                        <If condition={!cooldown}>
                          <Then>
                            {i18n.t('fcb.send_me_SMS')}
                          </Then>
                          <Else>
                            {i18n.t('fcb.sms_cooldown', {cooldown})}
                          </Else>
                        </If>
                      </Else>
                    </If>
                  </Button>
                </Column>
              </Then>
            </If>
            <If condition={authError === null}>
              <Then>
                <Spacer direction='vertical' size='md' />
                <NeutralColor>
                  <strong>{i18n.t('fcb.available_SMS', {numSMS: remainingAttempts, phoneNum: phoneSuffix})}</strong>
                </NeutralColor>
              </Then>
            </If>
          </Else>
        </If>
      </Grid>
    </ModalContent>
  )
}

const ErrorDiv = styled.div`
  background: #FEE4D6;
  padding: 15px 26px 16px;
  border-radius: 12px;
  margin-top: -35px;
`

const ErrorText = styled.div`
  color: #B31B35;
  padding-left: 10px;
  margin-left: 5px;
  line-height: 16px;
  padding-top: 3px;
  font-weight: 700;
  margin-top: -3px;
`

const ErrorIcon = styled.div`
  display:inline;
  float:left;
  margin-left:-10px;

  @media ${({theme}) => theme.screenMax.mobileL} {
    svg {
      margin-top: 8px;
    }
  }
`

const NeutralColor = styled.div`
  color: #52606D;
  text-align: justify;
  margin-bottom: 20px;
  padding:10px 10px 0px;
`

const WarningIcon = styled.div`
  display:inline;
  float:left;
  margin-left:-10px;

  @media ${({theme}) => theme.screenMax.mobileL} {
    padding-top:7px;
  }

  svg {
    margin-top: 10px;
  }

  @media ${({theme}) => theme.screenMax.mobileL} {
    svg {
      margin-top: 5px;
    }
  }
`

const WarningText = styled.div`
  color: #B75E19;
  font-size: 16px;
  display: flex;
  padding-left: 15px;
  font-weight: 700;
  margin-right: -10px;
  margin-top: -20px;

  @media ${({theme}) => theme.screenMax.mobileL} {
    margin-top:25px;
  }

  @media ${({theme}) => theme.screenMin.tablet} and ${({theme}) => theme.screenMax.laptop} {
    margin-top: 10px;
  }
`

const OptionsContainer = styled.div`
  border: 2px solid #2E377A;
  border-radius: 12px;
  padding: 0px 10px;
  margin-bottom: 20px;
  margin-top: 20px;
`

const ModalContent = styled.div`
  position: relative;
`

const QuestionsContainer = styled.div`
  overflow-y: hidden;
  overflow-x: hidden;
  max-height: 300px;

  @media ${({theme}) => theme.screenMax.mobileL} {
    max-height: 260px;
  }
`

const ModalHeader = styled(SectionText)`
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  color: ${({ theme }) => theme.accent1};
  background: -webkit-linear-gradient(03.11deg, #CF122D 9.45%, #154284 90.55%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const QuestionText = styled(SectionText)`
  size: 22px;
  font-weight: 500;
  margin-bottom: 4px;
`

const BoldSectionText = styled(SectionText)`
  font-weight: 700;
`

const QuestionGroup = styled.div`
  margin: 24px 0;
`

const HeaderText = styled(SectionText)`
  font-weight: 700;
  font-size: 16px;
  color: #52606D;
`

const CloseButton = styled.div`
  position: absolute;
  top: -10px;
  right: -20px;
  width: 38px;
  height: 38px;
  align-items: center;
  font-size: 18px;
  line-height: 18px;
  cursor: pointer;

  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;

  background:
    linear-gradient(#fff 0 0) padding-box, /*this is the white background*/
    linear-gradient(to right, #A50044, #174183) border-box;

  border: 2px solid transparent;
  border-radius: 8px;
  display: inline-block;
`

const ColorSpan = styled.span`
  background: -webkit-linear-gradient(103.11deg, #A50044 0.33%, #174183 99.87%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 400;
  margin-top:9px;
  padding-left:1px;
  display:block;
`
