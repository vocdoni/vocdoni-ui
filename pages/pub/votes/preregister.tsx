import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useUrlHash } from 'use-url-hash'
import { useBlockStatus, useEntity, usePool, useProcess } from '@vocdoni/react-hooks'

import { ViewContext, ViewStrategy } from '@lib/strategy'
import { IPreregisterData, PreregisterFormFields, PreregisterView } from '@components/pages/pub/votes/preregister-view'
import { Loader } from '@components/blocks/loader'

import { preregisterProofState } from '@recoil/atoms/preregister-proof'
import { CensusPoof } from '@lib/types'
import { censusProofState } from '@recoil/atoms/census-proof'
import { CensusOnChainApi, Voting, VotingApi, Symmetric } from 'dvote-js'
import { ProcessCensusOrigin } from 'dvote-solidity/build/data-wrappers'
import { IProofArbo } from '@vocdoni/data-models'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { useAuthForm } from '@hooks/use-auth-form'
import { PreregisteredSuccessModal } from '@components/pages/pub/votes/components/preregistered-success-modal'
import { useMessageAlert } from '@hooks/message-alert'
import i18n from '@i18n'
import { VOTING_PATH } from '@const/routes'
import { useRouter } from 'next/router'
import { parseDate } from '@lib/date'
import moment from 'moment'
import { useDbVoters } from '@hooks/use-db-voters'
import { InvalidIncognitoModeError } from '@lib/validators/errors/invalid-incognito-mode-error'

const PreregisterPage = () => {
  const [data, setData] = useState<IPreregisterData>({
    [PreregisterFormFields.Password]: '',
    [PreregisterFormFields.PasswordConfirm]: '',
  })
  const [preregisterSent, setPreregisterSent] = useState<boolean>(false)
  const processId = useUrlHash().slice(1)
  const { methods } = useAuthForm()
  const preregisterProof = useRecoilState(preregisterProofState)
  const { process, loading: loadingProcess } = useProcess(processId)
  const { pool } = usePool()
  const router = useRouter()
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata: entity, loading: loadingEntity } = useEntity(
    process?.state?.entityId
  )
  const { blockStatus } = useBlockStatus()
  const processStartDate = (process?.state?.startBlock) ? VotingApi.estimateDateAtBlockSync(
    process?.state?.startBlock,
    blockStatus
  ) : null
  let parsedStartDate
  if (processStartDate) {
    let momentDate = moment(processStartDate).locale('es').format("MMM DD - YYYY (HH:mm)")
    parsedStartDate = momentDate.charAt(0).toUpperCase() + momentDate.slice(1)
  }

  const useCensusProof = useRecoilState<CensusPoof>(censusProofState)
  const { setAlertMessage } = useMessageAlert()

  const { addOrUpdateVoter, getVoter } = useDbVoters()


  useEffect(() => {
    if (!wallet) {
      router.push(VOTING_PATH + "#/" + processId)
    }
  }, [])

  const handleDataChange = (dataFields: IPreregisterData) => {
    setData(dataFields)
  }

  const handleSubmit = async () => {

    const censusOrigin = new ProcessCensusOrigin(ProcessCensusOrigin.OFF_CHAIN_TREE)
    const proof = Voting.packageSignedProof(processId, censusOrigin, useCensusProof[0] as IProofArbo)

    const plainKey = data[PreregisterFormFields.PasswordConfirm]
    const secretKey = methods.calculateAnonymousKey(wallet.privateKey, plainKey, process?.state?.entityId)
    const encrAnonKey = Symmetric.encryptString(plainKey, wallet.privateKey)

    await CensusOnChainApi.registerVoterKey(processId, proof, secretKey, BigInt(1), wallet, pool)
      .then(async response => {
        try {
          await addOrUpdateVoter({
            address: wallet.address,
            processId: processId,
            encrAnonKey: encrAnonKey,
          })
          setPreregisterSent(true)
        } catch (error) {
          if (error?.message?.indexOf?.("mutation") >= 0) { // if is incognito mode throw these error
            throw new InvalidIncognitoModeError()
          }
          throw new Error(error)
        }
      })
      .catch((err) => {
        console.log(err)
        // Asume the error happens because it is already registered
        setAlertMessage(i18n.t("errors.voter_key_already_registered"))
      })

    // generateProof(processId, data.passwordConfirm)
  }

  const renderPreregisterView = new ViewStrategy(
    () => !loadingProcess && !loadingEntity && !preregisterSent,
    (
      <>
        <PreregisterView
          process={process}
          entity={entity}
          values={data}
          onChange={handleDataChange}
          onSubmit={handleSubmit}
        />
      </>
    )
  )

  const renderPreregisterSuccess = new ViewStrategy(
    () => preregisterSent,
    (
      <>
        <PreregisteredSuccessModal
          isOpen={preregisterSent}
          processStartDate={parsedStartDate}
          onClose={() => router.push(VOTING_PATH + "#/" + processId)}
        />
      </>
    )
  )

  const renderLoadingPage = new ViewStrategy(
    () => loadingProcess || loadingEntity,
    <Loader visible />
  )

  const viewContext = new ViewContext([
    renderLoadingPage,
    renderPreregisterView,
    renderPreregisterSuccess,
  ])

  return <>{viewContext.getView()}</>
}

export default PreregisterPage


