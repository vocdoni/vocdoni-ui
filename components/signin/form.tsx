import React, { ChangeEvent, useState, FormEvent, useEffect } from 'react'
import { OptionTypeBase } from 'react-select';
import styled from 'styled-components'
import Link from 'next/link'

import i18n from '../../i18n'

import { Account } from '../../lib/types'
import { ENTITY_FORGOT_PASSPHRASE_PATH } from '../../const/routes'

import { Fieldset } from '../form'
import { Input, Select } from '../inputs'
import { SectionTitle, SectionText } from '../text'
import { Button } from '../button'
import { HelpText } from '@components/common/help-text';

interface SignInFormProps {
  accounts: Account[]
  disabled?: boolean
  onSubmit: (account: Account, passphrase: string) => void
}

export const SignInForm = ({ accounts, disabled, onSubmit }: SignInFormProps) => {
  const [passphrase, setPassphrase] = useState<string>('')
  const [account, setAccount] = useState<Account>()
  const [selectOptions, setSelectOptions] = useState<OptionTypeBase[]>([])
  const buttonDisabled = !passphrase || !account

  const handlerSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!buttonDisabled) {
      onSubmit(account, passphrase)
    }
  }

  useEffect(() => {
    const options = accounts.map((opt) => ({
      value: opt.name,
      label: opt.name,
    }))

    setSelectOptions(options)
  }, [accounts])

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
            <HelpText text=''/>
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

        <Link href={ENTITY_FORGOT_PASSPHRASE_PATH}>
          {i18n.t('sign_in.forgot_your_password_restore_from_a_backup')}
        </Link>

        <ButtonContainer>
          <Button
            disabled={buttonDisabled}
            large
            width={210}
            onClick={() => onSubmit(account, passphrase)}
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
