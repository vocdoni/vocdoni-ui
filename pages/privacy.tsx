import { PageCard } from "@components/cards"
import { ALPrivacy } from "@components/policy/ALprivacy";

import i18n from '@i18n';

const PageView = () => {
  const lang = i18n.language

  return (
    <PageCard>
      <ALPrivacy lang={lang}/>
    </PageCard >
  )
}

export default PageView
