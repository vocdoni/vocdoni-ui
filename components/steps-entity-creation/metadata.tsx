import React, { ChangeEvent, useEffect, useState } from 'react'
import { Checkbox } from '@aragon/ui'

import { useEntityCreation } from '../../hooks/entity-creation'
import { Column, Grid } from '../grid'
import i18n from '../../i18n'
import { Button } from '../button'
import styled from 'styled-components'
import { SectionText, TextSize } from '../text'
import { EntityCreationPageSteps } from '.'
import { useMessageAlert } from '../../hooks/message-alert'
import { useDbAccounts } from '../../hooks/use-db-accounts'
import {
  FileLoaderFormGroup,
  InputFormGroup,
  TextareaFormGroup,
} from '@components/form'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/flex'
import { DirtyFields, ErrorFields } from '@lib/validators'
import { entityMetadataValidator } from './metadata-validator'
import { Label } from '@components/label'
import { colors } from 'theme/colors'

export enum MetadataFields {
  Name = 'name',
  Description = 'description',
  Email = 'email',
  Header = 'header',
  Logo = 'logo',
  Terms = 'terms',
}

export const FormMetadata = () => {
  const {
    name,
    description,
    email,
    logoFile,
    logoUrl,
    headerFile,
    headerUrl,
    terms,
    methods,
    metadataValidationError,
  } = useEntityCreation()
  const [metadataErrors, setMetadataErrors] = useState<ErrorFields>(new Map())
  const [dirtyFields, setDirtyField] = useState<DirtyFields>(new Map())
  const { setAlertMessage } = useMessageAlert()
  const { dbAccounts } = useDbAccounts()

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
    terms,
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
    if (
      dbAccounts.some(
        (acc) => acc.name.toLowerCase().trim() == name.toLowerCase().trim()
      )
    ) {
      return setAlertMessage(
        i18n.t('errors.there_is_already_one_entity_with_the_same_name')
      )
    }

    if (!metadataErrors.size) {
      methods.setPageStep(EntityCreationPageSteps.CREDENTIALS)
    } else {
      dirtyAllFields()
    }
  }

  return (
    <Grid>
      <Column>
        <SectionText size={TextSize.Big}>
          {i18n.t('entity.entity_details')}
        </SectionText>
      </Column>

      <Column md={6}>
        <InputFormGroup
          label={i18n.t('entity.new_entity')}
          placeholder={i18n.t('entity.new_entity')}
          id={MetadataFields.Name}
          value={name}
          error={getErrorMessage(MetadataFields.Name)}
          onBlur={() => handleBlur(MetadataFields.Name)}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            methods.setName(event.target.value)
          }
        />
      </Column>

      <Column md={6}>
        <InputFormGroup
          label={i18n.t('entity.email')}
          placeholder={i18n.t('entity.email')}
          id={MetadataFields.Email}
          helpText={i18n.t(
            'entity.this_will_be_the_email_for_the_members_of_the_entity_to_contact_you'
          )}
          value={email}
          error={getErrorMessage(MetadataFields.Email)}
          onBlur={() => handleBlur(MetadataFields.Email)}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            methods.setEmail(event.target.value)
          }
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
          label={i18n.t('entity.logo')}
          onSelect={(file) => methods.setLogoFile(file)}
          onChange={methods.setLogoUrl}
          error={getErrorMessage(MetadataFields.Logo)}
          file={logoFile}
          url={logoUrl}
          accept=".jpg,.jpeg,.png,.gif"
        />
      </Column>

      <Column md={6}>
        <FileLoaderFormGroup
          title={i18n.t('entity.header')}
          label={i18n.t('entity.header')}
          onSelect={(file) => methods.setHeaderFile(file)}
          onChange={methods.setHeaderUrl}
          error={getErrorMessage(MetadataFields.Header)}
          file={headerFile}
          url={headerUrl}
          accept=".jpg,.jpeg,.png,.gif"
        />
      </Column>

      <Column>
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <Checkbox id="terms-check" checked={terms} onChange={() => methods.setTerms(!terms)} />

          <Label htmlFor="terms-check">
            {i18n.t(
              'entity.i_have_read_and_accept_the_privacy_policy_and_the_terms_of_service'
            )}
          </Label>
        </FlexContainer>
        <div>
          {getErrorMessage(MetadataFields.Terms) ? (
            <SectionText color={colors.danger} size={TextSize.Small}>
              {getErrorMessage(MetadataFields.Terms)}
            </SectionText>
          ) : null}
        </div>
      </Column>

      <Column>
        <FlexContainer justify={FlexJustifyContent.End}>
          <Button positive onClick={onContinue}>
            {i18n.t('action.continue')}
          </Button>
        </FlexContainer>
      </Column>
    </Grid>
  )
}

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
