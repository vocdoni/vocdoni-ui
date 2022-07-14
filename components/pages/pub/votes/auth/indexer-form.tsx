import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { ProcessDetails, EntityMetadata } from 'dvote-js'
import { useTranslation } from 'react-i18next'

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
import { useUrlHash } from "use-url-hash"
import { VoteStatus } from '@lib/util'
import moment from 'moment'
import { Icon } from '@components/elements-v2/icons'

interface IFieldValues {
  [field: string]: string
}

interface IFormProps {
  landing: boolean
  fields: string[]
  values: IFieldValues
  submitEnabled?: boolean
  checkingCredentials?: boolean
  invalidCredentials?: boolean
  entity: EntityMetadata
  onChange: (field: string, value) => void
  onSubmit: () => void
}

export const IndexerForm = ({
  landing,
  fields,
  submitEnabled,
  values,
  entity,
  checkingCredentials,
  invalidCredentials,
  onSubmit,
  onChange,
}: IFormProps) => {
  const { i18n } = useTranslation()
  const [sameInput, setSameInput] = useState(false)
  const showError = sameInput && invalidCredentials
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onSubmit()
    setSameInput(true)
  }

  return (
    <SignInFormCard>
      <CardImageHeader
        title={entity?.name.default}
        processImage={entity?.media.header}
        subtitle={""}
        entityImage={entity?.media.avatar}
        logged={false}
      />

    { landing &&
      <NotStarted>
        <br /><br /><br /><br /><br /><br />
        <Row gutter='4xl'>
          <Col xs={12} justify="center">
            <Text size='lg' color='dark-blue' align='center'>
              <strong>{i18n.t('fcb.starting')}</strong>
            </Text>
          </Col>
        </Row>
        <br /><br /><br /><br /><br /><br /><br /><br />
      </NotStarted>
    }

    { !landing &&
      <StyledFieldset disabled={checkingCredentials}>
        <Row gutter='xl'>
          {/* <Col xs={12}>
            <Text size='sm' weight='bold' color='dark-blue'>
              {showPasswordInput ?
                i18n.t('vote.auth.insert_your_credentials_and_password') :
                i18n.t('vote.auth.insert_your_credentials')
              }
            </Text>
          </Col> */}
          <Col xs={12}>
            <Text size='sm' color='dark-blue'>
              {i18n.t('fcb.login_text')}
            </Text>
          </Col>
          <Col xs={12}>
            <form onSubmit={handleSubmit}>
              <Row gutter='none'>
                  <Col xs={12} disableFlex key={0}>
                    <InputFormGroup
                      label={i18n.t('vote.auth.member_key')}
                      id={"clauSoci"}
                      placeholder={i18n.t('vote.auth.insert_your_member_key')}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChange("clauSoci", e.target.value)
                        setSameInput(false)
                      }}
                      value={values["clauSoci"]}
                      variant={FormGroupVariant.Small}
                    />
                  </Col>
                  <Col xs={12} disableFlex key={1}>
                  <InputFormGroup
                    label={i18n.t('vote.auth.pin')}
                    id={"pin"}
                    placeholder={i18n.t('vote.auth.insert_your_pin')}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      onChange("pin", e.target.value)
                      setSameInput(false)
                    }
                    }
                    value={values["pin"]}
                    variant={FormGroupVariant.Small}
                  />
                </Col>

                {/* {showPasswordInput &&
                  <Col xs={12}>
                    <InputPasswordFormGroup
                      label={i18n.t('vote.auth.secret_key_label')}
                      id="secretKey"
                      placeholder={i18n.t('vote.auth.insert_your_secret_key')}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChangeSecretKey(e.target.value)
                        setSameInput(false)
                      }
                      }
                      value={secretKey}
                      variant={FormGroupVariant.Small}
                    />
                  </Col>
                } */}
              </Row>
              <HiddenButton type="submit"></HiddenButton>
            </form>
            <Col xs={12}>
              {/*Error MSG*/}
              {showError &&
                <>
                  <ErrorDiv>
                    <ErrorIcon>
                      <Icon
                        name='warning'
                        size={14}
                        color='#B31B35'
                      />
                    </ErrorIcon>
                    <ErrorText>{i18n.t('vote.credentials_not_accepted')}</ErrorText>
                  </ErrorDiv>
                </>
              }
            </Col>
          </Col>
          <Col xs={12}>
            <Row align='center' justify='center' gutter='xl'>
              <Col xs={12} md={5} align='center' justify='center'>
                <Button
                  wide
                  fcb
                  onClick={() => {
                    onSubmit()
                    setSameInput(true)
                  }}
                  spinner={submitEnabled && checkingCredentials}
                  disabled={!submitEnabled || checkingCredentials || showError}
                >
                  {i18n.t('fcb.enter')}
                </Button>
              </Col>

              <Col xs={12}>
                <LightText>
                  {i18n.t('fcb.login_subtext')}
                </LightText>
              </Col>
            </Row>
          </Col>
        </Row>
      </StyledFieldset>
    }
    </SignInFormCard>
  )
}

const ErrorDiv = styled.div`
  background: #FEE4D6;
  padding: 15px 26px 16px;
  border-radius: 12px;
  margin-top: -15px;
  margin-right: -20px;
`

const ErrorText = styled.div`
  color: #B31B35;
  padding-left: 10px;
  margin-left: 5px;
  line-height: 16px;
  padding-top: 3px;
  font-weight: 700;
  margin-top: -3px;
`

const ErrorIcon = styled.div`
  display:inline;
  float:left;
  margin-left:-10px;
  padding-top: 15px;

  @media ${({theme}) => theme.screenMax.mobileL} {
    svg {
      margin-top: 8px;
    }
  }
`

const HiddenButton = styled.button`
  visibility: hidden;
`

const StyledFieldset = styled.fieldset`
  max-width: 490px;
  width: 100%;
  border: none;
  margin: auto;

  @media ${({theme}) => theme.screenMax.mobileL} {
    margin-left: -10px;
  }
`

const LightText = styled.div`
  margin-top: 20px;
  font-size: 12px;
  color: #616E7C;
  margin-bottom: 0px;
`

const NotStarted = styled.fieldset`
  max-width: 600px;
  max-width: 600px;
  width: 100%;
  width: 100%;
  border: none;
  border: none;
  margin: auto;
  margin: auto;
`
