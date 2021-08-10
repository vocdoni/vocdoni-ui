import React, { ChangeEvent, useState, FormEvent, useEffect } from 'react'
import { OptionTypeBase } from 'react-select'
import styled from 'styled-components'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'


import { Account } from '../../../lib/types'
import { ACCOUNT_RECOVER_PATH } from '../../../const/routes'

import { Fieldset } from '../../blocks/form'
import { Input, Select } from '../../elements/inputs'
import { SectionTitle, SectionText } from '../../elements/text'
import { Button } from '../../elements/button'
import { HelpText } from '@components/blocks/help-text'
import { usePool } from '@vocdoni/react-hooks'
import { useMessageAlert } from '@hooks/message-alert'

interface SignInFormProps {
  accounts: Account[]
  disabled?: boolean
  onSubmit: (account: Account, passphrase: string) => Promise<any>
}

export const SignInForm = ({
  accounts,
  disabled,
  onSubmit,
}: SignInFormProps) => {
  const { i18n } = useTranslation()
  const { poolPromise } = usePool()
  const [passphrase, setPassphrase] = useState<string>('')
  const [account, setAccount] = useState<Account>(accounts[0])
  const buttonDisabled = !passphrase || !account
  const { setAlertMessage } = useMessageAlert()
  const [loading, setLoading] = useState(false)

  const handlerSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!buttonDisabled) {
      onContinue()
    }
  }

  // callbacks
  const onContinue = () => {
    setLoading(true)
    poolPromise
      .then(() => onSubmit(account, passphrase))
      .catch((err) => {
        setLoading(false)
      })
  }

  const selectOptions = accounts.map((opt) => ({
    value: opt.name,
    label: opt.name,
  }))


  return (
    <Fieldset disabled={disabled}>
      <HeaderSection>
        <SectionTitle>{i18n.t('sign_in.sign_in')}</SectionTitle>
        <SectionText>
          {i18n.t(
            'sign_in.select_the_account_to_use_and_enter_your_passphrase'
          )}
        </SectionText>
      </HeaderSection>

      <FormGroup>
        <label>{i18n.t('sign_in.select_the_account')}</label>
        <Select
          options={selectOptions}
          value={{
            value: account.name,
            label: account.name,
          }}
          onChange={(selectedValue: OptionTypeBase) => {
            const selectedAccount = accounts.find(
              (acc: Account) => acc.name == selectedValue.value
            )

            setAccount(selectedAccount)
          }}
        />
      </FormGroup>

      <form onSubmit={handlerSubmit}>
        <FormGroup>
          <label htmlFor="passphrase">
            {i18n.t('sign_in.write_your_passphrase')}
            <HelpText text="" />
          </label>
          <Input
            wide
            id="passphrase"
            type="password"
            value={passphrase}
            placeholder={i18n.t('sign_in.passphrase')}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassphrase(e.target.value)
            }
          />
        </FormGroup>

        <Link href={ACCOUNT_RECOVER_PATH}>
          {i18n.t('sign_in.forgot_your_password_restore_from_a_backup')}
        </Link>

        <ButtonContainer>
          <Button
            disabled={buttonDisabled}
            spinner={loading}
            large
            width={210}
            onClick={() => onContinue()}
            positive
          >
            {i18n.t('sign_in.continue')}
          </Button>
        </ButtonContainer>
      </form>
    </Fieldset>
  )
}

const HeaderSection = styled.div`
  padding-bottom: 22px;
`

const FormGroup = styled.div`
  padding-bottom: 18px;
  padding-top: 18px;
`

const ButtonContainer = styled.div`
  margin-top: 56px;

  @media ${({ theme }) => theme.screenMax.laptop} {
    display: flex;
    justify-content: center;
  }
`
