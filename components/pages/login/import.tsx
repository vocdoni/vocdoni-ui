import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import { CREATE_ACCOUNT_PATH, ACCOUNT_IMPORT_PATH } from '../../../const/routes'

import { SectionTitle, SectionText, TextAlign } from '../../elements/text'
import { Column, Grid } from '../../elements/grid'
import { SquareButton } from '../../elements/button'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'

interface SignInImportProps {
  hasAccount: boolean
}

export const SignInImport = ({ hasAccount }: SignInImportProps) => {
  const { i18n } = useTranslation()
  const { trackEvent } = useRudderStack()
  const router = useRouter()
  const title = hasAccount
    ? i18n.t('sign_in.additional_entities')
    : i18n.t('sign_in.import_an_account_or_create_a_new_entity')

  const gotToCreateEntity = () => {
    trackEvent(TrackEvents.ENTITY_CREATION_BUTTON_CLICKED)
    router.push(CREATE_ACCOUNT_PATH)
  }

  const goToImportaccount = () => {
    router.push(ACCOUNT_IMPORT_PATH)
  }

  return (
    <>
      <div>
        <SectionTitle align={TextAlign.Center}>{title}</SectionTitle>
        <SectionText align={TextAlign.Center}>
          {i18n.t(
            'sign_in.if_you_have_an_account_file_you_can_import_it_on_this_computer'
          )}
        </SectionText>
      </div>

      <ImportContainer>
        <Grid>
          <Column sm={6}>
            <ButtonContainer>
              <SquareButton
                onClick={() => goToImportaccount()}
                width={206}
                icon={
                  <img
                    src="/images/login/download.svg"
                    alt={i18n.t('sign_in.import_an_account')}
                  />
                }
              >
                <ButtonText align={TextAlign.Center}>
                  {i18n.t('sign_in.import_an_account')}
                </ButtonText>
              </SquareButton>
            </ButtonContainer>
          </Column>

          <Column sm={6}>
            <ButtonContainer>
              <SquareButton
                onClick={() => gotToCreateEntity()}
                width={206}
                icon={
                  <img
                    src="/images/login/create.svg"
                    alt={i18n.t('sign_in.create_new_entity')}
                  />
                }
              >
                <ButtonText>{i18n.t('sign_in.create_new_entity')}</ButtonText>
              </SquareButton>
            </ButtonContainer>
          </Column>
        </Grid>
      </ImportContainer>
    </>
  )
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`
const ButtonText = styled(SectionText)`
  font-weight: 500;
  height: 56px;
  font-size: 20px;
  line-height: 1.4em;
  margin-bottom: 24px;
  text-align: center;
  white-space: normal;
  margin-bottom: 16px;
`

const ImportContainer = styled.div`
  min-height: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
`
