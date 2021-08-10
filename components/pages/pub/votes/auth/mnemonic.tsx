import React, { ChangeEvent } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { IProcessDetails, EntityMetadata } from 'dvote-js'

import { Fieldset, FormGroupVariant, InputFormGroup } from '@components/blocks/form'
import { Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { PageCard } from '@components/elements/cards'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { CardImageHeader } from '@components/blocks/card/image-header'
import { MetadataFields } from '@components/pages/votes/new/metadata'

import { overrideTheme } from 'theme'

interface IFormProps {
  mnemonic: string
  submitEnabled?: boolean
  error?: string
  processInfo: IProcessDetails
  entity: EntityMetadata
  onChange: (mnemonic: string) => void
  onSubmit: () => void
  onBlur: () => void
}

export const MnemonicForm = ({
    mnemonic,
    submitEnabled,
    error,
    processInfo,
    entity,
    onSubmit,
    onChange,
    onBlur,
  }: IFormProps) => {
    const { i18n } = useTranslation()

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault()
      onSubmit()
    }

    return (
      <PageCard>
        <ThemeProvider
          theme={overrideTheme({
            accent1: processInfo?.metadata?.meta[MetadataFields.BrandColor],
            accent1B: processInfo?.metadata?.meta[MetadataFields.BrandColor],
            accent2: processInfo?.metadata?.meta[MetadataFields.BrandColor],
            accent2B: processInfo?.metadata?.meta[MetadataFields.BrandColor],
            textAccent1: processInfo?.metadata?.meta[MetadataFields.BrandColor],
            textAccent1B: processInfo?.metadata?.meta[MetadataFields.BrandColor],
          })}
        >
          <CardImageHeader
            title={processInfo?.metadata?.title.default}
            processImage={processInfo?.metadata?.media.header}
            subtitle={entity?.name.default}
            entityImage={entity?.media.avatar}
          />

          <Fieldset>
            <form onSubmit={handleSubmit}>
              <FlexContainer justify={FlexJustifyContent.Center} key={0}>
                <InputContainer>
                  <InputFormGroup
                    label={'mnemonic'}
                    id={'mnemonic'}
                    error={error}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
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
        </ThemeProvider>
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
