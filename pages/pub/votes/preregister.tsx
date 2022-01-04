import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useUrlHash } from 'use-url-hash'
import { useEntity, usePool, useProcess } from '@vocdoni/react-hooks'

import { ViewContext, ViewStrategy } from '@lib/strategy'
import { IPreregisterData, PreregisterFormFields, PreregisterView } from '@components/pages/pub/votes/preregister-view'
import { Loader } from '@components/blocks/loader'

import { useCensusActions } from '@recoil/actions/use-census-action'
import { preregisterProofState } from '@recoil/atoms/preregister-proof'
import { CensusPoof } from '@lib/types'
import { censusProofState } from '@recoil/atoms/census-proof'
import { CensusOnChainApi, Voting } from 'dvote-js'
import { ProcessCensusOrigin } from 'dvote-solidity/build/data-wrappers'
import { IProofArbo } from '@vocdoni/data-models'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { bufferToBigInt } from '@vocdoni/common'
import { PreregisteredSuccessModal } from '@components/pages/pub/votes/components/preregistered-success-modal'

const PreregisterPage = () => {
  const [data, setData] = useState<IPreregisterData>({
    [PreregisterFormFields.Password]: '',
    [PreregisterFormFields.PasswordConfirm]: '',
  })
  const [preregisterSent, setPreregisterSent] = useState<boolean>(false)
  const processId = useUrlHash().slice(1)
  const { generateProof } =  useCensusActions()
  const preregisterProof = useRecoilState(preregisterProofState)
  const { process, loading: loadingProcess } = useProcess(processId)
  const { pool } = usePool()
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata: entity, loading: loadingEntity } = useEntity(
    process?.state?.entityId
  )
  const useCensusProof = useRecoilState<CensusPoof>(censusProofState)

  useEffect(() => {
    console.log('Updated')
    console.log(preregisterProof)
  }, [preregisterProof])

  const handleDataChange = (dataFields: IPreregisterData) => {
    console.log('the data is', dataFields)
    setData(dataFields)
  }

  const handleSubmit = async () => {

    const censusOrigin = new ProcessCensusOrigin(ProcessCensusOrigin.OFF_CHAIN_TREE)
    const proof = Voting.packageSignedProof(processId, censusOrigin, useCensusProof[0] as IProofArbo)

    const secretKey = bufferToBigInt(Buffer.from(data[PreregisterFormFields.PasswordConfirm], "utf-8"))

    await CensusOnChainApi.registerVoterKey(processId, proof, secretKey, BigInt(1), wallet, pool)
      .then(() => setPreregisterSent(true))
      .catch((err) => {
        console.log(err)
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
        processStartDate={"TEST DATE"}
        onClose={() => console.log("closed")}
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
