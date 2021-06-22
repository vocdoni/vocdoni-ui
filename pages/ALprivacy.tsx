import { PageCard } from "@components/elements/cards"
import { ALPrivacy } from "@components/pages/policy/ALprivacy";
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
