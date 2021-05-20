import React, { useEffect } from 'react'
import { PageCard } from '../../components/cards'

import { EntityCreationPageStep, EntityCreationPageStepTitles } from '../../components/steps-entity-creation'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { MainTitle, MainDescription } from '../../components/text'
import { useEntityCreation, UseEntityCreationProvider } from '../../hooks/entity-creation'
import i18n from '../../i18n'
import { useWallet } from '@hooks/use-wallet'
import { useDbAccounts } from '@hooks/use-db-accounts'
import { useHelpCenter } from '@hooks/help-center'
import { AccountStatus } from '@lib/types'
import { EntityCreationPageSteps } from '@components/steps-entity-creation'

const NewEntity = () => {
  const { show , hide} = useHelpCenter();

  useEffect(() => {
    show()

    return () => {
      hide()
    }
  }, [])

  return (
    <UseEntityCreationProvider>
      <PageCard>
        <Grid>
          <Column sm={12} md={5}>
            <MainTitle>{i18n.t("entity.new_entity")}</MainTitle>
            <MainDescription>{i18n.t("entity.define_your_credentials_to_protect_the_account")}</MainDescription>
          </Column>

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

  const { wallet } = useWallet();
  const { getAccount } = useDbAccounts();
  
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
