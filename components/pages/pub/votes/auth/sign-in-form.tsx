import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { ProcessDetails, EntityMetadata } from 'dvote-js'
import { useTranslation } from 'react-i18next'
import { useBlockHeight } from '@vocdoni/react-hooks'

import {
  Fieldset,
  FormGroupVariant,
  InputFormGroup,
  InputPasswordFormGroup,
} from '@components/blocks/form'
import { Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { SignInFormCard } from '@components/elements/cards'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { CardImageHeader } from '@components/blocks/card/image-header'
import { FormFieldsetContainer } from '../components/form-fieldset-container'
import { Col, Input, Row, Text } from '@components/elements-v2'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useUrlHash } from "use-url-hash"
import { VoteStatus } from '@lib/util'
import moment from 'moment'
import { Icon } from '@components/elements-v2/icons'

interface IFieldValues {
  [field: string]: string
}

interface IFormProps {
  fields: string[]
  values: IFieldValues
  secretKey: string
  submitEnabled?: boolean
  checkingCredentials?: boolean
  invalidCredentials?: boolean
  processInfo: ProcessDetails
  entity: EntityMetadata
  onChange: (field: string, value) => void
  onSubmit: () => void
  onChangeSecretKey
}

export const SignInForm = ({
  fields,
  submitEnabled,
  values,
  secretKey,
  onChangeSecretKey,
  processInfo,
  entity,
  checkingCredentials,
  invalidCredentials,
  onSubmit,
  onChange,
}: IFormProps) => {
  const { i18n } = useTranslation()
  const [sameInput, setSameInput] = useState(false)
  const showError = sameInput && invalidCredentials
  const processId = useUrlHash().slice(1)
  const { isAnonymous, status, startDate } = useProcessWrapper(processId)
  const showPreregisterTitle = isAnonymous && status === VoteStatus.Upcoming
  const showPasswordInput = isAnonymous && status === VoteStatus.Active
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onSubmit()
  }

  const { blockHeight } = useBlockHeight()
  const processStarted = blockHeight >= processInfo?.state?.startBlock


  return (
    <SignInFormCard>
      <CardImageHeader
        title={processInfo?.metadata?.title.default}
        processImage={processInfo?.metadata?.media.header}
        subtitle={entity?.name.default}
        entityImage={entity?.media.avatar}
      />
      <StyledFieldset disabled={checkingCredentials}>
        <Row gutter='xl'>
          {
            showPreregisterTitle &&
            <Col xs={12}>
              <Row gutter='xs'>
                <Col xs={12}>
                  <Text size='lg' weight='bold' color='dark-blue'>
                    {i18n.t('vote.auth.preregistration.title')}
                  </Text>
                </Col>
                <Col xs={12}>
                  <Text size='xs' color="dark-blue">
                    {i18n.t('vote.auth.preregistration.subtitle', { date: moment(startDate).locale(i18n.language).format('l') })}
                  </Text>
                </Col>
              </Row>
            </Col>
          }
          <Col xs={12}>
            <Text size='sm' weight='bold' color='dark-blue'>
              {showPasswordInput ?
                i18n.t('vote.auth.insert_your_credentials_and_password') :
                i18n.t('vote.auth.insert_your_credentials')
              }
            </Text>
          </Col>
          <Col xs={12}>
            <form onSubmit={handleSubmit}>
              <Row gutter='none'>
                {fields.map((fieldName, i) =>
                  <Col xs={12} disableFlex key={i}>
                    <InputFormGroup
                      label={fieldName}
                      id={fieldName}
                      placeholder={i18n.t('vote.auth.insert_your', { field: fieldName })}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChange(fieldName, e.target.value)
                        setSameInput(false)
                      }
                      }
                      value={values[fieldName]}
                      variant={FormGroupVariant.Small}
                    />
                  </Col>
                )}

                {showPasswordInput &&
                  <Col xs={12}>
                    <InputPasswordFormGroup
                      label={i18n.t('vote.auth.secret_key_label')}
                      id="secretKey"
                      placeholder={i18n.t('vote.auth.insert_your_secret_key')}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChangeSecretKey(e.target.value)
                        setSameInput(false)
                      }
                      }
                      value={secretKey}
                      variant={FormGroupVariant.Small}
                    />
                  </Col>
                }
              </Row>
              <HiddenButton type="submit"></HiddenButton>
            </form>
            <Col xs={12} md={7}>
              {/*Error MSG*/}
              {showError &&
                <>
                  <ErrorDiv>
                    <ErrorIcon>
                      <Icon
                        name='warning'
                        size={14}
                        color='#B31B35'
                      />
                    </ErrorIcon>
                    <ErrorText>{i18n.t('vote.credentials_not_accepted')}</ErrorText>
                  </ErrorDiv>
                </>
              }
            </Col>
          </Col>
          <Col xs={12}>
            <Row align='center' justify='center' gutter='xl'>
              <Col xs={12} md={5} align='center' justify='center'>
                <Button
                  wide
                  positive
                  onClick={() => {
                    onSubmit()
                    setSameInput(true)
                  }}
                  spinner={submitEnabled && checkingCredentials}
                  disabled={!submitEnabled || checkingCredentials || showError}
                >
                  {i18n.t('action.continue')}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </StyledFieldset>
    </SignInFormCard>
  )
}

const HiddenButton = styled.button`
  visibility: hidden;
`

const StyledFieldset = styled.fieldset`
  max-width: 490px;
  width: 100%;
  border: none;
  margin: auto;

  @media ${({theme}) => theme.screenMax.mobileL} {
    margin-left:-10px;
  }
`

const ErrorDiv = styled.div`
  background: #FEE4D6;
  padding: 15px 26px 16px;
  border-radius: 12px;
  margin-top: -15px;
  margin-right: -20px;
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
  padding-top: 10px;
  @media ${({theme}) => theme.screenMax.mobileL} {
    svg {
      margin-top: 8px;
    }
  }
`
