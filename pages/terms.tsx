import { PageCard } from "@components/elements/cards"
import { Terms } from "@components/pages/policy/terms/layer-2";
import i18n from '@i18n';

const PageView = () => {
  const lang = i18n.language

  return (
    <PageCard>
      <Terms lang={lang} />
    </PageCard>
  )
}

export default PageView
