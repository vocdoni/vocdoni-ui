import React from 'react'
import styled from 'styled-components'
import { EntityMetadata } from 'dvote-js'
import { ProcessInfo } from '@vocdoni/react-hooks'


import i18n from '@i18n'

import { Fieldset, FormGroupVariant, InputFormGroup } from '@components/form'
import { Column } from '@components/grid'
import { Button } from '@components/button'
import { PageCard } from '@components/cards'
import { FlexContainer, FlexJustifyContent } from '@components/flex'


import { VotePageHeader } from '../../common/vote-page-header'

interface IFieldValues {
  [field: string]: string
}

interface IFormProps {
  fields: string[]
  values: IFieldValues
  submitEnabled?: boolean
  checkingCredentials?: boolean
  processInfo: ProcessInfo
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
  return (
    <PageCard>
      <VotePageHeader
        processTitle={processInfo?.metadata.title.default}
        processImage={processInfo?.metadata?.media.header}
        entityName={entity?.name.default}
      />

      <Fieldset disabled={checkingCredentials}>
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
                  <LinkContainer>
                    <a>{i18n.t('vote.you_cant_enter_contact_with_entity')}</a>
                  </LinkContainer>
                )}
              </InputContainer>
            </FlexContainer>
          )
        })}

        <FlexContainer justify={FlexJustifyContent.Center}>
          <Column lg={3} md={4} sm={12}>
            <Button wide positive onClick={onSubmit} disabled={submitEnabled || checkingCredentials}>
              {i18n.t('action.continue')}
            </Button>
          </Column>
        </FlexContainer>
      </Fieldset>
    </PageCard>
  )
}

const InputContainer = styled.div`
  max-width: 400px;
  width: 100%;
`
const LinkContainer = styled.div`
  margin: -18px 0 40px;
`
