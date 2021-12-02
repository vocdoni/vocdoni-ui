import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { SignInFormCard } from '@components/elements/cards'
import { EntityMetadata, ProcessDetails, VotingApi } from 'dvote-js'
import { useTranslation } from 'react-i18next'
import { CardImageHeader } from '@components/blocks/card'
import { FormFieldsetContainer } from './components/form-fieldset-container'
import { InputFormGroup, InputPasswordFormGroup } from '@components/blocks/form'
import { checkStrength } from '@lib/util'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { useBlockStatus } from '@vocdoni/react-hooks'
import { Banner, BannerSize, BannerVariant } from '@components/blocks/banner_v2'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { ImageContainer } from '@components/elements/images'
import { colors } from '@theme/colors'
import { PasswordFeedbackSuccess } from '@components/blocks/password-feedback-success'
import { Button } from '@components/elements/button'

export enum PreregisterFormFields {
  Password = 'password',
  PasswordConfirm = 'passwordConfirm',
}

export interface IPreregisterData {
  [PreregisterFormFields.Password]: string
  [PreregisterFormFields.PasswordConfirm]: string
}

interface IPreregisterViewProps {
  submitEnabled?: boolean
  generatingProof?: boolean
  process: ProcessDetails
  entity: EntityMetadata
  values: IPreregisterData
  onChange: (data: IPreregisterData) => void
  onSubmit: () => void
}

export const PreregisterView = ({
  process,
  generatingProof,
  entity,
  values,
  onChange,
  onSubmit,
}: IPreregisterViewProps) => {
  const [errorPassword, setErrorPassword] = useState<string>('')
  const { i18n } = useTranslation()
  const { blockStatus } = useBlockStatus()
  const processStartDate = VotingApi.estimateDateAtBlockSync(
    process?.state?.startBlock,
    blockStatus
  )

  const parsedStartDate = `(${processStartDate
    .getDate()
    .toLocaleString('en-US', { minimumIntegerDigits: 2 })}/${
    (
      processStartDate.getMonth() + 1
    ).toLocaleString('en-US', { minimumIntegerDigits: 2 })
    }/${processStartDate.getFullYear()})`

  useEffect((): void => {
    setErrorPassword(checkStrength(values.password))
  }, [values])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('goes to submit')
    if (!submitDisabled) {
      onSubmit()
    }
  }

  const handleChangePassword = (event) => {
    const fieldName = event.target.name as PreregisterFormFields
    const fieldValue = event.target.value
    const newData = { ...values, [fieldName]: fieldValue }

    onChange(newData)
  }

  const passwordMatch =
    values.password && values.password === values.passwordConfirm

  const submitDisabled = !!checkStrength(values.password) || !passwordMatch

  return (
    <SignInFormCard>
      <CardImageHeader
        title={process?.metadata?.title.default}
        processImage={process?.metadata?.media.header}
        subtitle={entity?.name.default}
        entityImage={entity?.media.avatar}
      />
      <FormFieldsetContainer disabled={generatingProof}>
        <div>
          <Typography variant={TypographyVariant.Small}>
            <strong>
              {i18n.t('votes.preregister_view.set_password_of_authentication')}
            </strong>
          </Typography>

          <Typography variant={TypographyVariant.MediumSmall}>
            {i18n.t(
              'votes.preregister_view.when_the_process_start_at_date_in_order_to_vote_anonymously',
              { date: parsedStartDate }
            )}
          </Typography>
        </div>

        <BannerContainer>
          <Banner variant={BannerVariant.Secondary} size={BannerSize.Small}>
            <FlexContainer>
              <ImageContainer width="22px">
                <img src="/icons/common/exclamation.svg" />
              </ImageContainer>
              <Typography
                variant={TypographyVariant.Body2}
                margin="0 0 0 16px"
                color={colors.textAccent2}
              >
                {i18n.t('votes.preregister_view.important')}
              </Typography>
            </FlexContainer>
            <Typography
              variant={TypographyVariant.Small}
              margin="20px 0 0 0"
              color={colors.lightText}
            >
              {i18n.t(
                'votes.preregister_view.the_password_that_you_set_will_not_be_possible'
              )}
            </Typography>
          </Banner>
        </BannerContainer>

        <form onSubmit={handleSubmit}>
          <InputPasswordFormGroup
            label={i18n.t('votes.preregister_view.password')}
            placeholder={i18n.t('votes.preregister_view.insert_password')}
            info={errorPassword}
            value={values.password}
            name={PreregisterFormFields.Password}
            onChange={handleChangePassword}
          />

          <InputPasswordFormGroup
            label={i18n.t('votes.preregister_view.repeat')}
            placeholder={i18n.t('votes.preregister_view.insert_password_again')}
            success={passwordMatch && <PasswordFeedbackSuccess />}
            value={values.passwordConfirm}
            name={PreregisterFormFields.PasswordConfirm}
            onChange={handleChangePassword}
          />
        </form>

        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <Button color={colors.accent1}>
            {i18n.t('votes.preregister_view.back')}
          </Button>

          <Button positive disabled={submitDisabled} onClick={handleSubmit}>
            {i18n.t('votes.preregister_view.next')}
          </Button>
        </FlexContainer>
      </FormFieldsetContainer>
    </SignInFormCard>
  )
}

const BannerContainer = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;
`
