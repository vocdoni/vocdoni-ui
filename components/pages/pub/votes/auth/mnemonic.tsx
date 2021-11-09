import React, { ChangeEvent, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { ProcessDetails, EntityMetadata } from 'dvote-js'
import { useEntity } from '@vocdoni/react-hooks'


import { Fieldset, FormGroupVariant, InputFormGroup } from '@components/blocks/form'
import { Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { PageCard } from '@components/elements/cards'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { CardImageHeader } from '@components/blocks/card/image-header'
import { useTheme } from '@hooks/use-theme'
import { MetadataFields } from '@components/pages/votes/new/metadata'


interface IFormProps {
  mnemonic: string
  submitEnabled?: boolean
  error?: string
  processInfo: ProcessDetails
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
  const { updateAppTheme } = useTheme()
  const { metadata} = useEntity(processInfo?.state?.entityId)
  const entityMetadata = metadata as EntityMetadata


  useEffect(() => {
    if (processInfo?.metadata?.meta?.[MetadataFields.BrandColor] || entityMetadata?.meta?.[MetadataFields.BrandColor]) {
      const brandColor = processInfo?.metadata?.meta?.[MetadataFields.BrandColor] || entityMetadata?.meta?.[MetadataFields.BrandColor]

      updateAppTheme({
        accent1: brandColor,
        accent1B: brandColor,
        accent2: brandColor,
        accent2B: brandColor,
        textAccent1: brandColor,
        textAccent1B: brandColor,
        customLogo: entityMetadata?.media?.logo
      })
    }
  }, [processInfo, entityMetadata])
  
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

      <LoginFieldset>
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
      </LoginFieldset>
    </SignInFormCard>
  )
}

const SignInFormCard = styled(PageCard)`
  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin: -24px -20px 0 -20px;
  }
`

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
const EntityContactContainer = styled.div`
  margin: 0px 0 40px;
`
