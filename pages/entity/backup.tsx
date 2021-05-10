import React, { useState } from 'react'

import { ViewStrategy, ViewContext } from '@lib/strategy'

import { ENTITY_SIGN_IN_PATH } from '@const/routes'

import { useWallet, WalletRoles } from '@hooks/use-wallet'

import { Redirect } from '@components/redirect'
import { AccountBackupView } from '@components/entity/backup'
import { AccountBackupSuccess } from '@components/entity/backup/account-backup-success'


const AccountBackupPage = () => {
  const [hasBackup, setHasBackup] = useState<boolean>(false)
  const { wallet } = useWallet({ role: WalletRoles.ADMIN })

  const handleBackupDone = () => {
    setHasBackup(true)
  }

  const renderNoUserLoggedPage = new ViewStrategy(
    () => !wallet.address,
    <Redirect to={ENTITY_SIGN_IN_PATH}></Redirect>
  )

  const renderAccountBackupPage = new ViewStrategy(
    () => !hasBackup,
    <AccountBackupView onBackup={handleBackupDone} />
  )
  
  const renderAccountBackupSuccess = new ViewStrategy(
    () => hasBackup,
    <AccountBackupSuccess />
  )

  const viewContext = new ViewContext([
    renderNoUserLoggedPage,
    renderAccountBackupPage,
    renderAccountBackupSuccess
  ])
  
  return viewContext.getView()
}


export default AccountBackupPage
