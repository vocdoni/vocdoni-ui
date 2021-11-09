import React, { ChangeEvent } from 'react'
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

interface IFieldValues {
  [field: string]: string
}

interface IFormProps {
  fields: string[]
  values: IFieldValues
  submitEnabled?: boolean
  checkingCredentials?: boolean
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
  onSubmit,
  onChange,
}: IFormProps) => {
  const { i18n } = useTranslation()
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onChange(fieldName, e.target.value)
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
              <Button
                wide
                positive
                onClick={onSubmit}
                spinner={submitEnabled && checkingCredentials}
                disabled={!submitEnabled || checkingCredentials}
              >
                {i18n.t('action.continue')}
              </Button>
            </InputContainer>
          </FlexContainer>
        </form>
      </LoginFieldset>
    </SignInFormCard>
  )
}

const LoginFieldset = styled(Fieldset)`
  margin-top: 20px;
  margin-bottom: 26px;
`

const SignInFormCard = styled(PageCard)`
  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin: -24px -20px 0 -20px;
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
