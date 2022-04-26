import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { ProcessDetails, EntityMetadata } from 'dvote-js'
import { useTranslation } from 'react-i18next'
import { useBlockHeight } from '@vocdoni/react-hooks'

import {
  Fieldset,
  FormGroupVariant,
  InputFormGroup,
  InputPasswordFormGroup,
} from '@components/blocks/form'
import { Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { SignInFormCard } from '@components/elements/cards'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { CardImageHeader } from '@components/blocks/card/image-header'
import { FormFieldsetContainer } from '../components/form-fieldset-container'
import { Col, Input, Row, Text } from '@components/elements-v2'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useUrlHash } from 'use-url-hash'
import { VoteStatus } from '@lib/util'
import moment from 'moment'

interface IFieldValues {
  [field: string]: string
}

interface IFormProps {
  fields: string[]
  values: IFieldValues
  secretKey: string
  submitEnabled?: boolean
  checkingCredentials?: boolean
  invalidCredentials?: boolean
  processInfo: ProcessDetails
  entity: EntityMetadata
  onChange: (field: string, value) => void
  onSubmit: () => void
  onChangeSecretKey
}

export const SignInForm = ({
  fields,
  submitEnabled,
  secretKey,
  onChangeSecretKey,
  processInfo,
  entity,
  checkingCredentials,
  invalidCredentials,
  onSubmit,
  onChange,
}: IFormProps) => {
  const { i18n } = useTranslation()
  const [sameInput, setSameInput] = useState(false)
  const showError = sameInput && invalidCredentials
  const processId = useUrlHash().slice(1)
  const { isAnonymous, status, startDate } = useProcessWrapper(processId)
  const showPreregisterTitle = isAnonymous && status === VoteStatus.Upcoming
  const showPasswordInput = isAnonymous && status === VoteStatus.Active
  const [colNumber, setColNumber] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onSubmit()
  }

  const { blockHeight } = useBlockHeight()

  return (
    <SignInFormCard>
      <CardImageHeader
        title={processInfo?.metadata?.title.default}
        processImage={processInfo?.metadata?.media.header}
        subtitle={entity?.name.default}
        entityImage={entity?.media.avatar}
      />
      <StyledFieldset disabled={checkingCredentials}>
        <Row gutter="xl">
          <Col xs={12}>
            <Text size="sm" weight="bold" color="dark-blue">
              {i18n.t('vote.auth.insert_your_credentials_and_password')}
            </Text>
          </Col>
          <Col xs={12}>
            <form onSubmit={handleSubmit}>
              <Row gutter="none">
                <Col xs={12} disableFlex>
                  <InputFormGroup
                    label={fields[0]}
                    id={fields[0]}
                    placeholder={i18n.t('vote.auth.insert_your', {
                      field: fields[0],
                    })}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      onChange(fields[0], e.target.value)
                      setColNumber(e.target.value)
                      setSameInput(false)
                    }}
                    value={colNumber}
                    variant={FormGroupVariant.Small}
                  />
                </Col>

                <Col xs={12} disableFlex>
                  <InputPasswordFormGroup
                    label={i18n.t('vote.auth.secret_key_label')}
                    id="secretKey"
                    placeholder={i18n.t('vote.auth.insert_your_secret_key')}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value)
                      onChangeSecretKey(e.target.value)
                      setSameInput(false)
                    }}
                    value={secretKey}
                    variant={FormGroupVariant.Small}
                  />
                </Col>
              </Row>
              <HiddenButton type="submit"></HiddenButton>
            </form>
          </Col>
          <Col xs={12}>
            <Row align="center" justify="center" gutter="xl">
              <Col xs={12} md={5} align="center" justify="center">
                <Button
                  wide
                  positive
                  onClick={() => {
                    onSubmit()
                    setSameInput(true)
                  }}
                  spinner={submitEnabled && checkingCredentials}
                  disabled={!submitEnabled || checkingCredentials || showError}
                >
                  {i18n.t('action.continue')}
                </Button>
              </Col>
              <Col xs={12} md={7}>
                {/*Error MSG*/}
                {showError && (
                  <Text color="error" size="sm" weight="bold">
                    {i18n.t('vote.credentials_not_accepted')}
                  </Text>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </StyledFieldset>
    </SignInFormCard>
  )
}

const HiddenButton = styled.button`
  visibility: hidden;
`

const StyledFieldset = styled.fieldset`
  max-width: 490px;
  width: 100%;
  border: none;
  margin: auto;
`
