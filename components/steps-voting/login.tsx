import React, { useState } from 'react'

import { useProcess } from '@vocdoni/react-hooks'
import { Column, Grid } from '../grid'
import { Input, Textarea } from '../inputs'
import { checkValidProcessMetadata } from "dvote-js"
import i18n from '../../i18n'
import { Button } from '../button'
import styled from 'styled-components'
import { SectionText, SectionTitle, TextAlign } from '../text'
import { useMessageAlert } from '../../hooks/message-alert'
import { useUrlHash } from 'use-url-hash'
import { Checkbox } from '@aragon/ui'
import { useWallet } from '../../hooks/use-wallet'
import { Wallet } from '@ethersproject/wallet'
import { VOTING_AUTH_FORM_PATH } from "../../const/routes"

export const FormLogin = () => {
  const { wallet, setWallet } = useWallet({ voter: true })
  const processId = useUrlHash().slice(2) // Skip #/
  const invalidProcessId = !processId.match(/^0x[0-9a-fA-A]{64}$/)

  const processInfo = useProcess(processId)

  const { setAlertMessage } = useMessageAlert()



  const onContinue = () => {
    // TODO: Check for correctness
    // TODO: at least one question
    // TODO: at least 2 choices each


    // TODO: Set the voter wallet recovered
    setWallet(Wallet.createRandom())

    // TODO: Navigate to VOTING_AUTH_FORM_PATH + "#/<processID>"
  }


  if (invalidProcessId) {
    // TODO: Show invalid link info

    return <Grid>
      <Column>
        <SectionTitle align={TextAlign.Center}>{i18n.t('vote.login_title')}</SectionTitle>
        <SectionText align={TextAlign.Center}>
          {i18n.t(
            'vote.the_link_you_have_followed_is_not_valid'
          )}
        </SectionText>
      </Column>
    </Grid>
  }

  return (
    <Grid>
      <Column>
        <SectionTitle align={TextAlign.Center}>{i18n.t('vote.login_title')}</SectionTitle>
        <SectionText align={TextAlign.Center}>
          {i18n.t(
            'vote.login_with_your_credentials_to_access_the_process'
          )}
        </SectionText>
      </Column>
      {/* <Column>
        <SectionTitle bottomMargin>{i18n.t('vote.description')}</SectionTitle>
        <div>
          <label htmlFor='edesc'>{i18n.t('vote.brief_description')}</label>
          <Textarea
            wide
            id='edesc'
            value={metadata.description.default}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              methods.setDescription(e.target.value)
            }
          />
        </div>
      </Column>
      <Column md={6}>
        <SectionTitle>{i18n.t('vote.header')}</SectionTitle>
        <div>
          <FileLoader
            onSelect={(file) => methods.setHeaderFile(file)}
            onChange={methods.setHeaderURL}
            file={headerFile}
            url={headerURL}
            accept='.jpg,.jpeg,.png,.gif'
          />
        </div>
      </Column> */}
      <Column>
        <BottomDiv>
          <div /> {/* left space holder */}
          <div>
            <Button
              negative
              onClick={onPreview}
            >
              {i18n.t("action.preview_proposal")}
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              positive
              onClick={onContinue}
              disabled={!hasCompleteMetadata()}
            >
              {i18n.t("action.continue")}
            </Button>
          </div>
        </BottomDiv>
      </Column>
    </Grid>
  )
}

const BottomDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`
