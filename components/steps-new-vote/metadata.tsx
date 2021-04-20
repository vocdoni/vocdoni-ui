import React, { ChangeEvent, Component, useState } from 'react'
import { Checkbox } from '@aragon/ui'

import FileLoader from '../FileLoader'
import { useProcessCreation } from '../../hooks/process-creation'
import { Column, Grid } from '../grid'
import { Input, Textarea } from '../inputs'
import { checkValidProcessMetadata } from "dvote-js"
import i18n from '../../i18n'
import { Button } from '../button'
import styled from 'styled-components'
import { SectionTitle } from '../text'
import { ProcessCreationPageSteps } from '.'
import { useMessageAlert } from '../../hooks/message-alert'

export const FormMetadata = () => {
  const { headerURL, headerFile, metadata, parameters, methods } = useProcessCreation()
  const { setAlertMessage } = useMessageAlert()

  const hasCompleteMetadata = () => {
    if (!metadata.title.default.length || !(headerFile || headerURL)) {
      return false
    }
    // TODO: Add completeness tests here
    return true
  }

  const onPreview = () => {
    // TODO: 
  }

  const onContinue = () => {
    // TODO: Check for correctness
    // TODO: at least one question
    // TODO: at least 2 choices each


    try {
      const validatedMeta = checkValidProcessMetadata(metadata)
      methods.setRawMetadata(validatedMeta)

      methods.setPageStep(ProcessCreationPageSteps.CENSUS)
    } catch (error) {
      setAlertMessage(i18n.t('error.the_vote_details_are_invalid'))
    }
  }

  return (
    <Grid>
      <Column>
        <SectionTitle>{i18n.t('vote.new_vote')}</SectionTitle>
      </Column>
      <Column>
        <label htmlFor='title'>{i18n.t('vote.title')}</label>
        <Input
          wide
          id='title'
          type='text'
          value={metadata.title.default}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            methods.setTitle(e.target.value)
          }
        />
      </Column>
      <Column>
        <SectionTitle bottomMargin>{i18n.t('vote.description')}</SectionTitle>
        <div>
          <label htmlFor='edesc'>{i18n.t('vote.brief_description')}</label>
          <Textarea
            wide
            id='edesc'
            value={metadata.description.default}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              methods.setDescription(e.target.value)
            }
          />
        </div>
      </Column>
      <Column md={6}>
        <SectionTitle>{i18n.t('vote.header')}</SectionTitle>
        <div>
          <FileLoader
            onSelect={(file) => methods.setHeaderFile(file)}
            onChange={methods.setHeaderURL}
            file={headerFile}
            url={headerURL}
            accept='.jpg,.jpeg,.png,.gif'
          />
        </div>
      </Column>
      <Column>
        <BottomDiv>
          <div /> {/* left space holder */}
          <div>
            <Button
              negative
              onClick={onPreview}
            >
              {i18n.t("action.preview_proposal")}
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              positive
              onClick={onContinue}
              disabled={!hasCompleteMetadata()}
            >
              {i18n.t("action.continue")}
            </Button>
          </div>
        </BottomDiv>
      </Column>
    </Grid>
  )
}

const BottomDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`
