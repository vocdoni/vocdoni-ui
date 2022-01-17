import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Else, If, Then, Unless, When } from 'react-if'

import { useMessageAlert } from '@hooks/message-alert'
import { useProcessCreation } from '@hooks/process-creation'

import { Button } from '@components/elements/button'
import { Column, Grid } from '@components/elements/grid'
import { SectionText, SectionTitle, TextAlign } from '@components/elements/text'
import { ProcessLoader } from '@components/blocks/process-loader'
import { useScrollTop } from "@hooks/use-scroll-top"

import { ProcessCreationPageSteps } from '.'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spacer } from '@components/elements-v2'
import { WaitingBanner } from '@components/blocks-v2'
// import { CREATE_PROCESS_PATH, DASHBOARD_PATH } from '@../../const/routes'


export const FormCreation = () => {
  const { i18n } = useTranslation()
  const processSteps = [
    i18n.t('vote.uploading_metadata'),
    i18n.t('vote.creating_census'),
    i18n.t('vote.checking_details'),
    i18n.t('vote.creating_process'),
    i18n.t('vote.verifying_creation')
  ]

  useScrollTop()
  const {
    creationError,
    pleaseWait,
    // created,
    actionStep,
  } = useProcessCreation()
  const { methods } = useProcessCreation()
  const { setAlertMessage } = useMessageAlert()

  useEffect(() => {
    setAlertMessage(creationError)
  }, [creationError])

  return (
    <Grid>
      <Column>
        <If condition={creationError}>
          <Then>
            {/* DISPLAY ERROR */}
            <HeaderText align={TextAlign.Center}>{i18n.t("errors.something_went_wrong")}</HeaderText>
            <SectionText align={TextAlign.Center}>{creationError}</SectionText>
          </Then>
          <Else>
            {/* PLEASE WAIT */}
            <ProcessLoader
              steps={processSteps}
              currentStep={actionStep}
              title={i18n.t('vote.your_vote_process_is_being_created')}
              subtitle={i18n.t('vote.we_are_using_a_decentralized_secure_system')}
            />
            <Row justify='center' gutter='none'>
              <Col xs={12}>
                <Spacer direction='vertical' size='3xl' />
              </Col>
              <Col xs={12} md={8}>
                <WaitingBanner messages={i18n.t('votes.new.waiting_messages', { returnObjects: true })} />
              </Col>
            </Row>
          </Else>
        </If>

        {/* <If condition={created}>
          <Then>
            <BottomDiv>
              <Button href={DASHBOARD_PATH}>
                {i18n.t('action.go_to_the_dashboard')}
              </Button>
              <Button href={CREATE_PROCESS_PATH} positive>
                {i18n.t('action.create_new_proposal')}
              </Button>
            </BottomDiv>
          </Then>
          <Else> */}
        <Unless condition={pleaseWait}>
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
        </Unless>
        {/* </Else>
        </If> */}
      </Column>
    </Grid>
  )
}

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const HeaderText = styled(SectionTitle)`
  font-size: 36px;
`
