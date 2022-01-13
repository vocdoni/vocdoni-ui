import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { ProcessDetails, EntityMetadata } from 'dvote-js'
import { useTranslation } from 'react-i18next'

import {
  Fieldset,
  FormGroupVariant,
  InputFormGroup,
} from '@components/blocks/form'
import { Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { PageCard } from '@components/elements/cards'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { CardImageHeader } from '@components/blocks/card/image-header'
import { Col, Row, Text } from '@components/elements-v2'
import { useAuthForm } from '@hooks/use-auth-form'

interface IFieldValues {
  [field: string]: string
}

interface IFormProps {
  fields: string[]
  values: IFieldValues
  submitEnabled?: boolean
  checkingCredentials?: boolean
  invalidCredentials?: boolean
  processInfo: ProcessDetails
  entity: EntityMetadata
  onChange: (field: string, value) => void
  onSubmit: () => void
}

export const SignInForm = ({
  fields,
  submitEnabled,
  values,
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

  return (
    <SignInFormCard>
      <CardImageHeader
        title={processInfo?.metadata?.title.default}
        processImage={processInfo?.metadata?.media.header}
        subtitle={entity?.name.default}
        entityImage={entity?.media.avatar}
      />

      <LoginFieldset disabled={checkingCredentials}>
        <form onSubmit={handleSubmit}>
          {fields.map((fieldName, i) => {
            const isLastItem = i === fields.length - 1
            return (
              <FlexContainer justify={FlexJustifyContent.Center} key={i}>
                <InputContainer>
                  <InputFormGroup
                    label={fieldName}
                    id={fieldName}
                    placeholder={i18n.t('vote.auth.insert_your', { field: fieldName })}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      onChange(fieldName, e.target.value)
                      if (sameInput) {
                        setSameInput(false)
                      }
                    }
                    }
                    value={values[fieldName]}
                    variant={FormGroupVariant.Small}
                  />

                  {isLastItem && (
                    <ContainerContainer>
                      {i18n.t('vote.you_cant_enter_contact_with_entity')}
                    </ContainerContainer>
                  )}
                </InputContainer>
              </FlexContainer>
            )
          })}
          <HiddenButton type="submit"></HiddenButton>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <InputContainer>
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
                  {showError &&
                    <Text color='error' size='sm' weight='bold'>{i18n.t('vote.credentials_not_accepted')}</Text>
                  }
                </Col>
              </Row>
            </InputContainer>
          </FlexContainer>
        </form>
      </LoginFieldset>
    </SignInFormCard >
  )
}

const LoginFieldset = styled(Fieldset)`
  margin-top: 20px;
  margin-bottom: 26px;
`

const SignInFormCard = styled(PageCard)`
  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin: -21px -16px 0 -16px;
  }
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
