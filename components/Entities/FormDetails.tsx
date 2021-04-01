import React, { ChangeEvent, Component } from 'react'
import { Checkbox } from '@aragon/ui'

import FileLoader from '../FileLoader'
import { UseEntityCreationContext } from '../../hooks/entity-creation'
import { StepProps } from '../../lib/types'
import { EMAIL_REGEX } from '../../lib/regex'
import { Column, Grid } from '../grid'
import { Input, Textarea } from '../inputs'
import i18n from '../../i18n'
import { Button } from '../button'

type State = {
  valid: boolean,
}

export default class FormDetails extends Component<StepProps, State> {
  static contextType = UseEntityCreationContext
  context !: React.ContextType<typeof UseEntityCreationContext>

  state = {
    valid: false,
  }

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
        <Column span={12}>
          <h2>{i18n.t('entity.new_entity')}</h2>
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
        <Column span={12}>
          <h2>{i18n.t('description')}</h2>
          <div>
            <label htmlFor='edesc'>{i18n.t('entity.introduction')}</label>
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
          <h2>{i18n.t('entity.logo')}</h2>
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
          <h2>{i18n.t('entity.header')}</h2>
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
        <Column span={12}>
          <label>
            <Checkbox
              checked={this.context.terms}
              onChange={this.context.setTerms}
            />
            I accept...
          </label>
        </Column>
        <Column span={12}>
          <Button
            positive
            onClick={() => this.props.setStep('FormPassword')}
            disabled={!this.valid}
          >
            {i18n.t('next_step')}
          </Button>
        </Column>
      </Grid>
    )
  }
}
