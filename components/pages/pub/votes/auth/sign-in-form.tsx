import React from 'react'
import styled from 'styled-components'
import { IProcessDetails, EntityMetadata } from 'dvote-js'

import i18n from '@i18n'

import { Fieldset, FormGroupVariant, InputFormGroup } from '@components/blocks/form'
import { Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { PageCard } from '@components/elements/cards'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { VotePageHeader } from '@components/blocks/vote-page-header'

interface IFieldValues {
  [field: string]: string
}

interface IFormProps {
  fields: string[]
  values: IFieldValues
  submitEnabled?: boolean
  checkingCredentials?: boolean
  processInfo: IProcessDetails
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
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <PageCard>
      <VotePageHeader
        processTitle={processInfo?.metadata?.title.default}
        processImage={processInfo?.metadata?.media.header}
        entityName={entity?.name.default}
        entityImage={entity?.media.avatar}
      />

      <Fieldset disabled={checkingCredentials}>
        <form onSubmit={handleSubmit}>
          {fields.map((fieldName, i) => {
            const isLastItem = i === fields.length - 1
            return (
              <FlexContainer justify={FlexJustifyContent.Center} key={i}>
                <InputContainer>
                  <InputFormGroup
                    label={fieldName}
                    id={fieldName}
                    onChange={(e) => onChange(fieldName, e.target.value)}
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
          <HiddenButton type='submit'></HiddenButton>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Column lg={3} md={4} sm={12}>
              <Button
                wide
                positive
                onClick={onSubmit}
                spinner={submitEnabled && checkingCredentials}
                disabled={!submitEnabled || checkingCredentials}
              >
                {i18n.t('action.continue')}
              </Button>
            </Column>
          </FlexContainer>
        </form>
      </Fieldset>
    </PageCard>
  )
}
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