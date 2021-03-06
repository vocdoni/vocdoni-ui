import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useEntityCreation } from '@hooks/entity-creation'
import { Column, Grid } from '@components/elements/grid'
import { Button } from '@components/elements/button'

import { useMessageAlert } from '@hooks/message-alert'
import { useDbAccounts } from '@hooks/use-db-accounts'
import { useScrollTop } from '@hooks/use-scroll-top'
import { useWallet } from '@hooks/use-wallet'
import { Case, Default, Switch } from 'react-if'

import {
  FileLoaderFormGroup,
  InputFormGroup,
  TextareaFormGroup,
  SelectFormGroup,
} from '@components/blocks/form'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/elements/flex'
import { DirtyFields, ErrorFields } from '@lib/validators'
import { EntityNameAlreadyExistError } from '@lib/validators/errors/entity-name-already-exits-error'

import { AccountStatus } from '@lib/types'

import { entityMetadataValidator } from './metadata-validator'

import { EntityCreationPageSteps } from '.'
import { TermsModal } from './components/terms-modal'
import { PrivacyModal } from './components/privacy-modal'
import { EntityTermsModal } from './components/entity-terms-modal'

import {
  RoundedCheck,
  RoundedCheckSize,
} from '@components/elements/rounded-check'
import { Typography, TypographyVariant } from '@components/elements/typography'
import {
  SELECT_ORGANIZATION_TYPE,
  SELECT_ORGANIZATION_SIZE,
} from '../const/organizations'
import { PRIVACY_PATH } from '@const/routes'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'
import { OnPagePrivacy } from '@components/pages/policy/privacy/onpage-layer-1'

export enum MetadataFields {
  Name = 'name',
  Description = 'description',
  Email = 'email',
  Header = 'header',
  Logo = 'logo',
  Terms = 'terms',
  Consent = 'consent',
  EntityType = 'entity-type',
  EntitySize = 'entity-size',
}

export const FormMetadata = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language
  useScrollTop()
  const {
    name,
    description,
    email,
    logoFile,
    logoUrl,
    headerFile,
    headerUrl,
    terms,
    consent,
    entityType,
    entitySize,
    methods,
  } = useEntityCreation()
  const [metadataErrors, setMetadataErrors] = useState<ErrorFields>(new Map())
  const [dirtyFields, setDirtyField] = useState<DirtyFields>(new Map())
  const { setAlertMessage } = useMessageAlert()
  const { dbAccounts } = useDbAccounts()
  const { wallet } = useWallet()
  const { trackEvent } = useRudderStack()

  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)
  const [showEntityTermsModal, setShowEntityTermsModal] = useState<boolean>(
    false
  )
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false)

  const metadataRef = {
    [MetadataFields.Name]: useRef<HTMLDivElement>(null),
    [MetadataFields.Email]: useRef<HTMLDivElement>(null),
    [MetadataFields.Header]: useRef<HTMLDivElement>(null),
    [MetadataFields.Logo]: useRef<HTMLDivElement>(null),
  }

  useEffect(() => {
    const metadata = {
      [MetadataFields.Name]: name,
      [MetadataFields.Description]: description,
      [MetadataFields.Email]: email,
      [MetadataFields.Header]: {
        file: headerFile,
        url: headerUrl,
      },
      [MetadataFields.Logo]: {
        file: logoFile,
        url: logoUrl,
      },
      [MetadataFields.Terms]: terms,
      [MetadataFields.Consent]: consent,
    }

    setMetadataErrors(entityMetadataValidator(metadata))
  }, [
    name,
    description,
    email,
    logoFile,
    logoUrl,
    headerFile,
    headerUrl,
    terms && consent,
  ])

  const dirtyAllFields = () => {
    const newDirtyFields = new Map([...dirtyFields])

    for (let field in MetadataFields) {
      newDirtyFields.set(MetadataFields[field], true)
    }

    setDirtyField(newDirtyFields)
  }

  const getErrorMessage = (field: MetadataFields): string => {
    return dirtyFields.get(field) ? metadataErrors.get(field)?.message : null
  }

  const handleBlur = (field: MetadataFields) => {
    const newDirtyFields = new Map(dirtyFields)
    setDirtyField(newDirtyFields.set(field, true))
  }

  const onContinue = () => {
    const registeredAccount = dbAccounts.find(
      (acc) => acc.name.toLowerCase().trim() == name.toLowerCase().trim()
    )

    if (registeredAccount && registeredAccount.status === AccountStatus.Ready) {
      metadataErrors.set(MetadataFields.Name, new EntityNameAlreadyExistError())
    }

    if (!metadataErrors.size) {
      let destinationPage = EntityCreationPageSteps.CREDENTIALS

      if (wallet) {
        destinationPage = EntityCreationPageSteps.CREATION
      }

      trackEvent(TrackEvents.ENTITY_CREATION_WIZARD_BUTTON_CLICKED, {
        step: destinationPage,
        name: name,
        type: entityType?.value,
        size: entitySize?.value,
      })

      methods.setPageStep(destinationPage)
    } else {
      dirtyAllFields()

      for (let errorField of metadataErrors.keys()) {
        const fieldRef = metadataRef[errorField]

        if (fieldRef) {
          
          window.scroll({
            top: fieldRef.current?.offsetTop - 100,
            behavior: 'smooth',
          })
          
          setTimeout(() => {
            fieldRef.current?.getElementsByTagName('input')[0]?.focus()
          }, 900)

          return
        }
      }
    }
  }

  const handleOpenTermsModal = () => {
    setShowTermsModal(true)
  }

  const handleCloseTermsModal = () => {
    setShowTermsModal(false)
  }

  const handleOpenEntityTermsModal = () => {
    setShowEntityTermsModal(true)
  }

  const handleCloseEntityTermsModal = () => {
    setShowEntityTermsModal(false)
  }

  const handleOpenPrivacyModal = () => {
    setShowPrivacyModal(true)
  }

  const handleClosePrivacyModal = () => {
    setShowPrivacyModal(false)
  }

  return (
    <Grid>
      <Column md={6}>
        <InputFormGroup
          label={i18n.t('entity.name')}
          title={i18n.t('entity.entity_details')}
          placeholder={i18n.t('entity.enter_the_name_of_the_entity')}
          id={MetadataFields.Name}
          value={name}
          ref={metadataRef[MetadataFields.Name]}
          error={getErrorMessage(MetadataFields.Name)}
          onBlur={() => handleBlur(MetadataFields.Name)}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            methods.setName(event.target.value)
          }
        />
      </Column>

      <Column md={6}>
        <MarginInputFormContainer>
          <InputFormGroup
            label={i18n.t('entity.email')}
            placeholder={i18n.t('entity.email')}
            id={MetadataFields.Email}
            helpText={i18n.t(
              'entity.this_will_be_the_email_for_the_members_of_the_entity_to_contact_you'
            )}
            ref={metadataRef[MetadataFields.Email]}
            value={email}
            error={getErrorMessage(MetadataFields.Email)}
            onBlur={() => handleBlur(MetadataFields.Email)}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              methods.setEmail(event.target.value)
            }
          />
        </MarginInputFormContainer>
      </Column>

      <Column md={6}>
        <SelectFormGroup
          label={i18n.t('entity.type_of_entity')}
          placeholder={i18n.t('entity.type_of_entity')}
          id={MetadataFields.EntityType}
          value={entityType}
          options={SELECT_ORGANIZATION_TYPE}
          onChange={methods.setEntityType}
        />
      </Column>

      <Column md={6}>
        <SelectFormGroup
          label={i18n.t('entity.entity_size')}
          placeholder={i18n.t('entity.entity_size')}
          id={MetadataFields.EntityType}
          value={entitySize}
          options={SELECT_ORGANIZATION_SIZE}
          onChange={methods.setEntitySize}
        />
      </Column>

      <Column>
        <TextareaFormGroup
          title={i18n.t('entity.description')}
          label={i18n.t('entity.brief_description')}
          placeholder={i18n.t('entity.brief_description')}
          id={MetadataFields.Description}
          rows={4}
          onBlur={() => handleBlur(MetadataFields.Description)}
          error={getErrorMessage(MetadataFields.Description)}
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            methods.setDescription(e.target.value)
          }
        />
      </Column>
      <Column md={6}>
        <FileLoaderFormGroup
          title={i18n.t('entity.logo')}
          label={i18n.t('entity.logo_label')}
          onSelect={(file) => methods.setLogoFile(file)}
          onChange={methods.setLogoUrl}
          maxMbSize={2}
          ref={metadataRef[MetadataFields.Logo]}
          error={getErrorMessage(MetadataFields.Logo)}
          file={logoFile}
          url={logoUrl}
          accept=".jpg,.jpeg,.png,.gif"
        />
      </Column>

      <Column md={6}>
        <FileLoaderFormGroup
          title={i18n.t('entity.header')}
          label={i18n.t('entity.header_label')}
          onSelect={(file) => methods.setHeaderFile(file)}
          onChange={methods.setHeaderUrl}
          maxMbSize={2}
          ref={metadataRef[MetadataFields.Header]}
          error={getErrorMessage(MetadataFields.Header)}
          file={headerFile}
          url={headerUrl}
          accept=".jpg,.jpeg,.png,.gif"
        />
      </Column>

      <Column>
        <PolicyBanner>
          {i18n.t('entity.personal_data_protection_information')}
        </PolicyBanner>
        <OnPagePrivacy lang={lang} />

        <PendingStepsContainer>
          <FlexContainer alignItem={FlexAlignItem.Center}>
            <RoundedCheck
              size={RoundedCheckSize.Small}
              checked={terms}
              onClick={() => methods.setTerms(!terms)}
            />
            <Typography variant={TypographyVariant.Small} margin="0 10px">
              <Trans
                defaults={i18n.t('entity.i_have_read_and_accept_terms')}
                components={[
                  <a onClick={handleOpenEntityTermsModal} />,
                  <a href={PRIVACY_PATH} target="_blank" />,
                  <a onClick={handleOpenTermsModal} />,
                ]}
              />
            </Typography>
          </FlexContainer>
        </PendingStepsContainer>

        <PendingStepsContainer>
          <FlexContainer alignItem={FlexAlignItem.Center}>
            <RoundedCheck
              size={RoundedCheckSize.Small}
              checked={consent}
              onClick={() => methods.setConsent(!consent)}
            />
            <Typography variant={TypographyVariant.Small} margin="0 10px">
              <Trans
                defaults={i18n.t('entity.i_have_read_and_accept_personal_data')}
                components={[<a onClick={handleOpenPrivacyModal} />]}
              />
            </Typography>
          </FlexContainer>
        </PendingStepsContainer>
      </Column>

      <Column>
        <FlexContainer justify={FlexJustifyContent.End}>
          <Switch>
            <Case condition={!terms}>
              <Button disabled>
                {i18n.t('action.check_terms_and_conditions')}
              </Button>
            </Case>

            <Default>
              <Button positive onClick={onContinue}>
                {i18n.t('action.continue')}
              </Button>
            </Default>
          </Switch>
        </FlexContainer>
      </Column>

      <PrivacyModal
        visible={showPrivacyModal}
        onClosePrivacy={handleClosePrivacyModal}
      />

      <TermsModal
        visible={showTermsModal}
        onCloseTerms={handleCloseTermsModal}
      />

      <EntityTermsModal
        visible={showEntityTermsModal}
        onCloseEntityTerms={handleCloseEntityTermsModal}
      />
    </Grid>
  )
}

const PolicyBanner = styled.h3`
  font-size: 18px;
  font-weight: 600;
`

const PendingStepsContainer = styled.div`
  margin-bottom: 10px;
  a {
    cursor: pointer;
  }
`

const MarginInputFormContainer = styled.div`
  margin-top: 40px;

  @media ${({ theme }) => theme.screenMax.tablet} {
    margin-top: 10px;
  }
`
