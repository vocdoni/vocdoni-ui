import React, { ChangeEvent, Component } from 'react'
import { Checkbox } from '@aragon/ui'

import FileLoader from '../FileLoader'
import { UseAccountContext } from '../../hooks/account'
import { StepProps } from '../../lib/types'
import { EMAIL_REGEX } from '../../lib/regex'

type State = {
  valid: boolean,
}

export default class FormDetails extends Component<StepProps, State> {
  static contextType = UseAccountContext
  context !: React.ContextType<typeof UseAccountContext>

  state = {
    valid: false,
  }

  get valid () {
    const required = ['name', 'email', 'description']
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
      <>
        <div>
          <div>
            <h2>Entity details</h2>
            <div>
              <label>Name of the entity</label>
              <input
                type='text'
                value={this.context.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  this.context.setName(e.target.value)
                }
              />
            </div>
            <div>
              <label>Contact e-mail</label>
              <input
                type='email'
                value={this.context.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  this.context.setEmail(e.target.value)
                }
              />
            </div>
          </div>
          <div>
            <h2>Description</h2>
            <div>
              <label>Optional introduction</label>
              <textarea
                value={this.context.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  this.context.setDescription(e.target.value)
                }
              />
            </div>
          </div>
          <div>
            <div>
              <h2>Entity logo</h2>
              <div>
                <FileLoader
                  onSelect={(file) => this.context.setLogoFile(file)}
                  onChange={this.context.setLogoUrl}
                  file={this.context.logoFile}
                  url={this.context.logoUrl}
                  accept='.jpg,.jpeg,.png'
                />
              </div>
            </div>
            <div>
              <h2>Entity header</h2>
              <div>
                <FileLoader
                  onSelect={(file) => this.context.setHeaderFile(file)}
                  onChange={this.context.setHeaderUrl}
                  file={this.context.headerFile}
                  url={this.context.headerUrl}
                  accept='.jpg,.jpeg,.png,.gif'
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <label>
            <Checkbox
              checked={this.context.terms}
              onChange={this.context.setTerms}
            />
            I accept...
          </label>
        </div>
        <button
          onClick={() => this.props.setStep('FormPassword')}
          disabled={!this.valid}
        >
          Next step
        </button>
      </>
    )
  }
}
