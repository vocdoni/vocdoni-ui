import React from 'react'
import styled from 'styled-components'
import { IProcessInfo, EntityMetadata } from 'dvote-js'

import i18n from '@i18n'

import { Fieldset, FormGroupVariant, InputFormGroup } from '@components/form'
import { Column } from '@components/grid'
import { Button } from '@components/button'
import { PageCard } from '@components/cards'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { VotePageHeader } from '@components/common/vote-page-header'

interface IFormProps {
  mnemonic: string
  submitEnabled?: boolean
  invalidMnemonic?: boolean
  processInfo: IProcessInfo
  entity: EntityMetadata
  onChange: (mnemonic: string) => void
  onSubmit: () => void
  onBlur: () => void
}

export const MnemonicForm = ({
  mnemonic,
  submitEnabled,
  invalidMnemonic,
  processInfo,
  entity,
  onSubmit,
  onChange,
  onBlur
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

      <Fieldset>
        <form onSubmit={handleSubmit}>
          <FlexContainer justify={FlexJustifyContent.Center} key={0}>
            <InputContainer>
              <InputFormGroup
                label={'mnemonic'}
                id={'mnemonic'}
                error={invalidMnemonic && i18n.t('vote.invalid_mnemonic_value')}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                value={mnemonic}
                variant={FormGroupVariant.Small}
              />{' '}
              <EntityContactContainer>
                {i18n.t('vote.you_cant_enter_contact_with_entity')}
              </EntityContactContainer>
            </InputContainer>
          </FlexContainer>

          <HiddenButton type="submit"></HiddenButton>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Column lg={3} md={4} sm={12}>
              <Button
                wide
                positive
                onClick={onSubmit}
                spinner={!submitEnabled}
                disabled={!submitEnabled}
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
const EntityContactContainer = styled.div`
  margin: 0px 0 40px;
`
