import React, { ChangeEvent, useState, FormEvent, useEffect } from 'react'
import { OptionTypeBase } from 'react-select'
import styled from 'styled-components'
import Link from 'next/link'
import { usePool } from '@vocdoni/react-hooks'
import { useTranslation } from 'react-i18next'

import { Account } from '@lib/types'
import { ACCOUNT_RECOVER_PATH } from '@const/routes'

import { Select } from '@components/elements/inputs'
import { Button } from '@components/elements/button'
import { Fieldset, InputFormGroup } from '@components/blocks/form'

interface SignInFormProps {
  accounts: Account[]
  disabled?: boolean
  error?: string
  onSubmit: (account: Account, passphrase: string) => Promise<any>
}

export const SignInForm = ({
  accounts,
  disabled,
  error,
  onSubmit,
}: SignInFormProps) => {
  const { i18n } = useTranslation()
  const { poolPromise } = usePool()
  const [passphrase, setPassphrase] = useState<string>('')
  const [account, setAccount] = useState<Account>(accounts[0])
  const [loading, setLoading] = useState(false)
  
  const buttonDisabled = !passphrase || !account

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
      <FormGroup>
        <label>{i18n.t('sign_in.select_the_account')}</label>
        <Select
          options={selectOptions}
          value={{
            value: account.name,
            label: account.name,
          }}
          onChange={(selectedValue: OptionTypeBase) => {
            const selectedAccount = accounts.find((acc: Account) => acc.name == selectedValue.value)

            setAccount(selectedAccount)
          }}
        />
      </FormGroup>

      <form onSubmit={handlerSubmit}>
        <FormGroup>
          <InputFormGroup 
            label={i18n.t('sign_in.passphrase')}
            helpText={i18n.t('sign_in.write_your_passphrase')}
            type="password"
            error={error}
            value={passphrase}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassphrase(e.target.value)}
            placeholder={i18n.t('sign_in.passphrase')}
          />
        </FormGroup>

        <Link href={ACCOUNT_RECOVER_PATH}>{i18n.t('sign_in.forgot_your_password_restore_from_a_backup')}</Link>

        <ButtonContainer>
          <Button disabled={buttonDisabled} spinner={loading} large width={210} onClick={() => onContinue()} positive>
            {i18n.t('sign_in.continue')}
          </Button>
        </ButtonContainer>
      </form>
    </Fieldset>
  )
}

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
