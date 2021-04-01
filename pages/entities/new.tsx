import React, { useState } from 'react'
import styled from 'styled-components'
import { PageCard } from '../../components/cards'

import { INewEntitySteps, NewEntitySteps } from '../../components/Entities/steps'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { UseEntityCreationProvider } from '../../hooks/entity-creation'
import i18n from '../../i18n'

const NewEntity = () => {
  const [step, setStep] = useState<INewEntitySteps>('NewEntityDetails')
  const StepComponent = NewEntitySteps[step].component

  return (
    <UseEntityCreationProvider>
      <PageCard>
        <Grid>
          <Column span={6}>
            <h1>{i18n.t("entity.new_entity")}</h1>
            <SubtitleDescription>{i18n.t("entity.enter_the_details_of_the_organization")}</SubtitleDescription>
          </Column>
          <Column span={6}>
            <Steps
              steps={Object.values(NewEntitySteps).map(({ step }) => step)}
              activeIdx={Object.keys(NewEntitySteps).findIndex((name) => name === step)}
            />
          </Column>
          <Column span={12}>
            <StepComponent setStep={setStep} />
          </Column>
        </Grid>
      </PageCard>
    </UseEntityCreationProvider>
  )
}

const SubtitleDescription = styled.span`
color: ${({ theme }) => theme.textAccent1}
`

export default NewEntity
