import React, { ChangeEvent, Component } from 'react'
import { Checkbox } from '@aragon/ui'

import { UseAccountContext } from '../../hooks/account'
import { StepProps } from '../../lib/types'

type State = {
  password: string,
  passwordRepeat: string,
  ack: boolean,
}

export default class FormPassword extends Component<StepProps, State> {
  static contextType = UseAccountContext
  context !: React.ContextType<typeof UseAccountContext>

  state : State = {
    password: '',
    passwordRepeat: '',
    ack: false,
  }

  componentDidMount() {
    // ensure we don't have the password stored
    this.context.setPassword('')
  }

  get valid () {
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

    this.props.setStep('Creation')
  }

  render() {
    return (
      <>
        <div>
          <h2>Choose a passphrase</h2>
          <div>
            <label>Passphrase</label>
            <input
              type='password'
              value={this.state.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.setState({password: e.target.value})
              }
            />
          </div>
          <div>
            <label>Repeat passphrase</label>
            <input
              type='password'
              value={this.state.passwordRepeat}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                this.setState({passwordRepeat: e.target.value})
              }
            />
          </div>
        </div>
        <div>
        <label>
            <Checkbox
              checked={this.state.ack}
              onChange={(ack: boolean) => this.setState({ack})}
            />
            I ack...
          </label>
        </div>
        <div>
          <button onClick={() => this.props.setStep('FormDetails')}>
            Back
          </button>
          <button
            onClick={this.gotoNext.bind(this)}
            disabled={!this.valid}
          >
            Next step
          </button>
        </div>
      </>
    )
  }
}
