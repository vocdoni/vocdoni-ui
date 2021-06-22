import React, { useState } from 'react'

import { ViewStrategy, ViewContext } from '@lib/strategy'

import { AccountImportView } from '@components/pages/entity/import'
import { AccountImportedSuccess } from '@components/pages/entity/import/imported-success'

export const AccountImportPage = () => {
  const [hasImportedAccount, setHasImportedAccount] = useState<boolean>(false)

  const handleImportedAccount = () => {
    setHasImportedAccount(true)
  }

  const renderAccountImportedPage = new ViewStrategy(
    () => hasImportedAccount,
    <AccountImportedSuccess />
  )

  const renderImportAccountPage = new ViewStrategy(
    () => true,
    <AccountImportView onImportedAccount={handleImportedAccount} />
  )

  const viewContext = new ViewContext([
    renderAccountImportedPage,
    renderImportAccountPage,
  ])

  return viewContext.getView()
}

export default AccountImportPage
