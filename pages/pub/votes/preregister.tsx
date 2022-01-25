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
import { CensusOnChainApi, Voting, VotingApi } from 'dvote-js'
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
  const processStartDate = VotingApi.estimateDateAtBlockSync(
    process?.state?.startBlock,
    blockStatus
  )
  let parsedStartDate
  if (processStartDate) {
    parsedStartDate = parseDate(processStartDate, 'dd/mm/yyyy')
  }

  const useCensusProof = useRecoilState<CensusPoof>(censusProofState)
  const { setAlertMessage } = useMessageAlert()

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

    await CensusOnChainApi.registerVoterKey(processId, proof, secretKey, BigInt(1), wallet, pool)
      .then(response => setPreregisterSent(true))
      .catch((err) => {
        console.log(err)
        setAlertMessage(i18n.t("errors.register_the_voter_key"))
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


