import React, { ReactElement, useEffect } from 'react'
import styled from 'styled-components'
import { Case, Default, Else, If, Switch, Then, Unless, When } from 'react-if'

import { useMessageAlert } from '../../hooks/message-alert'
import { useProcessCreation } from '../../hooks/process-creation'

import { Button } from '../button'
import i18n from '../../i18n'
import { Column, Grid } from '../grid'
import { SectionText, SectionTitle, TextAlign } from '../text'
import { ProcessLoader } from '../process-loader'
import { useScrollTop } from '@hooks/use-scroll-top'

import { ProcessCreationPageSteps } from '.'
import { colors } from 'theme/colors'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { NoDataAvailableError } from '@lib/validators/errors/no-data-available-error'
import { InvalidStartDateError } from '@lib/validators/errors/invalid-start-date-error'
// import { CREATE_PROCESS_PATH, DASHBOARD_PATH } from '../../const/routes'

const processSteps = [
  i18n.t('vote.uploading_metadata'),
  i18n.t('vote.creating_census'),
  i18n.t('vote.checking_details'),
  i18n.t('vote.creating_process'),
  i18n.t('vote.verifying_creation'),
]

export const FormCreation = () => {
  useScrollTop()
  const {
    creationError,
    pleaseWait,
    // created,
    actionStep,
  } = useProcessCreation()
  const { methods } = useProcessCreation()
  const { setAlertMessage } = useMessageAlert()

  const renderErrorTemplate = (
    title: string,
    body: ReactElement,
    buttonText?: string,
    callToAction?: () => void
  ) => (
    <ErrorContainer>
      <TextContainer>
        <SectionTitle color={colors.danger} align={TextAlign.Center}>
          {title}
        </SectionTitle>
      </TextContainer>

      <TextContainer>
        <SectionText align={TextAlign.Center}>{body}</SectionText>
      </TextContainer>

      <ButtonsContainer justify={FlexJustifyContent.SpaceAround}>
        <Button
          border
          width={200}
          onClick={() => methods.setPageStep(ProcessCreationPageSteps.SETTINGS)}
        >
          {i18n.t('action.go_back')}
        </Button>

        {!!callToAction && (
          <Button positive onClick={callToAction} width={200}>
            {buttonText}
          </Button>
        )}
      </ButtonsContainer>
    </ErrorContainer>
  )

  useEffect(() => {
    setAlertMessage(creationError.message)
  }, [creationError])

  return (
    <Grid>
      <Column>
        <If condition={!!creationError}>
          <Switch>
            <Case condition={creationError instanceof NoDataAvailableError}>
              {renderErrorTemplate(
                i18n.t('errors.error_checking_the_data'),
                i18n.t(
                  'entity.the_blockchain_network_is_congested_for_these_reason_te_transactions_could_spend_several_minutes_dont_worry_we_keep_the_data_to_follow_the_process'
                ),
                i18n.t('entity.retry'),
                methods.continueProcessCreation
              )}
            </Case>

            <Case condition={creationError instanceof InvalidStartDateError}>
              {renderErrorTemplate(
                i18n.t('errors.invalid_start_date'),
                i18n.t(
                  'entity.invalid_start_date_the_start_date_must_be_at_least_20_minutes_from_now_please_update_start_date_and_create_again'
                )
              )}
            </Case>

            <Default>
              {renderErrorTemplate(
                i18n.t('errors.something_went_wrong'),
                i18n.t(
                  'entity.we_found_some_problems_creating_the_process_try_again'
                ),
                i18n.t('entity.retry'),
                methods.continueProcessCreation
              )}
            </Default>
          </Switch>
          <Else>
            {/* PLEASE WAIT */}
            <ProcessLoader
              steps={processSteps}
              currentStep={actionStep}
              title={i18n.t('vote.your_vote_process_is_being_created')}
              subtitle={i18n.t(
                'vote.we_are_using_a_decentralized_secure_system'
              )}
            />
          </Else>
        </If>

        {/* <Unless condition={pleaseWait}>
          <BottomDiv>
            <Button
              border
              onClick={() =>
                methods.setPageStep(ProcessCreationPageSteps.SETTINGS)
              }
            >
              {i18n.t('action.go_back')}
            </Button>
            <Button positive onClick={methods.continueProcessCreation}>
              {i18n.t('action.retry')}
            </Button>
          </BottomDiv>
        </Unless> */}
        {/* </Else>
        </If> */}
      </Column>
    </Grid>
  )
}

const ButtonsContainer = styled(FlexContainer)`
  width: 100%;
`

const TextContainer = styled.div`
  margin-bottom: 30px;
`
const ErrorContainer = styled.div`
  max-width: 560px;
  margin: 40px auto;
  display: flex;
  min-height: 300px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const HeaderText = styled(SectionTitle)`
  font-size: 36px;
`
