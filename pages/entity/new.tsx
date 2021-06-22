import React, { useEffect } from 'react'

import { useDbAccounts } from '@hooks/use-db-accounts'
import { useWallet } from '@hooks/use-wallet'
import {
  useEntityCreation,
  UseEntityCreationProvider,
} from '@hooks/entity-creation'

import { AccountStatus } from '@lib/types'

import {
  EntityCreationPageStep,
  EntityCreationPageStepTitles,
} from '@components/pages/entity/new'
import { Column, Grid } from '@components/elements/grid'
import { Steps } from '@components/blocks/steps'
import { PageCard } from '@components/elements/cards'
import { EntityCreationPageSteps } from '@components/pages/entity/new'
import { EntityCreationHeader } from '@components/pages/entity/new/entity-creation-header'

const NewEntity = () => {
  return (
    <UseEntityCreationProvider>
      <PageCard>
        <Grid>
          <EntityCreationHeader />
          <Column sm={12} md={7}>
            <WizardSteps />
          </Column>

          <Column span={12}>
            {/* The actual step is rendered here */}
            <EntityCreationPageStep />
          </Column>
        </Grid>
      </PageCard>
    </UseEntityCreationProvider>
  )
}


const WizardSteps = () => {
  const stepTitles = Object.values(EntityCreationPageStepTitles)
  const { pageStep, methods } = useEntityCreation()

  const { wallet } = useWallet()
  const { getAccount } = useDbAccounts()

  useEffect(() => {
    if (wallet) {
      const account = getAccount(wallet.address)

      if (!account || account.status === AccountStatus.Ready) return

      methods.setPageStep(EntityCreationPageSteps.CREATION)
      methods.continuePendingProcessCreation(account)
    }
  }, [])

  return <Steps steps={stepTitles} activeIdx={pageStep} showProgress={true} />
}

export default NewEntity
