import React from 'react';
import { useRecoilValue } from 'recoil';
import { useEntity, usePool } from '@vocdoni/react-hooks';

import { walletState } from '@recoil/atoms/wallet';
import { ViewContext, ViewStrategy } from '@lib/strategy';

import { EntityBrandingView } from '@components/pages/entity/branding';
import { Loader } from '@components/blocks/loader';
import { ENTITY_SIGN_IN_PATH } from '@const/routes';
import { Redirect } from '@components/redirect';
import { uploadFileToIpfs } from '@lib/file';
import { EntityMetadata } from 'dvote-js';
import { StoreMediaError } from '@lib/validators/errors/store-media-error';
import { StoringDataOnBlockchainError } from '@lib/validators/errors/storing-data-on-blockchain-error';
import { PlazaMetadataKeys } from '@const/metadata-keys';
import { useMessageAlert } from '@hooks/message-alert';
import { useTranslation } from 'react-i18next';

const BrandingEntityPage = () => {
  const wallet = useRecoilValue(walletState)
  const { metadata, loading, updateMetadata } = useEntity(wallet?.address)
  const {setAlertMessage } = useMessageAlert()
  const { i18n } = useTranslation()
  const { pool } = usePool()

  const entityMetadata: EntityMetadata  = metadata;

  const handleSaveBranding = async (branding) => {
    if (branding.logo) {
      try {
        entityMetadata.media.logo = await uploadFileToIpfs(branding.logo, pool, wallet)
      } catch (e) {
        throw new StoreMediaError()
      }
    }

    if (branding.color) {
      entityMetadata.meta = entityMetadata.meta || {}
      entityMetadata.meta[PlazaMetadataKeys.BRAND_COLOR] = branding.color
    }

    try {
      await updateMetadata(metadata, wallet)
      setAlertMessage(i18n.t('entity.branding.branding_updated_successfully'))
    } catch (error) {
      throw new StoringDataOnBlockchainError()
    }
  }

  const renderBrandingView = new ViewStrategy(
    () => !!wallet && !loading,
    <EntityBrandingView metadata={entityMetadata} onSave={handleSaveBranding}/>
  )

  const renderRedirectView = new ViewStrategy(
    () => !wallet,
    <Redirect to={ENTITY_SIGN_IN_PATH} />
  )

  const renderLoadingView = new ViewStrategy(
    () => true,
    <Loader visible />
  )

  const viewContext = new ViewContext([
    renderBrandingView,
    renderRedirectView,
    renderLoadingView
  ])

  return viewContext.getView()
}

export default BrandingEntityPage;