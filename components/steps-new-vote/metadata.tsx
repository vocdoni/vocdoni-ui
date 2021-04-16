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

export const FormMetadata = () => {
  const { headerURL, headerFile, metadata, parameters, methods } = useProcessCreation()

  const valid = () => {
    if (!metadata.title.default.length || !(headerFile || headerURL)) {
      return false
    }
    // TODO: Add more here
    try {
      methods.setRawMetadata(checkValidProcessMetadata(metadata))
    } catch (error) {
      throw new Error(i18n.t('error.invalid_metadata'))
    }
    return true
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
          <div />
          <Button
            negative
            // onClick=
          >
            {i18n.t("action.preview_proposal")}
          </Button>
          <Button
            positive
            onClick={() => methods.setPageStep(ProcessCreationPageSteps.CENSUS)}
            disabled={!valid()}
          >
            {i18n.t("action.continue")}
          </Button>
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
