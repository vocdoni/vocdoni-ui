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

interface IModalQuestionList {
  questions: Question[]
  choices: number[]
  sendingVote: boolean
  onClose: () => void
  onSubmit: () => void
}

export const ModalQuestionList = ({
  questions,
  choices,
  sendingVote,
  onSubmit,
  onClose,
}: IModalQuestionList) => {
  const { i18n } = useTranslation()
  const [validSMS, setValidSMS] = useState<boolean>(false)
  const [leftSMS, setLeftSMS] = useState<number>(5)
  const [phoneNum, setPhoneNum] = useState<string>('54')
  const [SMSPin, setSMSPin] = useState<string>('555555')
  const [pin, setPin] = useState<string>()

  const checkSMS = (value: string) => {
    if (value.length === 6) {
      setValidSMS(value === SMSPin)

      if(value !== SMSPin){
        setLeftSMS(leftSMS-1)
      }
    }
  }

  const setSMS = (value: string) => {
    setPin(value)
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
            {choice?.title.default}
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

      <Spacer direction='vertical' size='3xl' />

      <Column>
        <WarningIcon>
          <Icon
            name='shutdown'
            size={14}
            color='#B75E19'
          />
        </WarningIcon>
        <WarningText>{i18n.t('fcb.only_one_vote')}</WarningText>
      </Column>

      <QuestionsContainer>
        {questions.map((question: Question, index: number) =>
          renderQuestion(question, question.choices[choices[index]], index)
        )}
      </QuestionsContainer>

      <Spacer direction='vertical' size='3xl' />

      <div>
        <HeaderText>{i18n.t('fcb.enter_your_sms')}</HeaderText>
        { leftSMS === 0 && 
          <Column>
            <WarningIcon>
              <Icon
                name='shutdown'
                size={14}
                color='#B75E19'
              />
            </WarningIcon>
            <WarningText>{i18n.t('fcb.no_sms_left')}</WarningText>
          </Column>
        }

        { leftSMS !== 0 && 
          <InputFormGroup
            label={null}
            type='text'
            error=''
            id='sms'
            value={pin}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              checkSMS(event.target.value)
              setSMS(event.target.value)
            }}
          />          
        }

        { !validSMS && (typeof pin != "undefined" && pin.length >= 6) && 
          <>
            <ErrorDiv>
              <ErrorIcon>
                <Icon
                  name='shutdown'
                  size={14}
                  color='#B31B35'
                />
              </ErrorIcon>
              <ErrorText>{i18n.t('fcb.incorrect_code', {leftSMS: leftSMS})}</ErrorText>
            </ErrorDiv>
          </>
        }        
      </div>

      <Spacer direction='vertical' size='3xl' />

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

        { validSMS ? 
          <Column sm={6}>
            <Button
              wide
              fcb
              onClick={onSubmit}
              disabled={sendingVote}
              spinner={sendingVote}
            >
              {i18n.t('fcb.continue')}
            </Button>
          </Column>

          :

          <>
            <Column sm={6}>
              <Button
                wide
                fcb
                onClick={onSubmit}
                disabled={sendingVote}
                spinner={sendingVote}
              >
                { (leftSMS >= 5) ? <>{i18n.t('fcb.send_me_SMS')}</> : <>{i18n.t('fcb.resend_me_SMS')}</> }
              </Button>
            </Column>
            
            <Spacer direction='vertical' size='md' />

            <NeutralColor>
              <strong>{i18n.t('fcb.available_SMS',{ numSMS: leftSMS, phoneNum: phoneNum})}</strong>
            </NeutralColor>
          </>
        }
      </Grid>
    </ModalContent>
  )
}

const ErrorDiv = styled.div`
  background: #FEE4D6;
  padding: 12px 26px 16px;
  border-radius: 12px;
  margin-top: -35px;
`

const ErrorText = styled.div`
  color: #B31B35;
  padding-left: 10px;
  margin-left: 10px;
  line-height: 16px;
  padding-top: 3px;
  font-weight: 700;
`

const ErrorIcon = styled.div`
  display:inline;
  float:left;
  margin-left:-10px;
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
`

const WarningText = styled.div`
  color: #B75E19;
  font-size: 16px;
  display: flex;
  padding-left: 10px;
  font-weight: 700;
  margin-right: -10px;
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
  overflow-y: scroll;
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