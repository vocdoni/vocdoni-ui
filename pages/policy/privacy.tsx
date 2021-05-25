import { PageCard } from "@components/cards"
import { Privacy } from "@components/policy/privacy/layer-2";
import i18n from '@i18n';

const PageView = () => {
  const lang = i18n.language

  return (
    <PageCard>
      <Privacy lang={lang}/>
    </PageCard >
  )
}

export default PageView
