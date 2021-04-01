import React, { ChangeEvent, Component } from 'react'
import { Checkbox } from '@aragon/ui'

import { UseEntityCreationContext } from '../../hooks/entity-creation'
import { StepProps } from '../../lib/types'
import { Column, Grid } from '../grid'

type State = {
  password: string,
  passwordRepeat: string,
  ack: boolean,
}

export default class NewEntityCredentials extends Component<StepProps, State> {
  static contextType = UseEntityCreationContext
  context !: React.ContextType<typeof UseEntityCreationContext>

  state: State = {
    password: '',
    passwordRepeat: '',
    ack: false,
  }

  componentDidMount() {
    // ensure we don't have the password stored
    this.context.setPassword('')
  }

  get valid() {
    const required = ['password', 'passwordRepeat']
    for (const req of required) {
      if (!this.state[req].length) {
        return false
      }
    }

    if (this.state.password !== this.state.passwordRepeat) {
      return false
    }

    return this.state.ack
  }

  gotoNext() {
    this.context.setPassword(this.state.password)

    this.props.setStep('NewEntityCreation')
  }

  render() {
    return (
      <Grid>
        <Column span={12}>
          <h2>Choose a passphrase</h2>
        </Column>
        <Column span={6}>
          <label htmlFor='pwd'>Passphrase</label>
          <input
            id='pwd'
            type='password'
            value={this.state.password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.setState({ password: e.target.value })
            }
          />
        </Column>
        <Column span={6}>
          <label htmlFor='rep'>Repeat passphrase</label>
          <input
            id='rep'
            type='password'
            value={this.state.passwordRepeat}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.setState({ passwordRepeat: e.target.value })
            }
          />
        </Column>
        <Column span={12}>
          <label>
            <Checkbox
              checked={this.state.ack}
              onChange={(ack: boolean) => this.setState({ ack })}
            />
            I ack...
          </label>
        </Column>
        <Column span={6}>
          <button onClick={() => this.props.setStep('NewEntityDetails')}>
            Back
          </button>
        </Column>
        <Column span={6}>
          <button
            onClick={this.gotoNext.bind(this)}
            disabled={!this.valid}
          >
            Next step
          </button>
        </Column>
      </Grid>
    )
  }
}
