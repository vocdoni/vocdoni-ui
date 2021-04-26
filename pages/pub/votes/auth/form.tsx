import React, { useEffect, useState } from 'react'

import { usePool, useProcess } from '@vocdoni/react-hooks'
import { Column, Grid } from '../../../../components/grid'
import { Input, Textarea } from '../../../../components/inputs'
import i18n from '../../../../i18n'
import { Button } from '../../../../components/button'
import { extractDigestedPubKeyFromString, importedRowToString } from '../../../../lib/util'
import styled from 'styled-components'
import { SectionText, SectionTitle, TextAlign } from '../../../../components/text'
import { useMessageAlert } from '../../../../hooks/message-alert'
import { useUrlHash } from 'use-url-hash'
import { Checkbox } from '@aragon/ui'
import { useWallet, WalletRoles } from '../../../../hooks/use-wallet'
import { Wallet } from '@ethersproject/wallet'
import { VOTING_PATH } from "../../../../const/routes"
import { useRouter } from 'next/router'
import { PageCard } from '../../../../components/cards'
import { CensusOffChainApi } from 'dvote-js'

const VoteAuthLogin = () => {
  const router = useRouter()
  const { poolPromise } = usePool()
  const { wallet, setWallet } = useWallet({ role: WalletRoles.VOTER })
  const processId = useUrlHash().slice(2) // Skip #/
  const invalidProcessId = !processId.match(/^0x[0-9a-fA-A]{64}$/)
  const { loading, error, process: processInfo } = useProcess(processId)
  const { setAlertMessage } = useMessageAlert()
  const [fields, setFields] = useState<string[]>([])
  const [formValues, setFormValues] = useState({})

  // ?
  const [formID, setFormID] = useState<string>("")

  // TODO: Why is this needed?
  useEffect(() => {
    setFields(formIDtoFieldNames(formID))
  }, [formID])

  // TODO: Why is this needed?
  // helper that extracts login fields
  const formIDtoFieldNames = (id: string): string[] => {
    return Buffer.from(id, 'base64').toString('utf8').split(',')
  }

  // hepler that converts form values to {privKey,digestebPubKey}
  const digestAuthFormValues = () => {
    const result: string[] = []
    for (const field of fields) {
      if (formValues[field]) {
        result.push(formValues[field])
      }
    }

    // TODO: Normalize strings
    // SEE https://github.com/vocdoni/protocol/discussions/19

    return extractDigestedPubKeyFromString(importedRowToString(result, processInfo.entity))
  }

  const onContinue = () => {

    // TODO: GET THE FIELDS AND RECOVER THE WALLET

    const { privKey, digestedHexClaim } = digestAuthFormValues()
    const voterWallet = new Wallet(privKey)
    // if(err) return setAlertMessage(...)


    return poolPromise.then(pool =>
      CensusOffChainApi.generateProof(processInfo.parameters.censusRoot, { key: digestedHexClaim }, true, pool)
    ).then(censusProof => {
      if (!censusProof) throw new Error("Invalid census proof")

      // Set the voter wallet recovered
      setWallet(voterWallet)

      // Go there
      router.push(VOTING_PATH + "#/" + processId)
    }).catch(err => {
      setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
    })
  }

  if (invalidProcessId) return <VotingErrorPage message={i18n.t('vote.the_link_you_have_followed_is_not_valid')} />
  else if (loading) return <PleaseWait />

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
              // onClick={onPreview}
              >
                {i18n.t("action.preview_proposal")}
              </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
                positive
                onClick={onContinue}
              // disabled={!hasCompleteMetadata()}
              >
                {i18n.t("action.continue")}
              </Button>
            </div>
          </BottomDiv>
        </Column>
      </Grid>
    </PageCard>
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
          {i18n.t(
            'vote.the_link_you_have_followed_is_not_valid'
          )}
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
