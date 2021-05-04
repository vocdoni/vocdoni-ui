import React, { ChangeEvent, useState } from 'react'
import { Checkbox } from '@aragon/ui'

import FileLoader from '../FileLoader'
import { useEntityCreation } from '../../hooks/entity-creation'
import { Column, Grid } from '../grid'
import { Input, Textarea } from '../inputs'
import i18n from '../../i18n'
import { Button } from '../button'
import styled from 'styled-components'
import { SectionText, SectionTitle, TextSize } from '../text'
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

export const FormMetadata = () => {
  const {
    name,
    description,
    email,
    logoFile,
    logoUrl,
    headerFile,
    headerUrl,
    methods,
    metadataValidationError,
  } = useEntityCreation()
  const [terms, setTerms] = useState<boolean>(false)
  const { setAlertMessage } = useMessageAlert()
  const { dbAccounts } = useDbAccounts()

  const onContinue = () => {
    if (metadataValidationError) {
      return setAlertMessage(metadataValidationError)
    } else if (
      dbAccounts.some(
        (acc) => acc.name.toLowerCase().trim() == name.toLowerCase().trim()
      )
    ) {
      return setAlertMessage(
        i18n.t('errors.there_is_already_one_entity_with_the_same_name')
      )
    }
    methods.setPageStep(EntityCreationPageSteps.CREDENTIALS)
  }

  const disabledContinue =
    !name ||
    !email ||
    !description ||
    (!headerFile && !headerUrl) ||
    (!logoFile && !logoUrl) ||
    !terms

  return (
    <Grid>
      <Column>
        <SectionText size={TextSize.Big}>{i18n.t('entity.entity_details')}</SectionText>
      </Column>
      <Column md={6}>
        <InputFormGroup
          label={i18n.t('entity.new_entity')}
          placeholder={i18n.t('entity.new_entity')}
          id='name'
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            methods.setName(event.target.value)
          }
        />
      </Column>
      <Column md={6}>
        <InputFormGroup
          label={i18n.t('entity.email')}
          placeholder={i18n.t('entity.email')}
          id='email'
          value={email}
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
          id='description'
          rows={4}
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
          file={headerFile}
          url={headerUrl}
          accept=".jpg,.jpeg,.png,.gif"
        />
      </Column>
      <Column>
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <Checkbox id='terms-check' checked={terms} onChange={setTerms} />

          <label htmlFor='terms-check' >
            {i18n.t(
              'entity.i_have_read_and_accept_the_privacy_policy_and_the_terms_of_service'
            )}
          </label>
        </FlexContainer>
      </Column>
      <Column>
        <FlexContainer justify={FlexJustifyContent.End}>
          <div />
          <Button positive onClick={onContinue} disabled={disabledContinue}>
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
