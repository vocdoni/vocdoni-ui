import React, { ChangeEvent, Component } from 'react'
import { Checkbox } from '@aragon/ui'

import FileLoader from '../FileLoader'
import { useVoteCreation } from '../../hooks/vote-creation'
import { NewVoteStepProps } from '../../lib/types'
import { Column, Grid } from '../grid'
import { Input, Textarea } from '../inputs'
import i18n from '../../i18n'
import { Button } from '../button'
import styled from 'styled-components'
import { SectionTitle } from '../text'

export const FormDetails = (props: NewVoteStepProps) => {
  const { metadata, parameters, methods } = useVoteCreation()

  const valid = () => {
    const required = ['title', 'description']
    for (const req of required) {
      if (!metadata[req].length) {
        return false
      }
    }
    // TODO: Add more here
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
      {/* <Column md={6}>
        <SectionTitle>{i18n.t('vote.logo')}</SectionTitle>
        <div>
          <FileLoader
            onSelect={(file) => methods.setLogoFile(file)}
            onChange={methods.setLogoUrl}
            file={metadata.logoFile}
            url={metadata.logoUrl}
            accept='.jpg,.jpeg,.png'
          />
        </div>
      </Column>
      <Column md={6}>
        <SectionTitle>{i18n.t('vote.header')}</SectionTitle>
        <div>
          <FileLoader
            onSelect={(file) => methods.setHeaderFile(file)}
            onChange={methods.setHeaderUrl}
            file={metadata.headerFile}
            url={metadata.headerUrl}
            accept='.jpg,.jpeg,.png,.gif'
          />
        </div>
      </Column>
      <Column>
        <label>
          <Checkbox
            checked={metadata.terms}
            onChange={methods.setTerms}
          />
            I accept...
          </label>
      </Column>
      <Column>
        <BottomDiv>
          <div />
          <Button
            positive
            onClick={() => this.props.setStep('NewEntityCredentials')}
            disabled={!this.valid}
          >
            {i18n.t("action.continue")}
          </Button>
        </BottomDiv>
      </Column> */}
    </Grid>
  )
}

const BottomDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`
