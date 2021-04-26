import React, { useEffect, useState } from 'react'

import { Column, Grid } from '../../../../components/grid'
import i18n from '../../../../i18n'
import { Button } from '../../../../components/button'
import styled from 'styled-components'
import { SectionText, SectionTitle, TextAlign } from '../../../../components/text'
import { PageCard } from '../../../../components/cards'
import { useAuthForm } from '../../../../hooks/use-auth-form'
import { Checkbox } from '@aragon/ui'
import { Input } from '../../../../components/inputs'

const VoteAuthLogin = () => {
  const { invalidProcessId, loadingInfo, loadingInfoError, emptyFields, fieldNames, formValues, processInfo, methods } = useAuthForm()

  if (invalidProcessId) return <VotingErrorPage message={i18n.t('vote.the_link_you_have_followed_is_not_valid')} />
  else if (loadingInfoError) return <VotingErrorPage message={loadingInfoError} />
  else if (loadingInfo) return <PleaseWait />
  else if (!fieldNames || !fieldNames.length) return <VotingErrorPage message={i18n.t('vote.this_type_of_vote_is_not_supported_on_the_current_page')} />

  return (
    <PageCard>
      <Grid>
        <Column>
          <SectionTitle align={TextAlign.Center}>{i18n.t('vote.login_title')}</SectionTitle>
          <SectionText align={TextAlign.Center}>
            {i18n.t(
              'vote.login_with_your_credentials_to_access_the_process'
            )}
          </SectionText>
        </Column>

        {/* TODO */}

        {
          fieldNames.map((fieldName, i) => <Column md={6} key={i}>
            <SectionTitle>{fieldName}</SectionTitle>
            <Input onChange={e => methods.setFormValue(fieldName, e.target.value)} />
          </Column>)
        }

        <Column>
          <BottomDiv>
            <div /> {/* left space holder */}
            <div>
              <Button
                positive
                onClick={methods.onLogin}
                disabled={emptyFields}
              >
                {i18n.t("action.continue")}
              </Button>
            </div>
          </BottomDiv>
        </Column>
      </Grid>
    </PageCard >
  )
}

const VotingErrorPage = ({ message }: { message: string }) => (
  <PageCard>
    <Grid>
      <Column>
        <SectionTitle align={TextAlign.Center}>{i18n.t('vote.login_title')}</SectionTitle>
        <SectionText align={TextAlign.Center}>
          {message}
        </SectionText>
      </Column>
    </Grid>
  </PageCard>
)

const PleaseWait = () => (
  <PageCard>
    <Grid>
      <Column>
        <SectionTitle align={TextAlign.Center}>{i18n.t('vote.login_title')}</SectionTitle>
        <SectionText align={TextAlign.Center}>
          {i18n.t('vote.please_wait')}
        </SectionText>
      </Column>
    </Grid>
  </PageCard>
)

const BottomDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`

export default VoteAuthLogin
