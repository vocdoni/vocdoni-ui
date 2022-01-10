import React, { ChangeEvent } from 'react'
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

interface IFieldValues {
  [field: string]: string
}

interface IFormProps {
  fields: string[]
  values: IFieldValues
  secretKey: string
  submitEnabled?: boolean
  checkingCredentials?: boolean
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
  onSubmit,
  onChange,
}: IFormProps) => {
  const { i18n } = useTranslation()
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
                label="secretKey"
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
          <FlexContainer justify={FlexJustifyContent.Center}>
            <ContainerContainer>
              {i18n.t('vote.you_cant_enter_contact_with_entity')}
            </ContainerContainer>
          </FlexContainer>
          <HiddenButton type="submit"></HiddenButton>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Button
              wide
              positive
              onClick={onSubmit}
              spinner={submitEnabled && checkingCredentials}
              disabled={!submitEnabled || checkingCredentials}
            >
              {i18n.t('action.continue')}
            </Button>
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
