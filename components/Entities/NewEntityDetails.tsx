import React, { ChangeEvent, Component } from 'react'
import { Checkbox } from '@aragon/ui'

import FileLoader from '../FileLoader'
import { UseEntityCreationContext } from '../../hooks/entity-creation'
import { NewEntityStepProps } from '../../lib/types'
import { EMAIL_REGEX } from '../../lib/regex'
import { Column, Grid } from '../grid'
import { Input, Textarea } from '../inputs'
import i18n from '../../i18n'
import { Button } from '../button'
import styled from 'styled-components'
import { SectionTitle } from '../text'

type State = {}

export default class FormDetails extends Component<NewEntityStepProps, State> {
  static contextType = UseEntityCreationContext
  context !: React.ContextType<typeof UseEntityCreationContext>

  get valid() {
    const required = ['name', 'email']
    for (const req of required) {
      if (!this.context[req].length) {
        return false
      }
    }

    if (!EMAIL_REGEX.test(this.context.email)) {
      return false
    }

    const files = ['logo', 'header']
    for (const file of files) {
      if (this.context[`${file}File`] === null && !this.context[`${file}Url`].length) {
        return false
      }
    }

    if (!this.context.terms) {
      return false
    }

    return true
  }

  render() {
    return (
      <Grid>
        <Column>
          <SectionTitle>{i18n.t('entity.new_entity')}</SectionTitle>
        </Column>
        <Column md={6}>
          <label htmlFor='name'>{i18n.t('entity.name')}</label>
          <Input
            wide
            id='name'
            type='text'
            value={this.context.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.context.setName(e.target.value)
            }
          />
        </Column>
        <Column md={6}>
          <label htmlFor='email'>{i18n.t('entity.email')}</label>
          <Input
            wide
            id='email'
            type='email'
            value={this.context.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.context.setEmail(e.target.value)
            }
          />
        </Column>
        <Column>
          <SectionTitle bottomMargin>{i18n.t('entity.description')}</SectionTitle>
          <div>
            <label htmlFor='edesc'>{i18n.t('entity.brief_description')}</label>
            <Textarea
              wide
              id='edesc'
              value={this.context.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                this.context.setDescription(e.target.value)
              }
            />
          </div>
        </Column>
        <Column md={6}>
          <SectionTitle>{i18n.t('entity.logo')}</SectionTitle>
          <div>
            <FileLoader
              onSelect={(file) => this.context.setLogoFile(file)}
              onChange={this.context.setLogoUrl}
              file={this.context.logoFile}
              url={this.context.logoUrl}
              accept='.jpg,.jpeg,.png'
            />
          </div>
        </Column>
        <Column md={6}>
          <SectionTitle>{i18n.t('entity.header')}</SectionTitle>
          <div>
            <FileLoader
              onSelect={(file) => this.context.setHeaderFile(file)}
              onChange={this.context.setHeaderUrl}
              file={this.context.headerFile}
              url={this.context.headerUrl}
              accept='.jpg,.jpeg,.png,.gif'
            />
          </div>
        </Column>
        <Column>
          <label>
            <Checkbox
              checked={this.context.terms}
              onChange={this.context.setTerms}
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
        </Column>
      </Grid>
    )
  }
}

const BottomDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`
