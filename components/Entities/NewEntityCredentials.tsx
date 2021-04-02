import React, { ChangeEvent, Component } from 'react'
import { Checkbox } from '@aragon/ui'

import { UseEntityCreationContext } from '../../hooks/entity-creation'
import { NewEntityStepProps } from '../../lib/types'
import { Column, Grid } from '../grid'
import { Input } from '../inputs'
import { Button } from '../button'
import styled from 'styled-components'
import i18n from '../../i18n'

type State = {
  password: string,
  passwordRepeat: string,
  ack: boolean,
}

export default class NewEntityCredentials extends Component<NewEntityStepProps, State> {
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

  validate(): string {
    const required = ['password', 'passwordRepeat']
    for (const req of required) {
      if (!this.state[req].length) {
        return i18n.t("errors.choose_passphrase_and_repeat_it")
      }
    }

    if (this.state.password !== this.state.passwordRepeat) {
      return i18n.t("errors.passphrases_do_not_match")
    }

    if (!this.state.ack) return i18n.t("errors.please_accept_credentials_tos")
    return null
  }

  gotoNext() {
    this.context.setPassword(this.state.password)

    this.props.setStep('NewEntityCreation')
  }

  render() {
    const err = this.validate()

    return (
      <Grid>
        <Column span={12}>
          <h2>{i18n.t("entity.choose_a_passphrase")}</h2>
        </Column>
        <Column md={6}>
          <label htmlFor='pwd'>{i18n.t("entity.passphrase")}</label>
          <Input
            id='pwd'
            wide
            type='password'
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />
        </Column>
        <Column md={6}>
          <label htmlFor='rep'>{i18n.t("entity.repeat_passphrase")}</label>
          <Input
            id='rep'
            wide
            type='password'
            value={this.state.passwordRepeat}
            onChange={e => this.setState({ passwordRepeat: e.target.value })}
          />
        </Column>
        <Column>
          <label>
            <Checkbox
              checked={this.state.ack}
              onChange={(ack: boolean) => this.setState({ ack })}
            />
            I ack...
          </label>
        </Column>
        <Column>
          <BottomDiv>
            <Button border onClick={() => this.props.setStep('NewEntityDetails')}>
              {i18n.t("steps.go_back")}
            </Button>
            <Button
              positive
              onClick={this.gotoNext.bind(this)}
              disabled={!!err}
            >
              {i18n.t("steps.continue")}
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
