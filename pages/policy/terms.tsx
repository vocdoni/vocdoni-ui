import { PageCard } from "@components/cards"
import { Terms } from "@components/policy/terms/layer-2";
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
