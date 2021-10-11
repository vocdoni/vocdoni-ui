import React, { useState, useEffect } from 'react'
import { Modal } from 'react-rainbow-components'
import styled from 'styled-components'
import LogInCircle from 'remixicon/icons/System/login-circle-line.svg'
import { useRecoilValueLoadable } from 'recoil'
import { useTranslation } from 'react-i18next'

import { SignInForm } from '@components/blocks/sign-in-form'
import { TextAlign, Typography, TypographyVariant } from '@components/elements/typography'

import { AccountsState } from '@recoil/atoms/accounts'

import { Account, AccountStatus } from '@lib/types'

import { useWallet } from '@hooks/use-wallet'
import { useMessageAlert } from '@hooks/message-alert'
import { Button } from '@components/elements/button'
import { FlexAlignItem, FlexContainer, FlexJustifyContent } from '@components/elements/flex'

interface ISignInModalProps {
  isOpen: boolean
  onClose: () => void
  onLogIn: () => void
  onSignUp: () => void
}

enum SignInModalState {
  step1,
  step2,
}

export const SignInModal = ({ isOpen, onLogIn, onSignUp, onClose }: ISignInModalProps) => {
  const { i18n } = useTranslation()
  const { state: accountState, contents: accounts } = useRecoilValueLoadable(AccountsState)
  const { setAlertMessage } = useMessageAlert()
  const { restoreEncryptedWallet } = useWallet()
  const [signInModalState, setSignInModalState] = useState<SignInModalState>(SignInModalState.step1)

  const [verifyingCredentials, setVerifyingCredentials] = useState<boolean>(false)

  useEffect(() => {
    if (isOpen) {
      setSignInModalState(SignInModalState.step1)
    }
  }, [isOpen])

  const handlerSubmit = (account: Account, passphrase: string): Promise<any> => {
    setVerifyingCredentials(true)
    console.log('todo ha ido bien vas a hacer log in')

    try {
      console.log('justo antes')

      restoreEncryptedWallet(account.encryptedMnemonic, account.hdPath, passphrase)
      // Did we start creating an account that is not ready yet?
      console.log('todo ha ido bien vas a hacer log in')


      onLogIn()
    } catch (error) {
      console.log('error', error)
      setVerifyingCredentials(false)
      setAlertMessage(i18n.t('sign_in.invalid_passphrase'))
      return Promise.reject(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      {signInModalState === SignInModalState.step1 && (
        <ModalContainer alignItem={FlexAlignItem.Center}>
          <LoginContainer>
            <LogInCircle width="60px" />
          </LoginContainer>
          <Typography variant={TypographyVariant.H3} align={TextAlign.Center}>
            {i18n.t('pricing.sign_in_modal.sign_in_to_continue')}
          </Typography>

          <Typography variant={TypographyVariant.Body1} align={TextAlign.Center}>
            {i18n.t('pricing.sign_in_modal.before_you_can_proceed_to_checkout_please_sign_in_to_account')}
          </Typography>

          <ButtonContainer>
            <Button wide onClick={() => setSignInModalState(SignInModalState.step2)} positive>
              {i18n.t('pricing.sign_in_modal.login')}
            </Button>
          </ButtonContainer>

          <FlexContainer justify={FlexJustifyContent.Center}>
            <Typography variant={TypographyVariant.Link} onClick={onSignUp}>
              {i18n.t('pricing.sign_in_modal.dont_have_an_account_yet')}
            </Typography>
          </FlexContainer>
        </ModalContainer>
      )}
      {signInModalState === SignInModalState.step2 && (
        <>
          <Typography variant={TypographyVariant.H3} align={TextAlign.Center}>
            {i18n.t('pricing.sign_in_modal.login')}
          </Typography>

          {accountState == 'hasValue' && (
            <SignInForm accounts={accounts} onSubmit={handlerSubmit} disabled={verifyingCredentials} />
          )}
        </>
      )}
    </Modal>
  )
}

const LoginContainer = styled.div`
  margin: 0 auto;
`

const ButtonContainer = styled.div`
  margin: 20px auto 40px;
  width: 240px;
`

const ModalContainer = styled(FlexContainer)`
  min-width: 400px;
  min-height: 300px;
  flex-direction: column;
  padding: 40px;
`
