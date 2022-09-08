import React from 'react'
import { useTranslation } from 'react-i18next'

import { PageCard } from '@components/elements/cards'
import { ProcessCreationPageStep, ProcessCreationPageStepTitles } from '@components/pages/votes/new'
import { Steps } from '@components/blocks/steps'
import { LayoutEntity } from '@components/pages/app/layout/entity'

import { UseProcessCreationProvider } from '@hooks/process-creation'
import { useProcessCreation } from '@hooks/process-creation'
import { Text, Row, Col, Spacer } from '@components/elements-v2'

// NOTE: This page uses a custom Layout. See below.

const NewVote = () => {
  const { i18n } = useTranslation()

  return (
    <UseProcessCreationProvider>
      <PageCard>
        <Row gutter='none'>
          <Col xs={6}>
            <Row gutter='xs'>
              <Col xs={12}>
                <Text size='display-1' weight='medium' color='dark-blue'>
                  {i18n.t("vote.new_vote")}
                </Text>
              </Col>
              <Col xs={12}>
                <Text size='sm' color='light-gray' >
                  {i18n.t("vote.enter_the_details_of_the_proposal")}
                </Text>
              </Col>
            </Row>
          </Col>
          <Col xs={6}>
            <WizardSteps />
          </Col>
          <Col xs={12}>
            <Spacer showDivider size='3xl' direction='vertical' />
          </Col>
          <Col xs={12}>
            <Spacer size='md' direction='vertical' />
          </Col>
          <Col xs={12} disableFlex>
            <ProcessCreationPageStep />
          </Col>
        </Row>
      </PageCard>
    </UseProcessCreationProvider>
  )
}

const WizardSteps = () => {
  const stepTitles = Object.values(ProcessCreationPageStepTitles)
  const { pageStep } = useProcessCreation()

  return <Steps steps={stepTitles} activeIdx={pageStep} showProgress={true} />
}

// Defining the custom layout to use
NewVote["Layout"] = LayoutEntity

export default NewVote
