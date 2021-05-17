import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useEntityCreation } from '../../hooks/entity-creation'
import { useMessageAlert } from '../../hooks/message-alert'
import { Button } from '../button'
import i18n from '../../i18n'
import { Case, Default, If, Then, Switch } from 'react-if'
import { EntityCreationPageSteps } from '.'
import { ProcessLoader } from '@components/process-loader'
import { useScrollTop } from '@hooks/use-scroll-top'
import { SectionText, SectionTitle, TextAlign } from '@components/text'
import { colors } from 'theme/colors'
import { BlockchainConnectionError } from '@lib/validators/errors/blockchain-connection-error'
import { RetrieveGasTimeOutError } from '@lib/validators/errors/retrieve-gas-time-out-error'
import { StoringDataOnBlockchainError } from '@lib/validators/errors/storing-data-on-blockchain-error'
import { EntityNameAlreadyExistError } from '@lib/validators/errors/entity-name-already-exits-error'
import { StoreMediaError } from '@lib/validators/errors/store-media-error'
import { VocdoniConnectionError } from '@lib/validators/errors/vocdoni-connection-error'

const processSteps = [
  i18n.t('entity.confirming_details'),
  i18n.t('entity.signing_transactions'),
  i18n.t('entity.consolidating_path'),
  i18n.t('entity.validating_creation'),
]

export const FormCreation = () => {
  useScrollTop()
  const { creationError, created, methods, actionStep } = useEntityCreation()
  const { setAlertMessage } = useMessageAlert()

  useEffect(() => {
    methods.createEntity()
  }, [])
  useEffect(() => {
    const errorMessage =
      creationError instanceof Error ? creationError.message : creationError
    setAlertMessage(errorMessage)
  }, [creationError])

  useEffect(() => {
    if (created) {
      methods.setPageStep(EntityCreationPageSteps.CREATED)
    }
  }, [created])

  const uploadNewMedia = () => {
    methods.setPageStep(EntityCreationPageSteps.METADATA)
  }

  const retryEntityCreation = () => {
    methods.continueEntityCreation()
  }

  const renderErrorTemplate = (
    title: string,
    body: string,
    buttonText: string,
    callToAction: () => void
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

      <Button positive onClick={callToAction} width={200}>
        {buttonText}
      </Button>
    </ErrorContainer>
  )

  return (
    <div>
      <If condition={!creationError}>
        <Then>
          <ProcessLoader
            steps={processSteps}
            currentStep={actionStep}
            title={i18n.t('vote.your_vote_process_is_being_created')}
            subtitle={i18n.t('vote.we_are_using_a_decentralized_secure_system')}
          />
        </Then>
      </If>

      <If condition={!!creationError}>
        <Switch>
          <Case
            condition={creationError instanceof EntityNameAlreadyExistError}
          >
            {renderErrorTemplate(
              i18n.t('vote.the_entity_name_already_exist'),
              i18n.t('vote.please_choose_a_new_once_to_continue'),
              i18n.t('vote.change_entity_name'),
              uploadNewMedia
            )}
          </Case>

          <Case condition={creationError instanceof StoreMediaError}>
            {renderErrorTemplate(
              i18n.t('vote.error_storing_metadata_on_ipfs'),
              i18n.t(
                'vote.we_cant_upload_the_logos_on_ipfs_network_please_choose_a_new_logo_and_header'
              ),
              i18n.t('vote.upload_new_logo'),
              uploadNewMedia
            )}
          </Case>

          <Case condition={creationError instanceof BlockchainConnectionError}>
            {renderErrorTemplate(
              i18n.t(
                'vote.cannot_connect_to_the_blockchain_to_check_the_account_balance'
              ),
              i18n.t(
                'vote.we_are_trying_to_connect_to_blockchain_to_check_your_account_balance_we_store_all_the_data_to_follow_the_process'
              ),
              i18n.t('vote.retry'),
              retryEntityCreation
            )}
          </Case>

          <Case condition={creationError instanceof VocdoniConnectionError}>
            {renderErrorTemplate(
              i18n.t('vote.cannot_connect_to_the_vocdoni_chain'),
              i18n.t(
                'vote.we_are_trying_to_signing_on_vocdoni_chain_to_register_your_entity'
              ),
              i18n.t('vote.retry'),
              retryEntityCreation
            )}
          </Case>

          <Case condition={creationError instanceof RetrieveGasTimeOutError}>
            {renderErrorTemplate(
              i18n.t('vote.the_blockchain_network_is_congested'),
              i18n.t(
                'vote.the_blockchain_network_is_congested_for_these_reason_te_transactions_could_spend_several_minutes_dont_worry_we_keep_the_data_to_follow_the_process'
              ),
              i18n.t('vote.retry'),
              retryEntityCreation
            )}
          </Case>

          <Case
            condition={creationError instanceof StoringDataOnBlockchainError}
          >
            {renderErrorTemplate(
              i18n.t('vote.error_creating_the_entity_on_blockchain'),
              i18n.t(
                'vote.the_blockchain_network_is_congested_for_these_reason_te_transactions_could_spend_several_minutes_dont_worry_we_keep_the_data_to_follow_the_process'
              ),
              i18n.t('vote.retry'),
              retryEntityCreation
            )}
          </Case>

          <Default>
            <BottomDiv>
              <Button
                border
                onClick={() =>
                  methods.setPageStep(EntityCreationPageSteps.CREDENTIALS)
                }
              >
                {i18n.t('action.go_back')}
              </Button>
              <Button border onClick={methods.continueEntityCreation}>
                {i18n.t('action.retry')}
              </Button>
            </BottomDiv>
          </Default>
        </Switch>
      </If>
    </div>
  )
}

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
