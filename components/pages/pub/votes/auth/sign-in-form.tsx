import { CardImageHeader } from '@components/blocks/card/image-header'
import {
  FormGroupVariant,
  InputFormGroup,
  InputPasswordFormGroup
} from '@components/blocks/form'
import { Col, Row, Text } from '@components/elements-v2'
import { Icon } from '@components/elements-v2/icons'
import { Button } from '@components/elements/button'
import { SignInFormCard } from '@components/elements/cards'
import { PreregisteredRedirectModal } from '@components/pages/pub/votes/components/preregistered-redirect-modal'
import { PROCESS_PATH } from '@const/routes'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useVoting } from '@hooks/use-voting'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import RouterService from '@lib/router'
import { VoteStatus } from '@lib/util'
import { useBlockHeight } from '@vocdoni/react-hooks'
import { EntityMetadata, ProcessDetails } from 'dvote-js'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useUrlHash } from "use-url-hash"


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
  shouldRedirect?: boolean
  processInfo: ProcessDetails
  entity: EntityMetadata
  onChange: (field: string, value) => void
  onSubmit: () => void
  onChangeSecretKey
}

export const SignInForm = ({
  fields,
  submitEnabled,
  values,
  secretKey,
  onChangeSecretKey,
  processInfo,
  entity,
  checkingCredentials,
  invalidCredentials,
  onSubmit,
  onChange,
  shouldRedirect,
}: IFormProps) => {
  const { i18n } = useTranslation()
  const processId = useUrlHash().slice(1)
  const { isAnonymous, status, startDate } = useProcessWrapper(processId)
  const { methods: votingMethods } = useVoting(processId)
  const router = useRouter()

  const [sameInput, setSameInput] = useState(false)
  const showError = sameInput && invalidCredentials
  const showPreregisterTitle = isAnonymous && status === VoteStatus.Upcoming
  const showPasswordInput = isAnonymous && (status === VoteStatus.Active || status === VoteStatus.Ended)
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onSubmit()
    setSameInput(true)
  }
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState<boolean>(false)
  const { setWallet } = useWallet({ role: WalletRoles.VOTER })

  const { blockHeight } = useBlockHeight()
  const processStarted = blockHeight >= processInfo?.state?.startBlock


  useEffect(() => {
    if (shouldRedirect) {
      setIsRedirectModalOpen(true)
    }
  }, [shouldRedirect])

  const handleCloseRedirectModal = () => {
    setIsRedirectModalOpen(false)
    setWallet(null)
    votingMethods.cleanup()
    router.push(RouterService.instance.get(PROCESS_PATH, { processId:processInfo?.id }))
  }

  return (
    <SignInFormCard>
      <CardImageHeader
        title={processInfo?.metadata?.title.default}
        processImage={processInfo?.metadata?.media.header}
        subtitle={entity?.name.default}
        entityImage={entity?.media.avatar}
        isHeaderExpanded={false}
      />
      <StyledFieldset disabled={checkingCredentials}>
        <Row gutter='xl'>
          {
            showPreregisterTitle &&
            <Col xs={12}>
              <Row gutter='xs'>
                <Col xs={12}>
                  <Text size='sm' weight='bold' color='dark-blue'>
                    {i18n.t('vote.auth.preregistration.title')}
                  </Text>
                </Col>
                <Col xs={12}>
                  <Text size='xs' color="dark-blue">
                    {i18n.t('vote.auth.preregistration.subtitle', { date: moment(startDate).locale(i18n.language).format('l') })}
                  </Text>
                </Col>
              </Row>
            </Col>
          }
          <Col xs={12}>
            <Text size='sm' weight='bold' color='dark-blue'>
              {showPasswordInput ?
                i18n.t('vote.auth.insert_your_credentials_and_password') :
                i18n.t('vote.auth.insert_your_credentials')
              }
            </Text>
          </Col>
          <ColWithoutMarginTop xs={12}>
            <form onSubmit={handleSubmit}>
              <Row gutter='none'>
                {fields.map((fieldName, i) =>
                  <Col xs={12} disableFlex key={i}>
                    <InputFormGroup
                      label={fieldName}
                      id={fieldName}
                      placeholder={i18n.t('vote.auth.insert_your', { field: fieldName })}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChange(fieldName, e.target.value)
                        setSameInput(false)
                      }
                      }
                      value={values[fieldName]}
                      variant={FormGroupVariant.Small}
                    />
                  </Col>
                )}

                {showPasswordInput &&
                  <Col xs={14} disableFlex key={fields.length}>
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
                }
              </Row>
              <HiddenButton type="submit"></HiddenButton>
            </form>
            <Col xs={12} md={7}>
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
          </ColWithoutMarginTop>
          <Col xs={12}>
            <Row align='center' justify='center' gutter='xl'>
              <Col xs={12} md={5} align='center' justify='center'>
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
            </Row>
          </Col>
        </Row>
        {/* REDIRECT MODAL */}
        <PreregisteredRedirectModal
            isOpen={isRedirectModalOpen}
            processStartDate={moment(startDate).locale(i18n.language).format('l')}
            onClose={handleCloseRedirectModal}
        />
      </StyledFieldset>
    </SignInFormCard>
  )
}

const ColWithoutMarginTop = styled(Col)`
  margin-top: 0px !important;
`

const HiddenButton = styled.button`
  visibility: hidden;
`

const StyledFieldset = styled.fieldset`
  max-width: 490px;
  width: 100%;
  border: none;
  margin: auto;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin-left:-10px;
  }
`

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
  padding-top: 10px;
  @media ${({ theme }) => theme.screenMax.mobileL} {
    svg {
      margin-top: 8px;
    }
  }
`
