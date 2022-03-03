import { PageCard } from "@components/elements/cards"
import { ALPrivacy } from "@components/pages/policy/ALprivacy"
import styled from 'styled-components'
import i18n from '@i18n'

const PageView = () => {
  const lang = i18n.language

  return (
    <>
      <PageCard>
        <ALPrivacy lang={lang}/>      
      </PageCard >
      <FooterSeparator />
    </>
  )
}

export default PageView

const FooterSeparator = styled.div`
  margin-bottom: 96px;
`