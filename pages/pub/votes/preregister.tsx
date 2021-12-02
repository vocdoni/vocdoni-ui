import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useUrlHash } from 'use-url-hash'
import { useEntity, useProcess } from '@vocdoni/react-hooks'

import { ViewContext, ViewStrategy } from '@lib/strategy'
import {
  PreregisterFormFields,
  PreregisterView,
  IPreregisterData,
} from '@components/pages/pub/votes/preregister-view'
import { Loader } from '@components/blocks/loader'

import { useCensusActions } from '@recoil/actions/use-census-action'
import { preregisterProofState } from '@recoil/atoms/preregister-proof'

const PreregisterPage = () => {
  const [data, setData] = useState<IPreregisterData>({
    [PreregisterFormFields.Password]: '',
    [PreregisterFormFields.PasswordConfirm]: '',
  })
  const processId = useUrlHash().slice(1)
  const { generateProof } =  useCensusActions()
  const preregisterProof = useRecoilState(preregisterProofState)
  const { process, loading: loadingProcess } = useProcess(processId)
  const { metadata: entity, loading: loadingEntity } = useEntity(
    process?.state?.entityId
  )
  
  useEffect(() => {
    console.log('Updated')
    console.log(preregisterProof)
  }, [preregisterProof])

  const handleDataChange = (dataFields: IPreregisterData) => {
    console.log('the data is', dataFields)
    setData(dataFields)
  }

  const handleSubmit = async () => {
    generateProof(processId, data.passwordConfirm)
  }

  const renderPreregisterView = new ViewStrategy(
    () => !loadingProcess && !loadingEntity,
    (
      <PreregisterView
        process={process}
        entity={entity}
        values={data}
        onChange={handleDataChange}
        onSubmit={handleSubmit}
      />
    )
  )

  const renderLoadingPage = new ViewStrategy(
    () => loadingProcess || loadingEntity,
    <Loader visible />
  )

  const viewContext = new ViewContext([
    renderLoadingPage,
    renderPreregisterView,
  ])

  return <>{viewContext.getView()}</>
}

export default PreregisterPage
