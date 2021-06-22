import React, { useState } from 'react'
import { WalletBackup } from 'dvote-js'
import { ViewContext, ViewStrategy } from '@lib/strategy'

import { QuestionsFormView } from '@components/pages/entity/recover/questions-form'
import { AccountRecoveryView } from '@components/pages/entity/recover'
import { AccountRecoveredSuccess } from '@components/pages/entity/recover/recover-success'

const RecoverPage = () => {
  const [
    hasUploadedRecoverFile,
    setHasUploadedRecoverFile,
  ] = useState<boolean>()
  const [accountBackup, setWalletBackup] = useState<WalletBackup>()
  const [accountBackupBytes, setAccountBackupBytes] = useState<Uint8Array>(null)
  const [backupRestored, setBackupRestored] = useState<boolean>(false)
  const handleBackupFileUploaded = (
    wallet: WalletBackup,
    accountInBytes: Uint8Array
  ) => {
    setHasUploadedRecoverFile(true)
    setWalletBackup(wallet)
    setAccountBackupBytes(accountInBytes)
  }

  const handleRestoreBackup = () => {
    setBackupRestored(true)
  }

  const handleSelectOtherBackup = () => {
    setWalletBackup(null)
    setAccountBackupBytes(null)
  }
  const renderRecoverView = new ViewStrategy(
    () => !accountBackup,
    <AccountRecoveryView onUploadFile={handleBackupFileUploaded} />
  )

  const renderRecoverQuestionsFormView = new ViewStrategy(
    () => hasUploadedRecoverFile && !backupRestored,
    (
      <QuestionsFormView
        accountBackup={accountBackup}
        accountBackupBytes={accountBackupBytes}
        onRestoreBackup={handleRestoreBackup}
        onSelectOtherBackup={handleSelectOtherBackup}
      />
    )
  )

  const renderBackupRestoredView = new ViewStrategy(
    () => true,
    <AccountRecoveredSuccess />
  )
  const viewContext = new ViewContext([
    renderRecoverView,
    renderRecoverQuestionsFormView,
    renderBackupRestoredView
  ])

  return viewContext.getView()
}

export default RecoverPage
