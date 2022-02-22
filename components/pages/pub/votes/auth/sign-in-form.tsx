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
import { Col, Row, Text } from '@components/elements-v2'

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

      <FormFieldsetContainer disabled={checkingCredentials}>
        <form onSubmit={handleSubmit}>
          {fields.map((fieldName, i) => {
            const isLastItem = i === fields.length - 1
            return (
              <FlexContainer justify={FlexJustifyContent.Center} key={i}>
                <InputFormGroup
                  label={fieldName}
                  id={fieldName}
                  placeholder={i18n.t('vote.auth.insert_your', { field: fieldName })}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChange(fieldName, e.target.value)
                  }
                  value={values[fieldName]}
                  variant={FormGroupVariant.Small}
                />
              </FlexContainer>
            )
          })}
          {(processInfo.state.processMode.preRegister && processStarted) ? (
            <FlexContainer justify={FlexJustifyContent.Center}>
              <InputPasswordFormGroup
                label={i18n.t('vote.auth.secret_key_label')}
                id="secretKey"
                placeholder={i18n.t('vote.auth.insert_your_secret_key')}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChangeSecretKey(e.target.value)
                }
                value={secretKey}
                variant={FormGroupVariant.Small}
              />
            </FlexContainer>
          ) : (<div></div>)}
          <HiddenButton type="submit"></HiddenButton>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <InputContainer>
              {/* <Button
              wide
              positive
              onClick={onSubmit}
              spinner={submitEnabled && checkingCredentials}
              disabled={!submitEnabled || checkingCredentials}
            >
              {i18n.t('action.continue')}
            </Button> */}
              <Row align='center' justify='center' gutter='xl'>
                <Col xs={12} md={6} align='center' justify='center'>
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
                <Col xs={12} md={6}>
                  {/*Error MSG*/}
                  {showError &&
                    <Text
                      color='error'
                      size='sm'
                      weight='semi-bold'
                    >
                      {i18n.t('vote.credentials_not_accepted')}
                    </Text>
                  }
                </Col>
              </Row>
            </InputContainer>
          </FlexContainer>
        </form>
      </FormFieldsetContainer>
    </SignInFormCard>
  )
}

const LoginFieldset = styled(Fieldset)`
  margin-top: 20px;
  margin-bottom: 26px;
`

const HiddenButton = styled.button`
  visibility: hidden;
`

const InputContainer = styled.div`
  max-width: 400px;
  width: 100%;
`
const ContainerContainer = styled.div`
  margin: -18px 0 40px;
`
